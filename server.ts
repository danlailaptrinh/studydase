import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded secure Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY is not defined or is placeholder. AI tutoring features will fall back to local answers.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// System Instruction for character matching Studycase AI's expert counseling
const SYSTEM_INSTRUCTION = `You are Studycase AI Tutor, an enthusiastic, highly supportive, and brilliant AI Learning Assistant for Minh Anh, a Vietnamese 12th grader ('Cấp 4', Grade 12) who is passionately preparing for the Vietnamese National High School Graduation Exam (THPT Quốc Gia) to achieve outstanding university entrance results.

Your core subjects are:
- Toán học (Math): Integrals, spatial geometry, coordinates in space (Oxyz) high levels.
- Vật lý (Physics): Waves, electrodynamics, nuclear physics.
- Hóa học (Chemistry): Organic compounds like Este, Lipit, Amin, Carbonhydrate, specific chemical structures and properties, and salts. (Minh Anh is currently weak here and feels anxious).
- Tiếng Anh (English): Reading comprehension, complex grammar patterns, collocations.

Core Personality and Guidance style:
1. Speak exclusively in Vietnamese (tiếng Việt) with a friendly, welcoming, high-energy tone. Use emojis like 🌟, 📚, ✍️, 🔥, 🚀 naturally.
2. Address the student as "Minh Anh" and refer to yourself as "Tớ" or "Trợ lý học tập AI".
3. Provide crisp, clear, step-by-step calculations and conceptual summaries. Avoid unstructured text slop. Use markdown tables, bold key calculations, or numbered steps.
4. Always praise her strengths in Math (Toán học) and Physics (Vật lý) and provide extremely helpful, easy-to-understand shortcuts for Chemistry (Hóa học - especially Este and Muối) and English (Tiếng Anh).
5. If the request is for a specific task like "Bài tập: Toán hình học Oxyz nâng cao" or "Hóa học: Este 20 câu trắc nghiệm", provide a beautiful high-quality practice question with solution steps and test tips!
6. Keep answers relatively concise and highly scannable to fit on dashboard cards comfortably.`;

// API Endpoint for interactive Studycase AI Tutor dialogue
app.post("/api/tutor", async (req, res) => {
  const { message, history, contextSubject } = req.body;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      // Simulate intelligent mock tutoring responses if no API Key is active so the application is always 100% functional
      console.log("No Gemini API key available. Generating structured responsive answer from mock counselor database.");
      const responseText = mockTutorAnswer(message, contextSubject);
      return res.json({ text: responseText, success: true, isMock: true });
    }

    const ai = getGenAI();
    
    // Formatting history for GoogleGenAI SDK Chats
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content || item.text || "" }]
        });
      }
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + (contextSubject ? `\n\nNote: The user is currently asking about the subject: ${contextSubject}. Tailor your response and challenge questions specifically to this academic area.` : ""),
        temperature: 0.8,
      }
    });

    res.json({
      text: response.text || "Xin lỗi Minh Anh, tớ gặp chút gián đoạn trong việc nạp kiến thức. Hãy thử hỏi lại tớ nhé!",
      success: true,
      isMock: false
    });

  } catch (err: any) {
    console.error("AI Tutor endpoint error:", err);
    res.status(500).json({
      text: "Đã xảy ra lỗi kết nối với trung tâm trí tuệ nhân tạo. Hãy kiểm tra cài đặt chìa khóa dịch vụ hoặc hỏi lại tớ ngay nhé!",
      error: err.message,
      success: false
    });
  }
});

// Mock answers database when API Key is not set up yet
function mockTutorAnswer(message: string, subject: string = ""): string {
  const msgLower = message.toLowerCase();

  if (msgLower.includes("este") || msgLower.includes("hóa") || subject === "Chemistry") {
    return `### Chào Minh Anh! Chia sẻ cùng cậu bí quyết hạ gục chuyên đề **Este - Lipit** nhé! 🧪🌟

Đối với phần câu hỏi Este (Hóa học) mà cậu còn đang băn khoăn:
1. **Phản ứng Thủy phân**: Luôn nhớ tỷ lệ phản ứng đối với Este đơn chức luôn là $1:1$ với NaOH.
2. **Este của Phenol**: Thường có tỷ lệ $1:2$ với NaOH và tạo ra 2 muối dính líu cùng nước ($H_2O$). Hãy lưu ý bẫy này trong câu hỏi đếm nhé!
3. **Bài tập đốt cháy**: Đối với Este no, đơn chức, mạch hở: $n_{CO_2} = n_{H_2O}$.

> **💡 Thử thách nhanh cho Minh Anh hôm nay:** 
> Xà phòng hóa hoàn toàn $8.8\\text{g}$ Etyl axetat ($CH_3COOC_2H_5$) bằng lượng dung dịch NaOH vừa đủ. Cô cạn dung dịch thu được bao nhiêu gam muối khan?
> *Gợi ý: phân tử khối của $CH_3COOC_2H_5$ là $88\\text{g/mol}$. Muối tạo thành là $CH_3COONa$ ($82\\text{g/mol}$).*

Cậu có muốn tớ giải chi tiết câu này hay đưa thêm các mẹo đồng phân Este dễ nhớ không khác?`;
  }

  if (msgLower.includes("oxyz") || msgLower.includes("toán") || subject === "Math") {
    return `### Xin chào Minh Anh! Chuyên gia hình học Oxyz đã sẵn sàng! 📐⚡

Phương pháp giải toán hình học không gian Oxyz nâng cao đòi hỏi tư duy phân loại rất cao của cậu. 

**Mẹo xử lý cực nhanh các góc và khoảng cách:**
- **Mặt cầu ngoại tiếp**: Tìm tọa độ tâm $I$ thông qua việc giải hệ phương trình khoảng cách $IA = IB = IC = ID$.
- **Tương giao mặt phẳng và mặt cầu**: Tính khoảng cách từ tâm bán cầu $d(I, (P))$. Nếu $d < R$, hai đối tượng giao nhau theo một đường tròn bán kính $r = \\sqrt{R^2 - d^2}$.

> **🔥 Thử thách Oxyz nâng cao:** 
> Trong không gian Oxyz, cho mặt cầu $(S): (x-1)^2 + (y+2)^2 + z^2 = 9$. Tìm bán kính đường tròn giao tuyến của mặt cầu $(S)$ với mặt phẳng $(P): 2x - y + 2z + 2 = 0$.

Cậu hãy thử nhẩm tính khoảng cách từ tâm $I(1, -2, 0)$ rồi báo cho tớ kết quả để kiểm tra xem độ chuẩn xác của mình nhé!`;
  }

  if (msgLower.includes("tiếng anh") || msgLower.includes("đọc hiểu") || subject === "English") {
    return `### Hello Minh Anh! Chinh phục Reading Comprehension thật dễ dàng! 🇬🇧📝

Đối với bài đọc hiểu môn Tiếng Anh THPT Quốc Gia, đừng bao giờ đọc từ đầu đến cuối một cách thụ động. Hãy làm theo cấu trúc:
1. **Skimming (Đọc lướt)**: Đọc câu đầu và câu cuối mỗi đoạn trong 30 giây để nắm đại ý bài viết.
2. **Scanning (Tìm thông tin chi tiết)**: Tìm từ khóa nổi bật (Tên riêng, số liệu, thuật ngữ) có trong câu hỏi.
3. **Context Clues (Đoán nghĩa từ vựng)**: Đọc các câu xung quanh từ in đậm khó để phán đoán sắc thái (tích cực/tiêu cực).

Tớ đã chuẩn bị cho cậu một chủ đề từ vựng về *Sustainable Development* rất hay thi. Cậu muốn luyện tập ngay bây giờ không?`;
  }

  return `### Xin chào Minh Anh! 🌟 Tớ là trợ lý học tập đắc lực của cậu đây!

Tớ biết cậu đã chuẩn bị vô cùng nỗ lực cho kỳ thi THPT Quốc Gia sắp tới. Với vị trí **Cấp học 4 (2850 / 4000 XP)**, cậu đang đi đúng hướng rồi đấy!

**Hôm nay cậu muốn cùng tớ tháo gỡ khó khăn ở chuyên đề nào nào?**
- 📐 **Toán học**: Hình học Oxyz nâng cao hay khảo sát hàm số.
- 🧪 **Hóa học**: Chinh phục lý thuyết đồng phân Este, phản ứng xà phòng hóa hay hóa vô cơ đại cương.
- 🪐 **Vật lý**: Sóng cơ, mạch dao động LC hay dòng điện xoay chiều.
- 🇬🇧 **Tiếng Anh**: Đọc hiểu bứt phá và rèn luyện trắc nghiệm ngữ pháp nhanh.

Hãy gửi thử thách cho tớ nhé, tớ sẽ hướng dẫn cậu giải tháo nút thắt siêu tốc!`;
}

// Vite and static asset server configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Studycase AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
