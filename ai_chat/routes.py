"""
Flask routes for AI Chat functionality
"""

from flask import request, jsonify
from .llm_client import LLMClient


def register_ai_chat_routes(app, config_manager):
    """
    Register AI chat routes with Flask app
    
    Args:
        app: Flask application instance
        config_manager: Configuration manager instance
    """
    
    @app.route('/api/ai-chat', methods=['POST'])
    def ai_chat():
        """
        Handle AI chat requests
        
        Expected JSON payload:
        {
            "question": "User's question",
            "page_content": "Content of the current page",
            "conversation_history": [...]  # Optional
        }
        
        Returns:
            JSON response with AI's answer
        """
        # Check if AI chat is enabled
        if not config_manager.get('ai_chat.enabled', False):
            return jsonify({
                'error': 'AI chat is not enabled'
            }), 403
        
        # Get configuration
        api_url = config_manager.get('ai_chat.api_url')
        api_key = config_manager.get('ai_chat.api_key')
        model = config_manager.get('ai_chat.model', 'gpt-4o-mini')
        
        # Validate API key
        if not api_key:
            return jsonify({
                'error': 'API key not configured'
            }), 500
        
        # Get request data
        data = request.get_json(silent=True)
        
        if not data or 'question' not in data or 'page_content' not in data:
            return jsonify({
                'error': 'Missing required fields: question and page_content'
            }), 400
        
        question = data['question']
        page_content = data['page_content']

        if not isinstance(question, str) or not question.strip():
            return jsonify({
                'error': 'Field "question" must be a non-empty string'
            }), 400

        if not isinstance(page_content, str):
            return jsonify({
                'error': 'Field "page_content" must be a string'
            }), 400

        question = question.strip()
        selected_model = data.get('model', model)  # Use selected model or default
        
        # Limit page content length
        max_length = config_manager.get('ai_chat.behavior.context_max_length', 8000)
        if len(page_content) > max_length:
            page_content = page_content[:max_length] + "..."
        
        # Get behavior configuration
        system_prompt = config_manager.get(
            'ai_chat.behavior.system_prompt',
            "You are a helpful documentation assistant."
        )
        temperature = config_manager.get('ai_chat.behavior.temperature', 0.7)
        max_tokens = config_manager.get('ai_chat.behavior.max_tokens', 1000)
        
        # Validate API URL
        if not api_url:
            return jsonify({
                'error': 'API URL not configured'
            }), 500

        try:
            # Initialize LLM client
            client = LLMClient(api_url, api_key, selected_model)
            
            # Get AI response
            answer = client.ask_about_content(
                question=question,
                page_content=page_content,
                system_prompt=system_prompt,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return jsonify({
                'answer': answer,
                'success': True
            })
        
        except Exception as e:
            return jsonify({
                'error': str(e),
                'success': False
            }), 500
    
    @app.route('/api/ai-chat/status', methods=['GET'])
    def ai_chat_status():
        """Check if AI chat is enabled and configured"""
        enabled = config_manager.get('ai_chat.enabled', False)
        api_key_configured = bool(config_manager.get('ai_chat.api_key'))
        default_model = config_manager.get('ai_chat.model', 'gpt-4o-mini')
        
        return jsonify({
            'enabled': enabled,
            'configured': api_key_configured,
            'default_model': default_model
        })
    
    @app.route('/api/ai-chat/models', methods=['GET'])
    def ai_chat_models():
        """Get available models from LLM API"""
        # Check if AI chat is enabled
        if not config_manager.get('ai_chat.enabled', False):
            return jsonify({
                'error': 'AI chat is not enabled'
            }), 403
        
        # Get configuration
        api_url = config_manager.get('ai_chat.api_url')
        api_key = config_manager.get('ai_chat.api_key')
        
        if not api_key:
            return jsonify({
                'error': 'API key not configured'
            }), 500
        
        if not api_url:
            return jsonify({
                'error': 'API URL not configured'
            }), 500

        try:
            # Initialize LLM client
            client = LLMClient(api_url, api_key, 'gpt-4o-mini')
            
            # Get available models
            models = client.get_available_models()
            
            return jsonify({
                'models': models,
                'success': True
            })
        
        except Exception as e:
            # Return a default list if API call fails
            return jsonify({
                'models': [
                    {'id': 'gpt-4o-mini', 'name': 'GPT-4o Mini'},
                    {'id': 'gpt-4o', 'name': 'GPT-4o'},
                    {'id': 'gpt-4-turbo', 'name': 'GPT-4 Turbo'},
                    {'id': 'gpt-3.5-turbo', 'name': 'GPT-3.5 Turbo'}
                ],
                'success': True,
                'fallback': True
            })
