    let editorInstance = null;

    // Initialize CKEditor when the modal is shown
    document.getElementById('addPostModal').addEventListener('shown.bs.modal', function () {
        if (!editorInstance) { // Only initialize if not already created
            ClassicEditor
                .create(document.querySelector('#postContent'), {
                    toolbar: [
                        'heading', '|',
                        'bold', 'italic', 'underline', 'strikethrough', '|',
                        'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                        'insertTable', 'imageUpload', 'mediaEmbed', '|',
                        'undo', 'redo'
                    ],
                    placeholder: 'Write your post content here...',
                    height: '300px'
                })
                .then(editor => {
                    editorInstance = editor;
                    console.log('CKEditor initialized:', editor);
                })
                .catch(error => {
                    console.error('CKEditor initialization error:', error);
                });
        }
    });

    // Destroy CKEditor instance when the modal is hidden to prevent memory leaks
    document.getElementById('addPostModal').addEventListener('hidden.bs.modal', function () {
        if (editorInstance) {
            editorInstance.destroy()
                .then(() => {
                    editorInstance = null;
                    console.log('CKEditor destroyed');
                })
                .catch(error => {
                    console.error('CKEditor destruction error:', error);
                });
        }
    });

    // Handle form submission
    document.getElementById('savePostBtn').addEventListener('click', function () {
        const title = document.getElementById('postTitle').value;
        const content = editorInstance ? editorInstance.getData() : '';
        const metaTags = document.getElementById('metaTags').value;
        const metaDescription = document.getElementById('metaDescription').value;

        if (!title) {
            alert('Please enter a post title.');
            return;
        }

        console.log('Post Data:', { title, content, metaTags, metaDescription });
        alert('Post saved (logged to console)!');

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addPostModal'));
        modal.hide();
    });

    // Using for server submission later
//    document.getElementById('savePostBtn').addEventListener('click', function () {
//        const title = document.getElementById('postTitle').value;
//        const content = editorInstance ? editorInstance.getData() : '';
//        const metaTags = document.getElementById('metaTags').value;
//        const metaDescription = document.getElementById('metaDescription').value;
//    
//        if (!title) {
//            alert('Please enter a post title.');
//            return;
//        }
//    
//        fetch('/submit-post', {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/json'
//            },
//            body: JSON.stringify({ title, content, metaTags, metaDescription })
//        })
//        .then(response => response.json())
//        .then(data => {
//            console.log('Success:', data);
//            alert('Post saved successfully!');
//            const modal = bootstrap.Modal.getInstance(document.getElementById('addPostModal'));
//            modal.hide();
//        })
//        .catch(error => {
//            console.error('Error:', error);
//            alert('Failed to save post.');
//        });
//    });