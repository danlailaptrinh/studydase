import { Lesson, Quiz, Exam } from "../types";

export const mockLessons: Lesson[] = [
  {
    id: "l1",
    title: "Tích phân & Các phương pháp tính nhanh",
    subject: "Toán học",
    topic: "Giải tích",
    duration: "45 phút",
    difficulty: "Trung bình",
    completed: true,
    content: `### Chương 2: Nguyên hàm - Tích phân (Lớp 12)
Trong chương trình thi THPT Quốc Gia, các câu hỏi về tích phân thường chiếm tỷ trọng lớn và trải dài từ thông hiểu đến vận dụng cao.

#### 1. Định nghĩa Tích phân
Cho $f(x)$ là hàm số liên tục trên đoạn $[a; b]$. Giả sử $F(x)$ là một nguyên hàm của $f(x)$ trên $[a; b]$, khi đó:
$$\\int_{a}^{b} f(x) dx = F(b) - F(a)$$

#### 2. Các phương pháp tính tích phân chủ chốt
* **Phương pháp đổi biến số**: Đặt $u = u(x)$ để đơn giản hóa biểu thức dưới dấu tích phân. Nhớ đổi cận sau khi đổi biến!
* **Phương pháp tích phân từng phần**: Áp dụng định lý:
$$\\int_{a}^{b} u dv = \\left. u v \\right|_{a}^{b} - \\int_{a}^{b} v du$$
*Quy tắc ưu tiên đặt $u$*: "Nhất block, nhì đa, tam lượng, tứ mũ" (Logarit -> Đa thức -> Lượng giác -> Mũ).`,
    summary: `### 💡 Trực quan hóa & Tóm tắt Công thức Tích phân
* **Công thức từng phần**: $\\int u dv = uv - \\int v du$
* **Mẹo Đổi biến nhanh**: Nếu thấy $f(g(x))g'(x)dx$, hãy đặt $u = g(x)$.
* **Tính chất cận**: $\\int_{a}^{b} f(x)dx = -\\int_{b}^{a} f(x)dx$
* **💡 Thủ thuật Casio**: Sử dụng nút \`∫\` tích phân để tính gần đúng cận vô hạn hoặc tìm hệ số hữu tỷ bằng phương pháp gán biến và giải hệ phương trình $a e^2 + b e + c$.`,
    formula: "∫_a^b u dv = [uv]_a^b - ∫_a^b v du"
  },
  {
    id: "l2",
    title: "Phương pháp Tọa độ Oxyz: Tính góc và khoảng cách",
    subject: "Toán học",
    topic: "Hình học không gian",
    duration: "50 phút",
    difficulty: "Khó",
    completed: false,
    content: `### Phương pháp tọa độ hóa không gian (Oxyz)
Đây là công cụ cực mạnh giúp giải các bài toán hình học không gian cổ điển khó bằng phương pháp đại số hóa.

#### 1. Các công thức khoảng cách cơ bản
* Khoảng cách từ điểm $M_0(x_0; y_0; z_0)$ đến mặt phẳng $(P): Ax + By + Cz + D = 0$:
$$d(M_0, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$$

#### 2. Tính góc giữa đường thẳng và mặt phẳng
Cho đường thẳng $d$ có chỉ phương $\\vec{u} = (a; b; c)$ và mặt phẳng $(P)$ có pháp tuyến $\\vec{n} = (A; B; C)$. Góc $\\alpha$ được xác định bởi:
$$\\sin \\alpha = \\frac{|\\vec{u} \\cdot \\vec{n}|}{|\\vec{u}| \\cdot |\\vec{n}|} = \\frac{|Aa + Bb + Cc|}{\\sqrt{a^2+b^2+c^2}\\sqrt{A^2+B^2+C^2}}$$`,
    summary: `### 💡 Khung Ghi Nhớ Oxyz
* **Góc giữa 2 MP**: Dùng Cosin của góc giữa 2 vectơ pháp tuyến.
* **Góc giữa ĐT và MP**: Dùng Sin của góc giữa vectơ chỉ phương và vectơ pháp tuyến.
* **Khoảng cách giữa 2 đường chéo nhau**:
$$d(d_1, d_2) = \\frac{|[\\vec{u_1}, \\vec{u_2}] \\cdot \\vec{M_1M_2}|}{|[\\vec{u_1}, \\vec{u_2}]|}$$
* **Khoảnh khắc Casio**: Lưu vectơ vào bộ nhớ \`Vector A\`,\`Vector B\`. Sử dụng \`DotProg\` để tính tích vô hướng và \`CrossProg\` để tính tích có hướng siêu tốc!`,
    formula: "d(M, P) = |Ax_0 + By_0 + Cz_0 + D| / √(A² + B² + C²)"
  },
  {
    id: "l3",
    title: "Lý thuyết Este và Phản ứng xà phòng hóa thế kỷ",
    subject: "Hóa học",
    topic: "Este - Lipit",
    duration: "40 phút",
    difficulty: "Trung bình",
    completed: false,
    content: `### Lý thuyết nền tảng Este (Hóa lớp 12)
Este là dẫn xuất của axit cacboxylic khi thế nhóm $-OH$ bằng nhóm $-OR'$.

#### 1. Tính chất vật lý
* Trạng thái: Thường là chất lỏng, nhẹ hơn nước, ít tan trong nước.
* Nhiệt độ sôi: Thấp hơn nhiều so với axit và ancol có cùng phân tử khối vì este không tạo được liên kết hydro liên phân tử.
* Mùi hương đặc trưng: Isoamyl axetat (mùi chuối chín), Etyl butirat (mùi dứa chín), Geranyl axetat (mùi hoa hồng).

#### 2. Phản ứng xà phòng hóa (Thủy phân trong môi trường kiềm)
Thủy phân hoàn toàn este đơn chức bằng dung dịch kiềm nóng:
$$R-COO-R' + NaOH \\xrightarrow{t^o} R-COONa (muối) + R'-OH (ancol)$$
Đây là phản ứng một chiều. Đặc biệt:
* Este của Phenol: Phản ứng với NaOH theo tỷ lệ $1:2$ tạo ra 2 muối và nước.
* Este có dạng $R-COO-CH=CH-R'$: Thủy phân tạo ra anđehit!`,
    summary: `### 💡 Chiến thuật xử lý lý thuyết Este
* **Nhiệt độ sôi**: Axit > Ancol > Kim loại > Este (không liên kết H).
* **Đồng phân este đơn chức no**: Công thức nhanh: $2^{n-2}$ (với $2 \\le n < 5$).
* **Nhận diện Este tráng gương**: Phải có dạng $H-COO-R'$ (Este của axit fomic).
* **Bẫy Este của Phenol**: Công thức phản ứng luôn sinh ra nước $H_2O$ thay vì ancol và tốn kiềm gấp đôi. Nhớ viết hệ số $2$ trước $NaOH$ khi tính toán khối lượng!`,
    formula: "R-COO-R' + NaOH -> R-COONa + R'-OH"
  },
  {
    id: "l4",
    title: "Sóng cơ học và các đặc trưng truyền sóng cơ",
    subject: "Vật lý",
    topic: "Sóng cơ",
    duration: "30 phút",
    difficulty: "Dễ",
    completed: true,
    content: `### Sóng cơ học và Sự truyền lượng dao động
Sóng cơ là sự lan truyền dao động cơ học trong môi trường vật chất theo thời gian.

#### 1. Các định nghĩa cốt lõi
* **Sóng ngang**: Phương dao động vuông góc với phương truyền sóng (chỉ truyền được trong chất rắn và bề mặt chất lỏng).
* **Sóng dọc**: Phương dao động trùng với phương truyền sóng (truyền được trong cả Rắn, Lỏng, Khí).
* Sóng cơ **KHÔNG** truyền được trong chân không.

#### 2. Đặc trưng vật lý
* Bước sóng $\\lambda$: Quãng đường sóng truyền đi trong một chu kỳ $T$:
$$\\lambda = v \\cdot T = \\frac{v}{f}$$
* Độ lệch pha giữa 2 điểm cách nguồn khoảng $d_1, d_2$ trên cùng một phương truyền sóng:
$$\\Delta \\varphi = \\frac{2\\pi d}{\\lambda} \\quad (với \\, d = |d_1 - d_2|)$$`,
    summary: `### 💡 Mẹo Công thức Sóng cơ nhanh
* **Tìm Bước Sóng**: $\\lambda = \\frac{v}{f}$ (Nhớ đổi đồng bộ đơn vị mét hay centimet).
* **Trạng thái Pha**:
  * Cùng pha: $d = k\\lambda$
  * Ngược pha: $d = (2k + 1)\\frac{\\lambda}{2}$
  * Vuông pha: $d = (2k + 1)\\frac{\\lambda}{4}$
* **Độ lệch chi tiết**: Sóng truyền từ nguồn $O$ đến $M$ thì dao động tại $M$ trễ pha hơn tại $O$ một góc $\\Delta \\varphi = 2\\pi d / \\lambda$.`,
    formula: "λ = v.T = v / f"
  },
  {
    id: "l5",
    title: "Kỹ năng làm bài Đọc hiểu Tiếng Anh (Reading Comprehension)",
    subject: "Tiếng Anh",
    topic: "Đọc hiểu",
    duration: "35 phút",
    difficulty: "Trung bình",
    completed: false,
    content: `### Phương pháp bứt phá Reading Comprehension trong đề thi THPT QG
Các câu hỏi đọc hiểu thường chiếm tới 15 - 20 câu trong tổng số 50 câu đề tiếng Anh thi tốt nghiệp, gây áp lực thời gian lớn.

#### 1. Kỹ năng Skimming & Scanning thần tốc
* **Skimming (Đọc lướt)**: Tập trung vào tiêu đề, câu chủ đề (topic sentence) ở đầu và kết luận ở cuối đoạn để tìm ra "Main Idea" (Ý chính). Tránh đọc từng từ một.
* **Scanning (Đọc quét)**: Định vị từ khóa trong câu hỏi (năm, tên riêng, thuật ngữ đặc biệt) rồi lướt nhanh mắt tìm đúng dòng chứa thông tin đó để trích nghiệm.

#### 2. Xử lý câu hỏi từ khóa thay thế (Referent Questions)
* Dạng câu hỏi: "The word **'it'** or **'they'** in paragraph 2 refers to..."
* Mẹo: Tìm danh từ số ít/nhỏ hoặc số nhiều đứng ngay trước liên từ hoặc dấu câu của từ in đậm đó khoảng 1-2 mệnh đề.`,
    summary: `### 💡 Cẩm nang Ôn thi Reading
* **Không dịch toàn bài**: Hãy đọc câu hỏi trước rồi quay lại quét bài đọc sau.
* **Câu hỏi Main Idea**: Hãy làm sau cùng, khi bạn đã trả lời hết các câu hỏi chi tiết và hiểu rõ 80% chủ đề bài viết.
* **Tìm kiếm từ đồng nghĩa (Vocabulary in Context)**: Đoán nghĩa từ vựng bằng cách đặt vào ngữ cảnh và thay thế thử 4 đáp án vào xem câu có mượt mà hay không.`,
    formula: "Skimming (Main Idea) -> Scanning (Keywords) -> Vocabulary (Context)"
  }
];

export const mockQuizzes: Quiz[] = [
  {
    id: "q1",
    title: "Trắc nghiệm Sự thủy phân Este",
    subject: "Hóa học",
    xpReward: 30,
    duration: "10 phút",
    questions: [
      {
        id: "q1_1",
        question: "Hợp chất hữu cơ no, đơn chức, mạch hở nào sau đây có công thức tổng quát là C_n H_2n O_2 (n ≥ 2)?",
        options: [
          "Ancol no, đơn chức",
          "Este no, đơn chức, mạch hở",
          "Anđehit no, đơn chức",
          "Axit cacboxylic không no"
        ],
        correctAnswer: 1,
        explanation: "Hợp chất có công thức tổng quát C_n H_2n O_2 (n ≥ 2) chính là este no, đơn chức, mạch hở (hoặc axit no đơn chức mạch hở, sản phẩm so sánh axit n >= 1)."
      },
      {
        id: "q1_2",
        question: "Xà phòng hóa hoàn toàn 8.8g Etyl axetat (CH3COOC2H5, M=88) bằng NaOH thu được khối lượng muối CH3COONa (M=82) khan là bao nhiêu?",
        options: [
          "8.2 gam",
          "4.1 gam",
          "16.4 gam",
          "7.4 gam"
        ],
        correctAnswer: 0,
        explanation: "Ta có n_este = 8.8 / 88 = 0.1 mol. Phản ứng xảy ra: CH3COOC2H5 + NaOH -> CH3COONa + C2H5OH. Suy ra n_muối = n_este = 0.1 mol. Khối lượng muối m = 0.1 * 82 = 8.2g.",
        formula: "n = m / M ⇒ m_muối = n_este * M_muối"
      },
      {
        id: "q1_3",
        question: "Phản ứng thủy phân Este trong môi trường axit (H+) có đặc điểm gì?",
        options: [
          "Là phản ứng một chiều, xảy ra hoàn toàn",
          "Không xảy ra ở nhiệt độ thường",
          "Là phản ứng thuận nghịch (hai chiều)",
          "Chỉ tạo ra muối thơm khan"
        ],
        correctAnswer: 2,
        explanation: "Phản ứng thủy phân este trong môi trường axit là phản ứng thuận nghịch (hai chiều) và không xảy ra hoàn toàn. Trong khi phản ứng thủy phân trong môi trường kiềm (NaOH/KOH) mới là phản ứng một chiều (xà phòng hóa)."
      }
    ]
  },
  {
    id: "q2",
    title: "Luyện Tập Hình Học Oxyz 9+",
    subject: "Toán học",
    xpReward: 40,
    duration: "15 phút",
    questions: [
      {
        id: "q2_1",
        question: "Trong không gian Oxyz, cho điểm M(2; -1; 3). Tìm khoảng cách từ M đến mặt phẳng (P): 2x - 2y + z + 3 = 0.",
        options: [
          "d(M, P) = 4",
          "d(M, P) = 3",
          "d(M, P) = 2",
          "d(M, P) = 6"
        ],
        correctAnswer: 0,
        explanation: "Áp dụng công thức khoảng cách từ một điểm đến mặt phẳng: d = |2*2 - 2*(-1) + 1*3 + 3| / √(2² + (-2)² + 1²) = |4 + 2 + 3 + 3| / √(4 + 4 + 1) = |12| / 3 = 4.",
        formula: "d(M, P) = |A*x_0 + B*y_0 + C*z_0 + D| / √(A² + B² + C²)"
      },
      {
        id: "q2_2",
        question: "Cho hai mặt phẳng (P): x + 2y - 2z + 1 = 0 và (Q): x + 2y - 2z - 5 = 0. Khẳng định nào đúng về mối quan hệ giữa hai mặt phẳng này?",
        options: [
          "Cắt nhau và vuông góc",
          "Trùng nhau hoàn toàn",
          "Song song với nhau",
          "Giao nhau theo một đường thẳng"
        ],
        correctAnswer: 2,
        explanation: "Kiểm tra hệ số góc pháp tuyến: n_P = (1; 2; -2) và n_Q = (1; 2; -2). Ta thấy hai pháp tuyến bằng nhau, nhưng hệ số tự do khác nhau (1 != -5). Vì vậy hai mặt phẳng này song song với nhau."
      }
    ]
  },
  {
    id: "q3",
    title: "Trắc nghiệm Dao động và Sóng cơ",
    subject: "Vật lý",
    xpReward: 35,
    duration: "12 phút",
    questions: [
      {
        id: "q3_1",
        question: "Một đầu dây đàn hồi dao động với tần số f = 50 Hz tạo ra sóng trên mặt nước với tốc độ truyền sóng v = 2 m/s. Bước sóng λ là:",
        options: [
          "λ = 25 cm",
          "λ = 4 cm",
          "λ = 100 cm",
          "λ = 10 cm"
        ],
        correctAnswer: 1,
        explanation: "Quy đổi tốc độ truyền sóng v = 2 m/s = 200 cm/s. Áp dụng công thức tính bước sóng λ = v / f = 200 / 50 = 4 cm.",
        formula: "λ = v / f"
      },
      {
        id: "q3_2",
        question: "Khi sóng truyền từ nước ra ngoài không khí, đại lượng vật lý nào sau đây của sóng KHÔNG thay đổi?",
        options: [
          "Tốc độ truyền sóng",
          "Bước sóng",
          "Tần số sóng",
          "Biên độ sóng"
        ],
        correctAnswer: 2,
        explanation: "Khi sóng lan truyền giữa các môi trường vật chất khác nhau, tần số f (và chu kỳ T) luôn giữ cố định không đổi, quyết định bởi nguồn phát. Tốc độ v và bước sóng λ sẽ thay đổi tương ứng."
      }
    ]
  }
];

export const mockExams: Exam[] = [
  {
    id: "exam_1",
    title: "Đề thi thử THPT Quốc Gia môn Toán (Khảo tuyển)",
    subject: "Toán học",
    durationMinutes: 90,
    questions: [
      {
        id: "ex_m_1",
        question: "Trong không gian Oxyz, tìm bán kính R của mặt cầu (S) có phương trình: x^2 + y^2 + z^2 - 2x + 4y - 4 = 0.",
        options: [
          "R = 3",
          "R = 9",
          "R = 4",
          "R = √5"
        ],
        correctAnswer: 0,
        explanation: "Mặt cầu có dạng x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0 với a = 1, b = -2, c = 0, d = -4. Tâm mặt cầu I(1; -2; 0). Bán kính R = √(a^2 + b^2 + c^2 - d) = √(1 + 4 + 0 - (-4)) = √9 = 3.",
        formula: "R = √(a² + b² + c² - d)"
      },
      {
        id: "ex_m_2",
        question: "Tính thể tích V của khối nón tròn xoay khi xoay trục có chiều cao h = 4 và bán kính đáy r = 3.",
        options: [
          "V = 36π",
          "V = 12π",
          "V = 48π",
          "V = 16π"
        ],
        correctAnswer: 1,
        explanation: "Thể tích của khối nón được tính bằng công thức V = (1/3) * π * r^2 * h = (1/3) * π * 3^2 * 4 = (1/3) * π * 9 * 4 = 12π.",
        formula: "V_nón = (1/3) * π * r² * h"
      },
      {
        id: "ex_m_3",
        question: "Tính giá trị của tích phân I = ∫_0^1 (2x + 1) dx.",
        options: [
          "I = 1",
          "I = 3",
          "I = 2",
          "I = 4"
        ],
        correctAnswer: 2,
        explanation: "Nguyên hàm của (2x + 1) là F(x) = x^2 + x. Tính cận F(1) - F(0) = (1^2 + 1) - (0^2 + 0) = 2. Vậy I = 2.",
        formula: "∫ (2x+1)dx = x² + x + C"
      },
      {
        id: "ex_m_4",
        question: "Tìm nghiệm của phương trình mũ log_2(x - 1) = 3.",
        options: [
          "x = 9",
          "x = 7",
          "x = 8",
          "x = 10"
        ],
        correctAnswer: 0,
        explanation: "Theo định nghĩa logarit: log_2(x - 1) = 3 ⇒ x - 1 = 2^3 = 8 ⇒ x = 9. Điều kiện xác định x - 1 > 0 (9 > 1 thỏa mãn).",
        formula: "log_a(x) = b ⇔ x = a^b"
      },
      {
        id: "ex_m_5",
        question: "Số phức liên hợp của z = 3 - 4i là hợp chất nào sau đây?",
        options: [
          "z' = -3 - 4i",
          "z' = 3 + 4i",
          "z' = -3 + 4i",
          "z' = 4 - 3i"
        ],
        correctAnswer: 1,
        explanation: "Số phức z = a + bi có số phức liên hợp là z' = a - bi. Ở đây z = 3 - 4i nên số phức liên hợp là z' = 3 + 4i."
      }
    ]
  },
  {
    id: "exam_2",
    title: "Đề thi thử THPT Quốc Gia môn Hóa học (Bứt phá)",
    subject: "Hóa học",
    durationMinutes: 50,
    questions: [
      {
        id: "ex_c_1",
        question: "Hợp chất nào sau đây tác dụng với dung dịch NaOH nóng sinh ra sản vật là muối của axit cacboxylic thơm và Glyxerin?",
        options: [
          "Etyl axetat",
          "Tripanmitin (Chất béo)",
          "Ancol etylic",
          "Glucozơ"
        ],
        correctAnswer: 1,
        explanation: "Chất béo (như Tripanmitin, Tristearin) khi thủy phân trong NaOH sinh ra glixerol (glyxerin) và hỗn hợp muối natri của axit béo cao.",
        formula: "(R-COO)₃C₃H₅ + 3NaOH -> 3R-COONa + C₃H₅(OH)₃"
      },
      {
        id: "ex_c_2",
        question: "Polime nào sau đây được cấu chế bằng phản ứng trùng ngưng?",
        options: [
          "Poli(vinyl clorua) - PVC",
          "Nilon-6,6",
          "Polietilen - PE",
          "Cao su buna"
        ],
        correctAnswer: 1,
        explanation: "Nilon-6,6 được điều chế từ phản ứng đồng trùng ngưng giữa axit adipic và hexametylendiamin. Các polime PE, PVC và cao su Buna được sinh ra từ phản ứng trùng hợp."
      },
      {
        id: "ex_c_3",
        question: "Trong các chất sau đây, chất nào có lực bazơ mạnh nhất?",
        options: [
          "Mêtylamin (CH3NH2)",
          "Đimetylamin ((CH3)2NH)",
          "Anilin (C6H5NH2)",
          "Khí Amoniac (NH3)"
        ],
        correctAnswer: 1,
        explanation: "Đimetylamin là amin bậc 2 có 2 nhóm alkyl đẩy e rất mạnh làm mật độ e trên N tăng đáng kể, lực bazơ mạnh nhất. Anilin là amin thơm hút e làm giảm bazơ cực yếu."
      }
    ]
  }
];
