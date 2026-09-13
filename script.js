const menu=document.querySelector('.menu'),mobile=document.querySelector('#mobileNav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));mobile.hidden=open;document.body.style.overflow=open?'hidden':'';menu.setAttribute('aria-label',open?'Open menu':'Close menu')});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.hidden=true;menu.setAttribute('aria-expanded','false');document.body.style.overflow=''}));
const luxuryImages=[
'https://images.pexels.com/photos/32862205/pexels-photo-32862205.jpeg?auto=compress&cs=tinysrgb&w=1800',
'https://images.unsplash.com/photo-1641996250159-9d2bbfb483fa?auto=format&fit=crop&fm=jpg&q=80&w=2200',
'https://images.pexels.com/photos/16148393/pexels-photo-16148393.jpeg?auto=compress&cs=tinysrgb&w=1800',
'https://images.pexels.com/photos/30219469/pexels-photo-30219469.jpeg?auto=compress&cs=tinysrgb&w=2200'
];
document.querySelectorAll('.piece-art').forEach((btn,i)=>{if(luxuryImages[i]){btn.dataset.image=luxuryImages[i];const img=btn.querySelector('.photo');if(img)img.src=luxuryImages[i]}});
const viewer=document.querySelector('#viewer'),viewerName=document.querySelector('#viewerName'),viewerArt=document.querySelector('.viewer-art');
document.querySelectorAll('.piece-art').forEach(btn=>btn.addEventListener('click',()=>{viewer.hidden=false;viewerName.textContent=btn.dataset.name;const image=btn.dataset.image;if(image){viewerArt.innerHTML=`<img src="${image}" alt="${btn.dataset.name}">`;viewerArt.style.cssText='width:min(900px,90vw);height:min(78vh,900px);background:#111;display:grid;place-items:center;overflow:hidden';viewerArt.querySelector('img').style.cssText='width:100%;height:100%;object-fit:contain'}document.body.style.overflow='hidden'}));
function closeViewer(){viewer.hidden=true;document.body.style.overflow='';if(viewerArt)viewerArt.innerHTML=''}
document.querySelector('.viewer-close')?.addEventListener('click',closeViewer);viewer?.addEventListener('click',e=>{if(e.target===viewer)closeViewer()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!viewer.hidden)closeViewer();if(!mobile.hidden){mobile.hidden=true;menu.setAttribute('aria-expanded','false');document.body.style.overflow=''}}});
const form=document.querySelector('#contactForm'),status=document.querySelector('#status');
form?.addEventListener('submit',e=>{e.preventDefault();if(!form.checkValidity()){status.textContent='Please complete your name, email and message.';form.reportValidity();return}status.textContent='Thank you — your enquiry is ready to be sent.';form.reset()});
const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.style.opacity='1';x.target.style.transform='none';io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll('.piece,.story-copy,.story-image,.steps>div,.statement-grid,.section-head,.contact>div,.contact form').forEach(x=>{x.style.opacity='0';x.style.transform='translateY(24px)';x.style.transition='opacity .9s ease,transform .9s ease';io.observe(x)});
