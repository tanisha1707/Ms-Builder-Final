import { FaWhatsapp } from "react-icons/fa";

const WhatsappChatButton = () => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 md:bottom-6 md:right-6"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7" />
    </a>
  );
};

export default WhatsappChatButton;