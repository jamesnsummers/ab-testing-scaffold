export default function addStyleTagToHead(css) {
	document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
}