import { whatsappLink } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-ic.png";

const WhatsAppButton = () => {
  return (
    <a
      href={whatsappLink("Hello, I'm interested in your safety products")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <img
        src={whatsappIcon}
        alt=""
        aria-hidden="true"
        className="h-14 w-14 object-contain drop-shadow-lg transition-transform group-hover:scale-110"
      />
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-secondary text-secondary-foreground px-3 py-1.5 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppButton;
