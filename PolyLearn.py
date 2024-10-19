from flask import Flask, render_template, request, jsonify, send_from_directory
import os

# Initialize Flask App
app = Flask(__name__, static_folder='static')

# Set the upload folder path for file uploads
UPLOAD_FOLDER = os.path.join('static', 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    file = request.files.get('file')
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        response = {'message': f'File {file.filename} uploaded successfully.'}
        return jsonify(response)
    return jsonify({'error': 'No file uploaded'}), 400

# Serve images from the uploads folder
@app.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
