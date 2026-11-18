document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav-menu');
  const toggle = document.querySelector('.mobile-toggle');

  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    const page = link.getAttribute('href');
    if (page === currentPage) {
      link.classList.add('active');
    }
  });

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const uploadInput = document.querySelector('#garden-photo');
  const previewImage = document.querySelector('.preview-image');

  if (uploadInput && previewImage) {
    uploadInput.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  }

  const form = document.getElementById('checkout-form');
  const successBox = document.getElementById('order-success');
  const payButtons = document.querySelectorAll('[data-pay-step]');

  if (form) {
    const steps = [...document.querySelectorAll('.checkout-step')];
    const stepIndicators = [...document.querySelectorAll('.step')];
    let currentStep = 0;

    const setStep = (stepIndex) => {
      currentStep = stepIndex;
      steps.forEach((step, index) => {
        step.style.display = index === currentStep ? 'block' : 'none';
      });

      stepIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentStep);
      });
    };

    if (steps.length) {
      setStep(0);
    }

    const gotoNext = () => {
      if (currentStep < steps.length - 1) {
        setStep(currentStep + 1);
      }
    };

    const gotoPrevious = () => {
      if (currentStep > 0) {
        setStep(currentStep - 1);
      }
    };

    document.querySelector('[data-next-step]')?.addEventListener('click', () => {
      gotoNext();
    });

    document.querySelector('[data-prev-step]')?.addEventListener('click', () => {
      gotoPrevious();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;

      if (paymentMethod !== 'card') {
        window.location.href = 'contacto.html?motivo=pago';
        return;
      }

      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.reportValidity();
        }
      });

      if (!isValid) return;

      const payButton = document.querySelector('[data-submit-payment]');
      if (payButton) {
        payButton.disabled = true;
        payButton.textContent = 'Procesando pago...';
      }

      setTimeout(() => {
        if (successBox) {
          successBox.style.display = 'block';
          successBox.textContent = 'Pedido confirmado. Tu sistema de riego AGROMATIC ya está en preparación.';
        }
        setStep(2);
        if (payButton) {
          payButton.textContent = 'Pago realizado';
        }
      }, 1600);
    });

    document.querySelectorAll('input[name="payment-method"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const cardFields = document.getElementById('card-fields');
        if (!cardFields) return;
        if (radio.value === 'card') {
          cardFields.style.display = 'grid';
        } else {
          cardFields.style.display = 'none';
        }
      });
    });
  }

  const contactForms = document.querySelectorAll('[data-contact-form]');
  contactForms.forEach((formEl) => {
    formEl.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = formEl.querySelector('.form-message');
      if (message) {
        message.textContent = 'Gracias. Un asesor se pondrá en contacto contigo en menos de 24 horas.';
        message.style.display = 'block';
      }
      formEl.reset();
    });
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('motivo') === 'pago') {
    const el = document.querySelector('.contact-banner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  payButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-pay-step');
      if (target === 'shipping') {
        document.querySelector('[data-next-step]')?.click();
      }
    });
  });
});
