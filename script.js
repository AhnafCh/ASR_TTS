// Handle service card clicks
function handleCardClick(serviceId) {
    // Add ripple effect
    const card = event.currentTarget;
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(0, 212, 255, 0.4)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.pointerEvents = 'none';
    
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    
    card.style.position = 'relative';
    card.appendChild(ripple);
    
    // Animate ripple
    ripple.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(20)', opacity: 0 }
    ], {
        duration: 600,
        easing: 'ease-out'
    }).onfinish = () => ripple.remove();
    
    // Log or handle the service selection
    console.log('Service selected:', serviceId);
    
    // You can add modal or navigation logic here
    // For example: showServiceDetails(serviceId);
}

// Handle contact form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        message: document.getElementById('message').value
    };
    
    // Show success message
    const form = event.target;
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
        color: #0a0a0a;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        font-weight: 600;
        animation: fadeInUp 0.5s ease-out;
    `;
    successMessage.textContent = 'ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।';
    
    form.appendChild(successMessage);
    
    // Reset form after 3 seconds
    setTimeout(() => {
        form.reset();
        successMessage.remove();
    }, 3000);
    
    // Log form data (in production, send to server)
    console.log('Form submitted:', formData);
    
    // In production, you would send this data to your server:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
}

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all service cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card, .client-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.05}s`;
        observer.observe(card);
    });
    
    // Add active state to navbar on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.color = 'var(--text-secondary)';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--accent-primary)';
            }
        });
    });
});

// Add parallax effect to hero gradient
window.addEventListener('scroll', () => {
    const heroGradient = document.querySelector('.hero-gradient');
    if (heroGradient) {
        const scrolled = window.scrollY;
        heroGradient.style.transform = `translateX(-50%) translateY(${scrolled * 0.5}px)`;
    }
});

// Optimize animations for mobile
if (window.matchMedia('(max-width: 768px)').matches) {
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.animationDelay = '0s';
    });
}
