const urlBtn = document.querySelector('.url-button');
urlBtn.addEventListener('click', getYoutubeVideo);

const iframe = document.querySelector('iframe');

function getYoutubeVideo() {
    let url = document.querySelector('.link-input').value;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length == 11) {
        iframe.src = `https://www.youtube-nocookie.com/embed/${match[2]}`;
    }
}