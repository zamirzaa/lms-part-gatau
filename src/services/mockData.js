// Data Seed Initial SMKN 1 Cibinong LMS

export const INITIAL_SCHOOL_INFO = {
  name: "SMKN 1 Cibinong",
  tagline: "Sekolah Menengah Kejuruan Pusat Keunggulan - Kab. Bogor",
  npsn: "20231418",
  address: "Jl. Karadenan No. 7, Karadenan, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16913",
  accreditation: "A (Sangat Baik)",
  academicYear: "2025/2026 - Semester Ganjil"
};

export const INITIAL_USERS = [
  {
    id: "std-001",
    username: "ahmad.rizki",
    role: "siswa",
    name: "Ahmad Rizki Pratama",
    identityNo: "0061234567", // NISN
    classRoom: "XII RPL 1",
    major: "Rekayasa Perangkat Lunak",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    email: "ahmad.rizki@smkn1cibinong.sch.id",
    phone: "081234567890"
  },
  {
    id: "std-002",
    username: "siti.nurhaliza",
    role: "siswa",
    name: "Siti Nurhaliza",
    identityNo: "0061234568", // NISN
    classRoom: "XII TKJ 2",
    major: "Teknik Komputer & Jaringan",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",
    email: "siti.nurhaliza@smkn1cibinong.sch.id",
    phone: "081298765432"
  },
  {
    id: "tch-001",
    username: "budi.santoso",
    role: "guru",
    name: "Budi Santoso, S.Kom., M.T.",
    identityNo: "198504122010011002", // NIP
    subject: "Pemrograman Web & Bergerak",
    major: "Rekayasa Perangkat Lunak",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    email: "budi.santoso@smkn1cibinong.sch.id"
  },
  {
    id: "tch-002",
    username: "rina.wulandari",
    role: "guru",
    name: "Rina Wulandari, S.Pd.",
    identityNo: "198809152014022001", // NIP
    subject: "Administrasi Infrastruktur Jaringan",
    major: "Teknik Komputer & Jaringan",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    email: "rina.wulandari@smkn1cibinong.sch.id"
  },
  {
    id: "adm-001",
    username: "admin.kurikulum",
    role: "admin",
    name: "Dra. Endang Sri Mulyani, M.Pd.",
    identityNo: "197803112005011003",
    subject: "Kepala Tim Kurikulum",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
    email: "kurikulum@smkn1cibinong.sch.id"
  }
];

export const INITIAL_COURSES = [
  {
    id: "crs-pwb",
    code: "RPL-301",
    title: "Pemrograman Web & Bergerak",
    teacherName: "Budi Santoso, S.Kom., M.T.",
    classRoom: "XII RPL 1 & 2",
    major: "Rekayasa Perangkat Lunak",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    description: "Pembelajaran pengembangan aplikasi web modern (React, Node.js, REST API) dan aplikasi mobile Android.",
    modulesCount: 8,
    assignmentsCount: 4,
    studentsCount: 72
  },
  {
    id: "crs-bd",
    code: "RPL-302",
    title: "Basis Data & Cloud Architecture",
    teacherName: "Budi Santoso, S.Kom., M.T.",
    classRoom: "XII RPL 1",
    major: "Rekayasa Perangkat Lunak",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80",
    description: "Konsep SQL/NoSQL, perancangan diagram ERD, transaksi data, dan deployment database di cloud.",
    modulesCount: 6,
    assignmentsCount: 3,
    studentsCount: 36
  },
  {
    id: "crs-aij",
    code: "TKJ-301",
    title: "Administrasi Infrastruktur Jaringan",
    teacherName: "Rina Wulandari, S.Pd.",
    classRoom: "XII TKJ 1 & 2",
    major: "Teknik Komputer & Jaringan",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    description: "Konfigurasi Mikrotik RouterOS, VLAN, Routing OSPF, Firewall, dan Bandwidth Management.",
    modulesCount: 7,
    assignmentsCount: 5,
    studentsCount: 70
  },
  {
    id: "crs-mat",
    code: "UMM-101",
    title: "Matematika Kejuruan",
    teacherName: "Dra. Endang Sri Mulyani, M.Pd.",
    classRoom: "XII All Major",
    major: "Umum",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
    description: "Matriks, Vektor, Program Linear, Matrik Kejuruan, dan Statistik Terapan industri.",
    modulesCount: 10,
    assignmentsCount: 6,
    studentsCount: 360
  }
];

export const INITIAL_MODULES = [
  {
    id: "mod-1",
    courseId: "crs-pwb",
    title: "Modul 1: Pengenalan React JS & Component Architecture",
    type: "pdf",
    fileUrl: "#",
    content: "Di modul ini siswa belajar membuat komputasi komponen React, Props, State, dan React Hooks dasar.",
    dateAdded: "2026-09-10"
  },
  {
    id: "mod-2",
    courseId: "crs-pwb",
    title: "Video Tutorial: Membuat REST API dengan Express.js",
    type: "video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    content: "Penjelasan step-by-step pembuatan endpoint REST API, middleware, dan JSON Web Token (JWT).",
    dateAdded: "2026-09-15"
  },
  {
    id: "mod-3",
    courseId: "crs-aij",
    title: "Panduan Praktikum MikroTik: Setting VLAN & Trunking",
    type: "pdf",
    fileUrl: "#",
    content: "Langkah-langkah konfigurasi VLAN 10 (Siswa) dan VLAN 20 (Guru) di Routerboard RB951.",
    dateAdded: "2026-09-12"
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: "asg-1",
    courseId: "crs-pwb",
    courseTitle: "Pemrograman Web & Bergerak",
    title: "Tugas 1: Uji Kompetensi Frontend React Dashboard",
    deadline: "2026-09-28T23:59",
    description: "Buatlah aplikasi dashboard responsive menggunakan React JS yang menyajikan grafik dan data tabel interaktif.",
    maxScore: 100,
    submissions: [
      {
        studentId: "std-001",
        studentName: "Ahmad Rizki Pratama",
        submittedAt: "2026-09-20 14:30",
        fileUrl: "dashboard_ahmad_rizki.zip",
        notes: "Pak, ini file tugas komplit dengan komponen responsive.",
        score: 95,
        feedback: "Sangat baik! Penggunaan state management dan styling sangat rapi."
      }
    ]
  },
  {
    id: "asg-2",
    courseId: "crs-bd",
    courseTitle: "Basis Data & Cloud Architecture",
    title: "Tugas 2: Perancangan ERD Database LMS Sekolah",
    deadline: "2026-10-02T23:59",
    description: "Gambarkan Diagram ERD untuk LMS sekolah lengkap dengan entitas Siswa, Guru, Mapel, Ujian, dan Presensi.",
    maxScore: 100,
    submissions: []
  },
  {
    id: "asg-3",
    courseId: "crs-aij",
    courseTitle: "Administrasi Infrastruktur Jaringan",
    title: "Tugas Laporan Praktikum MikroTik Router",
    deadline: "2026-09-30T23:59",
    description: "Upload screenshot dan analisis konfigurasi Routing OSPF pada simulasi Cisco Packet Tracer atau GNS3.",
    maxScore: 100,
    submissions: []
  }
];

export const INITIAL_EXAMS = [
  {
    id: "cbt-101",
    title: "UTS Penilaian Tengah Semester - Pemrograman Web",
    courseId: "crs-pwb",
    courseTitle: "Pemrograman Web & Bergerak",
    durationMinutes: 45,
    totalQuestions: 5,
    status: "active", // active, completed, upcoming
    passScore: 75,
    questions: [
      {
        id: "q1",
        type: "mc",
        question: "Manakah React Hook yang digunakan untuk menangani side-effect seperti pencarian data API?",
        options: [
          "useState",
          "useEffect",
          "useContext",
          "useReducer"
        ],
        correctOption: 1,
        explanation: "useEffect digunakan untuk eksekusi side-effect seperti fetching API atau manipulasi DOM."
      },
      {
        id: "q2",
        type: "mc",
        question: "Perintah CLI untuk membuat proyek Vite baru dengan React adalah...",
        options: [
          "npm create vite@latest",
          "npm start create-react-app",
          "vite init project-name",
          "git clone vite-react"
        ],
        correctOption: 0,
        explanation: "npm create vite@latest adalah standar resmi scaffolding aplikasi Vite modern."
      },
      {
        id: "q3",
        type: "mc",
        question: "Properti CSS manakah yang digunakan untuk membuat efek kaca transparan (Glassmorphism)?",
        options: [
          "background-filter & opacity",
          "backdrop-filter & rgba background",
          "glass-effect: true",
          "box-shadow: inset"
        ],
        correctOption: 1,
        explanation: "Backdrop-filter: blur() yang dikombinasikan dengan rgba background menghasilkan tampilan glassmorphism."
      },
      {
        id: "q4",
        type: "mc",
        question: "Apa kegunaan dari JSX pada React?",
        options: [
          "Menggantikan database MySQL",
          "Memungkinkan sintaksis mirip HTML ditulis di dalam JavaScript",
          "Mengkompresi file gambar secara otomatis",
          "Menjalankan server Node.js di browser"
        ],
        correctOption: 1,
        explanation: "JSX (JavaScript XML) adalah ekstensi sintaksis untuk menuliskan elemen UI HTML di dalam JS."
      },
      {
        id: "q5",
        type: "essay",
        question: "Jelaskan secara singkat perbedaan utama antara Client-Side Rendering (CSR) dan Server-Side Rendering (SSR)!",
        explanation: "CSR merender komponen langsung di browser pengguna (React SPA), sedangkan SSR merender halaman HTML awal di server sebelum dikirim ke browser."
      }
    ]
  },
  {
    id: "cbt-102",
    title: "Ujian Sertifikasi Kompetensi Keahlian (UKK) - AIJ Networking",
    courseId: "crs-aij",
    courseTitle: "Administrasi Infrastruktur Jaringan",
    durationMinutes: 60,
    totalQuestions: 3,
    status: "upcoming",
    passScore: 80,
    questions: []
  }
];

export const INITIAL_ATTENDANCE = [
  {
    id: "att-001",
    date: "2026-09-22",
    studentId: "std-001",
    studentName: "Ahmad Rizki Pratama",
    classRoom: "XII RPL 1",
    status: "Hadir", // Hadir, Izin, Sakit, Alpa
    time: "06:45 WIB",
    notes: "Tiba tepat waktu"
  },
  {
    id: "att-002",
    date: "2026-09-22",
    studentId: "std-002",
    studentName: "Siti Nurhaliza",
    classRoom: "XII TKJ 2",
    status: "Hadir",
    time: "06:52 WIB",
    notes: "Tiba tepat waktu"
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Jadwal Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil 2025/2026",
    date: "21 September 2026",
    author: "Tim Kurikulum SMKN 1 Cibinong",
    category: "Penting",
    content: "Diberitahukan kepada seluruh siswa kelas X, XI, dan XII SMKN 1 Cibinong bahwa PTS Ganjil akan dilaksanakan secara CBT online mulai tanggal 29 September 2026. Harap memastikan koneksi internet dan kartu ujian siap."
  },
  {
    id: "ann-2",
    title: "Pendaftaran Program Magang Industri (PKL) Gelombang II Jurusan RPL & TKJ",
    date: "18 September 2026",
    author: "Hubungan Industri (Hubin)",
    category: "Informasi",
    content: "Pendaftaran PKL untuk perusahaan mitra IT (PT Telkom, PT Kode Indonesia, dsb) dibuka hingga 30 September. Pengumpulan berkas dapat diunggah melalui menu portal e-Learning."
  }
];
