const getYTVideoBtn = <HTMLButtonElement>document.querySelector('.get-url-button');
const form = <HTMLFormElement>document.querySelector('.document');
const iframe = <HTMLIFrameElement>document.querySelector('iframe');

getYTVideoBtn?.addEventListener('click', getYoutubeVideo);
form?.addEventListener('submit', onSubmit);

function getYoutubeVideo() {
    let url = (<HTMLInputElement>document.querySelector('.link-input')).value;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length == 11 && iframe) {
        iframe.src = `https://www.youtube-nocookie.com/embed/${match[2]}`;
    } 
}

function onSubmit(e: SubmitEvent) {
    e.preventDefault();
}