document.addEventListener("DOMContentLoaded", function () {
    const editProfileBtn = document.getElementById("editProfileBtn");
    const changePasswordBtn = document.getElementById("changePasswordBtn");
    const editProfileSection = document.getElementById("editProfile");
    const changePasswordSection = document.getElementById("changePassword");

    editProfileBtn.addEventListener("click", function () {
        editProfileSection.classList.remove("hidden");
        changePasswordSection.classList.add("hidden");
    });

    changePasswordBtn.addEventListener("click", function () {
        changePasswordSection.classList.remove("hidden");
        editProfileSection.classList.add("hidden");
    });
});

const uploadPhotoInput = document.getElementById("upload-photo");
const previewPhoto = document.getElementById("preview-photo");

// Xử lý khi tải ảnh lên
uploadPhotoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            previewPhoto.src = reader.result; // Hiển thị ảnh trong avatar
        };
        reader.readAsDataURL(file);
    }
});