# core/utils/email_service.py
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
import os
import logging

logger = logging.getLogger('applications')



def send_scholarship_confirmation_email(
                                        scholarship: dict, 
                                        attachment_path=None,
                                        subject = None, # Defined in the function calling
                                        ):
    """
    full_name
    Send congratulatory acceptance email with attachment for scholarship application
    
    Args:
        scholarship: Scholarship instance
        attachment_path: Path to PDF file to attach (optional)
    """
    try:
 
        
        # Email context
        context = {
            'student_name': scholarship.full_name,
        }
        
        # Render email template
        html_message = render_to_string('emails/scholarship_confirmation.html', context)
        plain_message = render_to_string('emails/scholarship_confirmation.txt', context)
        
        # Create email
        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[scholarship.email],
        )
        
        # Set HTML content type
        email.content_subtype = 'html'
        
        # Attach PDF if provided
        if attachment_path and os.path.exists(attachment_path):
            email.attach_file(attachment_path)
            logger.info(f"[Scholarship] Attached file: {attachment_path}")
        
        # Send email
        email.send()
        logger.info(f"[Scholarship] Congratulatory email sent to {scholarship.email}")
        return True
        
    except Exception as e:
        logger.error(f"[Scholarship] Failed to send email to {scholarship.email}: {str(e)}")
        return False