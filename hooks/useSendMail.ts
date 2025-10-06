
export const useSendMail = () => {
  const sendEmail = async (to:string, subject: string, text: string) => {

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, text }),
      }).then(res => res.json());
        

      if (!response.success) {
        return {success:false, message: response.message||'Email not sent', status: 400};
      }
      return {success:true, message: response.message||'Email sent successfully',status: 200};
    } catch {
        return {success:false, message: 'Internal Server Error', status: 500};
    } 
  };

  return {sendEmail};
};
