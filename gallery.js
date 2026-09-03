const lightbox=document.getElementById("lightbox");
const lightboxImage=document.getElementById("lightboxImage");
const closeLightbox=document.getElementById("closeLightbox");
document.querySelectorAll(".gallery img").forEach(function(image){
  image.addEventListener("click",function(){
    lightboxImage.src=this.src;
    lightboxImage.alt=this.alt;
    lightbox.classList.add("active");
  });
});
closeLightbox.addEventListener("click",function(){lightbox.classList.remove("active");});
lightbox.addEventListener("click",function(event){if(event.target===lightbox){lightbox.classList.remove("active");}});
document.addEventListener("keydown",function(event){if(event.key==="Escape"){lightbox.classList.remove("active");}});
