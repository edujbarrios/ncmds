"""
LLM Client for interacting with LLM7.io API
"""

import requests
from typing import Dict, Any, List, Optional


class LLMClient:
    """Client for LLM7.io API"""
    
    def __init__(self, api_url: str, api_key: str, model: str = "gpt-4o-mini"):
        """
        Initialize LLM client
        
        Args:
            api_url: LLM7.io API endpoint URL
            api_key: API key for authentication
            model: Model to use for completions
        """
        self.api_url = api_url
        self.api_key = api_key
        self.model = model
    
    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Send a chat completion request to LLM7.io
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens to generate
            stream: Whether to stream the response
            
        Returns:
            API response as dictionary
            
        Raises:
            Exception: If API request fails
        """
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": stream
        }
        
        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        
        except requests.exceptions.HTTPError as e:
            # Provide detailed error information
            error_msg = f"LLM API HTTP Error {e.response.status_code}: {e.response.reason}"
            try:
                error_detail = e.response.json()
                error_msg += f" - {error_detail}"
            except Exception:
                error_msg += f" - {e.response.text[:200]}"
            
            # Add helpful hints based on status code
            if e.response.status_code == 405:
                error_msg += "\n\nHint: The API endpoint URL might be incorrect. "
                error_msg += "Try these alternatives in config.yaml:\n"
                error_msg += "  - https://api.llm7.io/v1/chat/completions\n"
                error_msg += "  - https://api.llm7.io/chat/completions\n"
                error_msg += "  - https://llm7.io/api/v1/chat/completions"
            elif e.response.status_code == 401:
                error_msg += "\n\nHint: Check your API key in config.yaml"
            elif e.response.status_code == 404:
                error_msg += "\n\nHint: The endpoint doesn't exist. Verify the API URL."
            
            raise Exception(error_msg)
        
        except requests.exceptions.RequestException as e:
            raise Exception(f"LLM API request failed: {str(e)}")
    
    def ask_about_content(
        self,
        question: str,
        page_content: str,
        system_prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """
        Ask a question about specific page content
        
        Args:
            question: User's question
            page_content: Content of the documentation page
            system_prompt: System prompt to guide the AI
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Returns:
            AI's response as a string
        """
        messages = [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": f"Documentation content:\n\n{page_content}\n\nQuestion: {question}"
            }
        ]
        
        response = self.chat_completion(
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        # Extract the response text
        if "choices" in response and len(response["choices"]) > 0:
            choice = response["choices"][0]
            message = choice.get("message") if isinstance(choice, dict) else None
            if isinstance(message, dict) and "content" in message:
                return message["content"]
        raise Exception("Invalid response format from LLM API")
    
    def get_available_models(self) -> List[Dict[str, str]]:
        """
        Get available models from the LLM API
        
        Returns:
            List of model dictionaries with 'id' and 'name'
        """
        # Try to fetch models from API
        models_url = self.api_url.replace('/chat/completions', '/models')
        
        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }
        
        try:
            response = requests.get(
                models_url,
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            
            # Filter for text-based models only (exclude image, audio, etc.)
            text_models = []
            if "data" in data:
                for model in data["data"]:
                    model_id = model.get("id", "")
                    # Filter out non-text models
                    if any(excluded in model_id.lower() for excluded in ['dall-e', 'whisper', 'tts', 'embedding']):
                        continue
                    
                    # Create readable name
                    name = model_id.replace('-', ' ').title()
                    text_models.append({
                        'id': model_id,
                        'name': name
                    })
            
            return text_models if text_models else self._get_fallback_models()
        
        except Exception:
            # Return fallback models if API call fails
            return self._get_fallback_models()
    
    def _get_fallback_models(self) -> List[Dict[str, str]]:
        """
        Get fallback list of common text models
        
        Returns:
            List of common model dictionaries
        """
        return [
            {'id': 'gpt-4o-mini', 'name': 'GPT-4o Mini'},
            {'id': 'gpt-4o', 'name': 'GPT-4o'},
            {'id': 'gpt-4-turbo', 'name': 'GPT-4 Turbo'},
            {'id': 'gpt-4', 'name': 'GPT-4'},
            {'id': 'gpt-3.5-turbo', 'name': 'GPT-3.5 Turbo'},
            {'id': 'claude-3-5-sonnet-20241022', 'name': 'Claude 3.5 Sonnet'},
            {'id': 'claude-3-opus-20240229', 'name': 'Claude 3 Opus'},
            {'id': 'claude-3-sonnet-20240229', 'name': 'Claude 3 Sonnet'}
        ]
