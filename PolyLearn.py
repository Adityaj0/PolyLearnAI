from flask import Flask, render_template, request, jsonify
import os

# Initialize Flask App
app = Flask(__name__)

# Serve the Landing Page
@app.route('/')
def landing_page():
    return render_template('landingPage.html')

# Serve the Second Page
@app.route('/second')
def second_page():
    return render_template('secondPage.html')

# Endpoint for Uploading Content (e.g., PDF/Text)
@app.route('/upload', methods=['POST'])
def upload_content():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            file_path = os.path.join('static/uploads', file.filename)
            file.save(file_path)
            # Placeholder: Process the file (e.g., summarization logic)
            response = {'message': f'File {file.filename} uploaded successfully.'}
            return jsonify(response)
    return jsonify({'error': 'No file uploaded'}), 400

# API Integration Endpoint Example (e.g., Text Summarization)
@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text')
    if text:
        # Placeholder: Call the summarization API and return the result
        summarized_text = f"Summarized version of: {text}"
        return jsonify({'summary': summarized_text})
    return jsonify({'error': 'No text provided'}), 400

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
