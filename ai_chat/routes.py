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
        data = request.get_json()
        
        if not data or 'question' not in data or 'page_content' not in data:
            return jsonify({
                'error': 'Missing required fields: question and page_content'
            }), 400
        
        question = data['question']
        page_content = data['page_content']
        
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
        
        try:
            # Initialize LLM client
            client = LLMClient(api_url, api_key, model)
            
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
        
        return jsonify({
            'enabled': enabled,
            'configured': api_key_configured
        })
