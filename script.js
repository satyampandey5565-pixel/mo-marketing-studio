const menu=document.querySelector('.menu'),mobile=document.querySelector('#mobileNav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));mobile.hidden=open;document.body.style.overflow=open?'hidden':'';menu.setAttribute('aria-label',open?'Open menu':'Close menu')});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.hidden=true;menu.setAttribute('aria-expanded','false');document.body.style.overflow=''}));
const viewer=document.querySelector('#viewer'),viewerName=document.querySelector('#viewerName');
document.querySelectorAll('.piece-art').forEach(btn=>btn.addEventListener('click',()=>{viewer.hidden=false;viewerName.textContent=btn.dataset.name;document.body.style.overflow='hidden'}));
function closeViewer(){viewer.hidden=true;document.body.style.overflow=''}
document.querySelector('.viewer-close')?.addEventListener('click',closeViewer);viewer?.addEventListener('click',e=>{if(e.target===viewer)closeViewer()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!viewer.hidden)closeViewer();if(!mobile.hidden){mobile.hidden=true;menu.setAttribute('aria-expanded','false');document.body.style.overflow=''}}});
const form=document.querySelector('#contactForm'),status=document.querySelector('#status');
form?.addEventListener('submit',e=>{e.preventDefault();if(!form.checkValidity()){status.textContent='Please complete your name, email and message.';form.reportValidity();return}status.textContent='Thank you — your enquiry is ready to be sent.';form.reset()});
const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.style.opacity='1';x.target.style.transform='none';io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll('.piece,.story-copy,.story-image,.steps>div,.statement-grid,.section-head,.contact>div,.contact form').forEach(x=>{x.style.opacity='0';x.style.transform='translateY(24px)';x.style.transition='opacity .9s ease,transform .9s ease';io.observe(x)});