import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import './ChatboxAI.scss';
import { BiCommentDetail } from 'react-icons/bi';
import { RiRobot3Fill } from 'react-icons/ri';

interface ChatboxAIProps {
  initialMessage?: string;
}

export interface ChatboxAIRef {
  openChatbox: (message?: string) => void;
}

const ChatboxAI = forwardRef<ChatboxAIRef, ChatboxAIProps>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  const addWelcomeMessage = () => {
    setMessages([
      {
        text: "Xin chào! Tôi là trợ lý ảo của Kim Beauty & Spa. Tôi có thể giúp gì cho bạn?",
        isUser: false
      }
    ]);
  };

  const handleToggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen && messages.length === 0) {
      addWelcomeMessage();
    }
  };

  useImperativeHandle(ref, () => ({
    openChatbox: (message?: string) => {
      setIsOpen(true);
      addWelcomeMessage();
      
      if (message) {
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: message,
            isUser: false
          }]);
          setIsTyping(false);
        }, 1000);
      }
    }
  }));

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);
    setInputMessage('');

    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: generateResponse(inputMessage),
        isUser: false
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className={`chatbox-ai ${isOpen ? 'open' : ''}`}>
      <button className="chatbox-toggle" onClick={handleToggleChat}>
      <RiRobot3Fill className='chatbox-icon'/>
      </button>

      {isOpen && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <h3>Chat với AI</h3>
            <button onClick={handleToggleChat}>×</button>
          </div>
          
          <div className="chatbox-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.isUser ? 'user' : 'ai'}`}
              >
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="message ai typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbox-input">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
});

const generateResponse = (message: string) => {
  const responses = {
    default: "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về dịch vụ spa, đặt lịch hoặc các chương trình khuyến mãi.",
    keywords: {
        // Các lời chào
  'xin chào': 'Xin chào quý khách! Em có thể giúp gì cho anh/chị ạ?',
  'chào': 'Chào anh/chị! Em có thể tư vấn gì cho anh/chị về dịch vụ của Kim Beauty & Spa ạ?',
  'hi': 'Hi anh/chị! Em là trợ lý ảo của Kim Beauty & Spa, em có thể giúp gì cho anh/chị ạ?',
  'hello': 'Hello! Rất vui được tư vấn cho anh/chị. Anh/chị quan tâm đến dịch vụ nào của spa ạ?',
  'hey': 'Hey! Em có thể giúp anh/chị tìm hiểu về các dịch vụ hoặc đặt lịch hẹn ạ.',
  'thích': 'Thích anh/chị! Em có thể giúp anh/chị tìm hiểu về các dịch vụ hoặc đặt lịch hẹn ạ.',
  'yêu': 'Tôi yêu bạn 3000',
  'đẹp': 'Bạn rất xinh đẹp',
        // Thông tin chung
        'giá': 'Các dịch vụ của chúng tôi có giá từ 300.000đ đến 2.000.000đ tùy loại. Bạn quan tâm đến dịch vụ nào?',
        'đặt lịch': 'Để đặt lịch, bạn có thể click vào nút "Đặt lịch ngay" hoặc gọi số 0123456789',
        'địa chỉ': 'Kim Beauty & Spa tọa lạc tại 123 Đường ABC, Quận XYZ, TP.HCM',
        'giờ làm việc': 'Chúng tôi mở cửa từ 9:00 - 21:00 các ngày trong tuần',
        
        // Dịch vụ
        'massage': 'Chúng tôi có các loại massage: Massage thư giãn, massage đá nóng, massage tinh dầu, massage body, massage foot. Bạn muốn tư vấn loại nào?',
        'chăm sóc da': 'Dịch vụ chăm sóc da của chúng tôi bao gồm: Chăm sóc da cơ bản, chăm sóc da chuyên sâu, trị mụn, trẻ hóa da...',
        'triệt lông': 'Dịch vụ triệt lông công nghệ cao, an toàn và hiệu quả. Cam kết không đau, không để lại sẹo.',
        'tắm trắng': 'Dịch vụ tắm trắng với công nghệ hiện đại, sử dụng các sản phẩm cao cấp, an toàn cho da.',
        'nail': 'Dịch vụ nail bao gồm: Sơn gel, đắp bột, vẽ móng nghệ thuật, chăm sóc móng...',
        
        // Thanh toán và ưu đãi
        'thanh toán': 'Chúng tôi chấp nhận thanh toán bằng tiền mặt, chuyển khoản và thẻ tín dụng. Có thể thanh toán trước hoặc sau khi sử dụng dịch vụ.',
        'khuyến mãi': 'Hiện tại chúng tôi đang có các chương trình ưu đãi:\n- Giảm 20% cho khách hàng mới\n- Tặng 1 buổi massage khi mua combo 5 buổi\n- Ưu đãi đặc biệt cho sinh nhật',
        'thẻ thành viên': 'Thẻ thành viên có 3 hạng: Bạc, Vàng, Kim cương với nhiều đặc quyền khác nhau. Tích điểm 5% giá trị mỗi lần sử dụng dịch vụ.',
        
        // Chất lượng và cam kết
        'bảo hành': 'Chúng tôi cam kết hoàn tiền 100% nếu quý khách không hài lòng với dịch vụ trong vòng 24h.',
        'chuyên gia': 'Đội ngũ nhân viên của chúng tôi đều được đào tạo chuyên nghiệp, có chứng chỉ hành nghề và nhiều năm kinh nghiệm.',
        'sản phẩm': 'Chúng tôi sử dụng các sản phẩm cao cấp, nhập khẩu chính hãng từ các thương hiệu nổi tiếng.',
        
        // Câu hỏi thường gặp
        'đau không': 'Các dịch vụ của chúng tôi đều được thực hiện nhẹ nhàng, đảm bảo thoải mái cho khách hàng. Nếu có bất kỳ khó chịu nào, bạn có thể thông báo ngay cho nhân viên.',
        'hiệu quả': 'Hiệu quả của liệu trình phụ thuộc vào từng người, thông thường khách hàng sẽ thấy kết quả rõ rệt sau 3-5 buổi.',
        'có wifi': 'Có, chúng tôi có wifi miễn phí cho khách hàng. Bạn có thể hỏi nhân viên để được cung cấp mật khẩu.',
        'parking': 'Chúng tôi có bãi đỗ xe máy và ô tô miễn phí cho khách hàng.',
        
        // Tư vấn thêm
        'liệu trình': 'Chúng tôi sẽ tư vấn liệu trình phù hợp dựa trên tình trạng và mong muốn của bạn. Thông thường một liệu trình sẽ từ 5-10 buổi.',
        'chống chỉ định': 'Vui lòng thông báo cho nhân viên nếu bạn đang mang thai, có bệnh lý về da hoặc đang điều trị y tế để được tư vấn dịch vụ phù hợp.',
        'tác dụng phụ': 'Các dịch vụ của chúng tôi đều an toàn, tuy nhiên có thể có hiện tượng hơi đỏ da nhẹ sau khi làm và sẽ hết sau vài giờ.'
      }
  };

  const lowercaseMsg = message.toLowerCase();
  for (const [keyword, response] of Object.entries(responses.keywords)) {
    if (lowercaseMsg.includes(keyword)) {
      return response;
    }
  }
  return responses.default;
};

export default ChatboxAI; 