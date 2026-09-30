const enquiryForm = document.getElementById('enqForm');
const enquiryNotice = document.getElementById('enqDone');

if (enquiryForm) {
  enquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = enquiryForm.querySelector('[type="submit"]');
    const formData = new FormData(enquiryForm);
    const previousButtonText = submitButton?.textContent;

    formData.set('form-name', enquiryForm.name);
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) {
        throw new Error('Enquiry submission failed');
      }

      enquiryForm.reset();
      if (enquiryNotice) {
        enquiryNotice.hidden = false;
        enquiryNotice.classList.remove('err');
        enquiryNotice.textContent = 'Thank you. Your enquiry has been sent. We will be in touch using the email address you provided.';
      }
    } catch {
      if (enquiryNotice) {
        enquiryNotice.hidden = false;
        enquiryNotice.classList.add('err');
        enquiryNotice.textContent = 'We could not send your enquiry. Please try again later.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = previousButtonText;
      }
    }
  });
}

