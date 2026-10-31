export type NavSectionId =
  | 'home'
  | 'about'
  | 'experience'
  | 'competencies'
  | 'certification'
  | 'projects'
  | 'contact';

export interface NavItem {
  id: NavSectionId;
  label: string;
  isBrand?: boolean;
  isCta?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  category:
    | 'Academic & Clinical'
    | 'Primary Healthcare'
    | 'Professional'
    | 'Leadership';
  summary: string;
  highlights: string[];
  metrics: string;
  image?: string;
}

export interface CompetencyItem {
  id: string;
  title: string;
  category: 'Digital & Technical' | 'Analytical & Research' | 'Leadership & Operations';
  proficiency: number;
  levelLabel: string;
  description: string;
  tools: string[];
}

export interface CompetencyCredentialItem {
  id: string;
  index: string;
  badge: string;
  title: string;
  qualification: string;
  documentNumber: string;
  issuer: string;
  issueDate: string;
  validity: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  category: string;
  duration: string;
  imageSrc: string;
  images: string[];
  summary: string;
  verifiedSkills: string[];
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: 'Web & Systems' | 'Health Informatics' | 'Research & UI';
  year: string;
  role: string;
  featured: boolean;
  summary: string;
  challenge: string;
  solution: string;
  impactMetric: string;
  stack: string[];
  blueprintType: 'dashboard' | 'architecture' | 'analytics' | 'mobile';
}

export interface AchievementCarouselItem {
  id: string;
  stat: string;
  quote: string;
  author: string;
  role: string;
  defaultImage: string;
  selectedImage: string;
  alt: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Mahesa', isBrand: true },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'competencies', label: 'Competencies' },
  { id: 'certification', label: 'Certification' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact Me', isCta: true },
];

export const PROFILE_DATA = {
  fullName: 'Mahesa Rizky Putra I.',
  shortName: 'Mahesa',
  monogram: 'M',
  institution: 'Poltekkes Kemenkes Semarang',
  location: 'Semarang, Jawa Tengah, Indonesia',
  email: 'mahesa0717@gmail.com',
  phone: '+62-8515-8807-170',
  linkedin: 'linkedin.com/in/mahesa-rizky',
  github: 'github.com/mahesarizky',
  heroMarqueeWord: 'PORTOFOLIO',
  portraitSrc: '/assets/aistudio/portrait-mahesa.png',
  roleHeadline: 'Health Informatics, Digital Systems & Applied Research Professional',
  bioLead:
    'Mengelola Informasi Kesehatan dengan Akurat, Terstruktur, dan Terpercaya.',
  bioParagraphs: [
    'Saya merupakan lulusan D3 Rekam Medis dan Informasi Kesehatan dari Poltekkes Kemenkes Semarang dengan IPK 3,79. Saya memiliki ketertarikan pada pengelolaan rekam medis, sistem informasi manajemen rumah sakit (SIMRS), serta pengembangan dan evaluasi rekam medis elektronik (RME).',
    'Melalui pengalaman praktik di rumah sakit dan puskesmas, saya mempelajari proses pelayanan rekam medis, administrasi pasien, pengelolaan informasi kesehatan, serta kegiatan pelayanan kesehatan masyarakat. Saya juga memiliki pengalaman membantu entri data rekam medis menggunakan SIMRS dan mempelajari evaluasi implementasi RME menggunakan kerangka HOT-FIT.',
    'Saya mengutamakan ketelitian, kerahasiaan informasi, dan keteraturan data dalam mendukung mutu pelayanan kesehatan. Bagi saya, rekam medis bukan sekadar dokumentasi, melainkan bagian penting dalam kesinambungan pelayanan, penyediaan informasi yang akurat, dan pengambilan keputusan di fasilitas kesehatan.',
  ],
  metrics: [
    {
      value: '5',
      label: 'Lokasi Praktik',
      detail: 'Rumah sakit dan puskesmas',
    },
    {
      value: '3,79',
      label: 'IPK Akademik',
      detail: 'D3 RMIK · Poltekkes Semarang',
    },
    {
      value: '2026',
      label: 'Tahun Kelulusan',
      detail: 'Lulusan D3 Rekam Medis dan Informasi Kesehatan',
    },
    {
      value: 'SIMRS',
      label: 'Pengalaman Sistem',
      detail: 'Entri data rekam medis',
    },
  ],
};

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'exp-01',
    role: 'Praktik Kerja Nyata (PKN) - Puskesmas Poncol',
    organization: '',
    location: 'Semarang, Indonesia',
    period: 'Januari–Februari 2026',
    category: 'Primary Healthcare',
    summary:
      'Melaksanakan Praktik Kerja Nyata (PKN) pada pelayanan kesehatan tingkat pertama dengan mendukung layanan pendaftaran pasien, kelancaran alur informasi kesehatan, serta berpartisipasi dalam kegiatan kesehatan masyarakat.',
    highlights: [
      'Pelayanan pendaftaran dan dukungan alur administrasi pasien.',
      'Partisipasi dalam program kesehatan masyarakat, termasuk penyuluhan jentik dan Prolanis.',
      'Dukungan kegiatan pelayanan di Pustu serta CKG di sekolah.',
    ],
    metrics: '',
    image: '/assets/experiences/puskesmas-poncol.jpg',
  },
  {
    id: 'exp-02',
    role: 'Praktik Kerja Lapangan (PKL) - RSUD Bagas Waras Klaten',
    organization: '',
    location: 'Klaten, Indonesia',
    period: 'Oktober–November 2025',
    category: 'Academic & Clinical',
    summary:
      'Mengembangkan kompetensi pengelolaan rekam medis dan manajemen informasi kesehatan melalui pelatihan praktik lapangan berbasis rumah sakit.',
    highlights: [
      'Melakukan Assembling berkas rekam medis pasien rawat inap',
      'Melakukan distribusi berkas rekam medis antar unit',
      'Melakukan pengkodean penyakit pasien rawat inap sesuai ICD-10 dan ICD-9 cm',
    ],
    metrics: '',
    image: '/assets/experiences/rsud-bagas-waras-klaten.jpg',
  },
  {
    id: 'exp-03',
    role: 'Praktik Kerja Lapangan (PKL) - RSUD Gondo Suwarno Ungaran',
    organization: '',
    location: 'Ungaran, Indonesia',
    period: 'April–Mei 2025',
    category: 'Academic & Clinical',
    summary:
      'Menjalani praktik kerja lapangan sebagai bagian dari pengembangan akademik di bidang Rekam Medis dan Informasi Kesehatan, dengan fokus pada operasional rekam medis rumah sakit dan alur kerja informasi kesehatan.',
    highlights: [
      'Melakukan analisis untuk alur penanganan Downtime sesuai Standar Operasional Prosedur yang sudag ditetapkan',
      'Melakukan digitalisasi berkas rekam medis kertas untuk menjadikannya bentuk digital/scan',
      'Melakukan pengkodean penyakit untuk pasien rawat jalan maupun rawat inap sesuai ICD-10 dan ICD-9 cm',
    ],
    metrics: '',
    image: '/assets/experiences/rsud-gondo-suwarno-ungaran.jpg',
  },
  {
    id: 'exp-04',
    role: 'Praktik Kerja Lapangan (PKL) - RS PKU Muhammadiyah Wonosobo',
    organization: '',
    location: 'Wonosobo, Indonesia',
    period: 'Oktober–November 2024',
    category: 'Academic & Clinical',
    summary:
      'Melaksanakan praktik kerja lapangan di lingkungan rumah sakit untuk mempelajari pengelolaan rekam medis serta alur manajemen informasi kesehatan secara terstruktur.',
    highlights: [
      'Melakukan pencarian berkas rekam medis di rak rekam medis dan pendistribusian berkas rekam medis menuju poli yang meminta',
      'Melakukan assembling berkas rekam medis untuk menyiapkannya kembali dalam penyimpanan berkas rekam medis',
      'Melakukan pengkodean penyakit untuk pasien rawat jalan maupun rawat inap sesuai ICD-10 dan ICD-9 cm ',
    ],
    metrics: '',
    image: '/assets/experiences/rs-pku-muhammadiyah-wonosobo.jpg',
  },
  {
    id: 'exp-05',
    role: 'Praktik Kerja Lapangan (PKL) - RSUD dr. Loekmono Hadi Kudus',
    organization: '',
    location: 'Kudus, Indonesia',
    period: 'Mei–Juni 2024',
    category: 'Academic & Clinical',
    summary:
      'Memperoleh pembelajaran dan pengenalan langsung terhadap operasional pengelolaan rekam medis serta tata kelola informasi kesehatan di lingkungan rumah sakit.',
    highlights: [
      'Melakukan pendaftaran pasien rawat jalan dan gawat darurat baik pasien baru maupun pasien lama',
      'Melakukan retensi berkas rekam medis dan menyimpannya di rak berkas rekam medis in-aktif',
      'Melakukan analisis pengkodean penyakit batu ginjal dengan kode N-20',
    ],
    metrics: '',
    image: '/assets/experiences/rsud-loekmono-hadi-kudus.jpg',
  },
];

export const COMPETENCIES_DATA: CompetencyItem[] = [
  {
    id: 'comp-01',
    title: 'Web Interface & Frontend Architecture',
    category: 'Digital & Technical',
    proficiency: 92,
    levelLabel: 'Advanced Execution',
    description:
      'Perancangan antarmuka web modern yang responsif, aksesibel, dan berfokus pada tipografi bersih serta struktur informasi yang presisi.',
    tools: ['TypeScript', 'React', 'Tailwind CSS', 'UI/UX Wireframing', 'Responsive Design'],
  },
  {
    id: 'comp-02',
    title: 'Health Data Management & Statistical Analysis',
    category: 'Analytical & Research',
    proficiency: 94,
    levelLabel: 'Expert Standard',
    description:
      'Pengolahan data kuantitatif maupun kualitatif, validasi instrumen penelitian, serta penyajian laporan analitis berbasis bukti ilmiah.',
    tools: ['SPSS', 'Data Cleaning', 'Epidemiological Metrics', 'Excel Advanced Modeling', 'Research Methodology'],
  },
  {
    id: 'comp-03',
    title: 'Clinical & Institutional Documentation Systems',
    category: 'Analytical & Research',
    proficiency: 90,
    levelLabel: 'Advanced Execution',
    description:
      'Penyusunan standar dokumentasi terstruktur, audit kepatuhan prosedur, serta digitalisasi rekam jejak kegiatan akademik dan lapangan.',
    tools: ['SOP Architecture', 'Information Governance', 'Quality Assurance', 'Digital Archiving'],
  },
  {
    id: 'comp-04',
    title: 'Strategic Leadership & Cross-Functional Coordination',
    category: 'Leadership & Operations',
    proficiency: 91,
    levelLabel: 'Proven Track Record',
    description:
      'Manajemen tim lintas disiplin, perencanaan program kerja terukur, komunikasi publik, dan fasilitasi kolaborasi antar pemangku kepentingan.',
    tools: ['Project Management', 'Public Speaking', 'Stakeholder Alignment', 'Event Execution'],
  },
  {
    id: 'comp-05',
    title: 'Data Visualization & Executive Reporting',
    category: 'Digital & Technical',
    proficiency: 88,
    levelLabel: 'High Proficiency',
    description:
      'Transformasi kumpulan data kompleks menjadi dasbor visual monokromatik dan ringkasan eksekutif yang mendukung pengambilan keputusan cepat.',
    tools: ['Interactive Dashboards', 'Looker Studio', 'Information Design', 'KPI Tracking'],
  },
  {
    id: 'comp-06',
    title: 'Community Program Planning & Field Evaluation',
    category: 'Leadership & Operations',
    proficiency: 93,
    levelLabel: 'Expert Standard',
    description:
      'Perencanaan intervensi berbasis komunitas, pemetaan kebutuhan lapangan, serta pengukuran dampak pasca-implementasi secara sistematis.',
    tools: ['Field Assessment', 'Impact Evaluation', 'Community Engagement', 'Risk Mitigation'],
  },
];

export const COMPETENCY_CREDENTIALS_DATA: CompetencyCredentialItem[] = [
  {
    id: 'cred-serkom',
    index: '01',
    badge: 'SERTIFIKAT KOMPETENSI NASIONAL',
    title: 'Sertifikat Kompetensi — Perekam Medis dan Informasi Kesehatan Level 5',
    qualification: 'Perekam Medis dan Informasi Kesehatan Level 5',
    documentNumber: '6672/K71/B01/VIII/2026',
    issuer:
      'Kolegium Perekam Medis dan Informasi Kesehatan & Politeknik Kesehatan Kemenkes Semarang',
    issueDate: 'Jakarta, 29 Agustus 2026',
    validity: 'Lulus Uji Kompetensi',
    imageSrc: '/assets/certificates/sertifikat-kompetensi.png',
    imageAlt:
      'Sertifikat Kompetensi Mahesa Rizky Putra Irdiansyah - Perekam Medis dan Informasi Kesehatan Level 5',
    description:
      'Sertifikat Kompetensi resmi yang diterbitkan oleh Kolegium Perekam Medis dan Informasi Kesehatan bersama Politeknik Kesehatan Kemenkes Semarang dengan Nomor 6672/K71/B01/VIII/2026. Dokumen ini menyatakan bahwa Mahesa Rizky Putra Irdiansyah telah dinyatakan Lulus Uji Kompetensi dan berkompeten sebagai Perekam Medis dan Informasi Kesehatan Level 5, mencakup penguasaan manajemen rekam medis, klasifikasi dan kodefikasi penyakit serta tindakan medis (ICD-10 & ICD-9-CM), mutu pelayanan rekam medis, serta pengelolaan sistem informasi kesehatan.',
  },
  {
    id: 'cred-str',
    index: '02',
    badge: 'SURAT TANDA REGISTRASI (STR)',
    title: 'Surat Tanda Registrasi — Perekam Medis dan Informasi Kesehatan Level 5',
    qualification: 'Perekam Medis dan Informasi Kesehatan Level 5',
    documentNumber: 'JW00002208887465',
    issuer: 'Konsil Kesehatan Indonesia (a.n. Menteri Kesehatan Republik Indonesia)',
    issueDate: 'Jakarta, 19 Oktober 2026',
    validity: 'Berlaku Seumur Hidup',
    imageSrc: '/assets/certificates/surat-tanda-registrasi.png',
    imageAlt:
      'Surat Tanda Registrasi (STR) Mahesa Rizky Putra Irdiansyah - Konsil Kesehatan Indonesia',
    description:
      'Surat Tanda Registrasi (STR) resmi yang diterbitkan oleh Konsil Kesehatan Indonesia atas nama Menteri Kesehatan Republik Indonesia dengan Nomor Registrasi JW00002208887465 dan berlaku seumur hidup. Dokumen ini merupakan bukti tertulis dan pengakuan legalitas negara bagi Mahesa Rizky Putra Irdiansyah sebagai lulusan Politeknik Kesehatan Kemenkes Semarang (3 September 2026) yang telah memenuhi kualifikasi sebagai Perekam Medis dan Informasi Kesehatan Level 5 untuk menjalankan praktik keprofesian di fasilitas pelayanan kesehatan.',
  },
];

export const CERTIFICATION_DATA: CertificationItem[] = [
  {
    id: 'cert-01',
    title:
      'Pelatihan Teknologi Informasi: Geographic Information System (GIS) Bidang Kesehatan Level Dasar',
    issuer: 'Poltekkes Kemenkes Semarang · Kementerian Kesehatan RI',
    issueDate: '8 September 2026',
    credentialId: 'PL.02.03/FXV/2819/2026',
    category: 'Health Informatics & GIS',
    duration: '10 Jam Pelajaran (JPL)',
    imageSrc: '/assets/certificates/sertifikat-qgis-1.png',
    images: [
      '/assets/certificates/sertifikat-qgis-1.png',
      '/assets/certificates/sertifikat-qgis-2.png',
    ],
    summary:
      'Sertifikat pelatihan resmi yang diselenggarakan oleh Politeknik Kesehatan Kemenkes Semarang (Nomor: PL.02.03/FXV/2819/2026) sebanyak 10 Jam Pelajaran (JPL). Pelatihan ini mencakup penguasaan teori pemetaan dan peran Sistem Informasi Geografis (SIG) dalam dunia kesehatan, serta praktik langsung penggunaan perangkat lunak QGIS mulai dari pengelolaan sumber data peta, pemrosesan dan visualisasi data spasial kesehatan, pengaturan layer dan layout peta epidemiologi, hingga ekspor peta untuk mendukung analisis kewilayahan kesehatan.',
    verifiedSkills: [
      'QGIS',
      'Sistem Informasi Geografis (SIG)',
      'Visualisasi Data Spasial',
      'Pemetaan Kesehatan',
    ],
  },
  {
    id: 'cert-02',
    title:
      'Workshop Lokal Keahlian Profesi PMIK: Pengelolaan Sistem Pembiayaan Pelayanan Kesehatan Berbasis Casemix Angkatan 2',
    issuer:
      'Kementerian Kesehatan RI · Unit Pengembangan Kompetensi SDM Kesehatan Semarang',
    issueDate: '19 Juni 2026',
    credentialId: 'KT.03.02/F/6719015/SER/2026',
    category: 'Casemix & Health Financing',
    duration: '7,5 Jam Pelajaran (JPL)',
    imageSrc: '/assets/certificates/sertifikat-workshop-casemix.jpg',
    images: ['/assets/certificates/sertifikat-workshop-casemix.jpg'],
    summary:
      'Sertifikat Pengembangan Keprofesian Berkelanjutan yang diterbitkan oleh Kementerian Kesehatan Republik Indonesia melalui Unit Pengembangan Kompetensi SDM Kesehatan Semarang (Nomor: KT.03.02/F/6719015/SER/2026) selama 7,5 Jam Pelajaran. Workshop ini berfokus pada praktik teknis dan pendalaman kompetensi Perekam Medis dan Informasi Kesehatan (PMIK) dalam pengelolaan sistem pembiayaan pelayanan kesehatan berbasis Casemix, ketepatan pengkodean klinis, serta penjaminan mutu klaim di fasilitas pelayanan kesehatan.',
    verifiedSkills: [
      'Sistem Casemix',
      'Klaim Pelayanan Kesehatan',
      'Pengkodean Klinis',
      'Manajemen Pembiayaan',
    ],
  },
  {
    id: 'cert-03',
    title:
      'Webinar Keahlian Profesi PMIK: Pengelolaan Sistem Pembiayaan Pelayanan Kesehatan Berbasis Casemix Angkatan 1',
    issuer:
      'Kementerian Kesehatan RI · Unit Pengembangan Kompetensi SDM Kesehatan Semarang',
    issueDate: '15–17 Juni 2026',
    credentialId: 'KT.03.02/F/6681835/SER/2026',
    category: 'Casemix & Health Financing',
    duration: '15 Jam Pelajaran (JPL)',
    imageSrc: '/assets/certificates/sertifikat-webinar-casemix.jpg',
    images: ['/assets/certificates/sertifikat-webinar-casemix.jpg'],
    summary:
      'Sertifikat Pengembangan Keprofesian Berkelanjutan yang diterbitkan oleh Kementerian Kesehatan Republik Indonesia melalui Unit Pengembangan Kompetensi SDM Kesehatan Semarang (Nomor: KT.03.02/F/6681835/SER/2026) dengan total 15 Jam Pelajaran pada tanggal 15–17 Juni 2026. Kegiatan ini membahas secara komprehensif regulasi, kebijakan, serta tata kelola sistem pembiayaan pelayanan kesehatan berbasis Casemix guna mendukung efisiensi, akurasi dokumentasi rekam medis, dan mutu klaim rumah sakit.',
    verifiedSkills: [
      'Tata Kelola Casemix',
      'Regulasi Pembiayaan Kesehatan',
      'Audit Kelengkapan Medis',
      'Mutu Klaim RS',
    ],
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-01',
    index: '01',
    title: 'SIM- Terpadu: Portal Monitoring & Evaluasi Data Lapangan',
    subtitle: 'Web Platform · Health Informatics',
    category: 'Health Informatics',
    year: '2025',
    role: 'Lead Designer & Frontend Developer',
    featured: true,
    summary:
      'Platform web terintegrasi untuk memantau pengumpulan data survei lapangan, verifikasi progres tim secara real-time, dan pembuatan laporan otomatis.',
    challenge:
      'Proses pengumpulan data sebelumnya mengandalkan lembar kerja manual yang terpisah-pisah sehingga rawan duplikasi dan memakan waktu hingga 5 hari kerja untuk rekapitulasi.',
    solution:
      'Membangun aplikasi web dengan validasi input berlapis, dasbor ringkasan metrik tabular, serta fitur ekspor laporan standar institusi dalam satu klik.',
    impactMetric: 'Memangkas waktu validasi & pelaporan dari 5 hari menjadi 6 jam (-85%)',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Structured Validation'],
    blueprintType: 'dashboard',
  },
  {
    id: 'proj-02',
    index: '02',
    title: 'Monograph Repository: Sistem Arsip Kompetensi & Modul Praktikum',
    subtitle: 'Digital Archive · Web & Systems',
    category: 'Web & Systems',
    year: '2025',
    role: 'System Architect & UI Engineer',
    featured: true,
    summary:
      'Repositori digital berdesain editorial monokrom yang memudahkan mahasiswa mengakses modul praktikum, daftar tilik kompetensi, dan jadwal evaluasi.',
    challenge:
      'Materi panduan praktikum tersebar di berbagai kanal pesan singkat tanpa indeks pencarian yang jelas, menyulitkan mahasiswa saat persiapan ujian kompetensi.',
    solution:
      'Merancang katalog digital terindeks dengan pencarian instan, filter berdasarkan semester dan mata kuliah, serta tampilan baca yang ramah perangkat seluler.',
    impactMetric: 'Diakses rutin oleh 450+ mahasiswa dengan tingkat kepuasan pengguna 96%',
    stack: ['TypeScript', 'Search Indexing', 'Editorial UI', 'Responsive PWA'],
    blueprintType: 'architecture',
  },
  {
    id: 'proj-03',
    index: '03',
    title: 'Instrumen Analitik Kepatuhan Standar Layanan Komunitas',
    subtitle: 'Research & Analytics · Data Visualization',
    category: 'Research & UI',
    year: '2024',
    role: 'Lead Data Analyst & Researcher',
    featured: false,
    summary:
      'Studi analitik dan visualisasi indeks kepatuhan prosedur layanan pada program pengabdian masyarakat di wilayah Jawa Tengah.',
    challenge:
      'Data evaluasi lapangan bersifat deskriptif panjang dan sulit dibandingkan antar wilayah sasaran secara objektif.',
    solution:
      'Menyusun matriks penilaian terkuantifikasi dengan pembobotan baku serta visualisasi komparatif yang langsung menyoroti prioritas intervensi.',
    impactMetric: 'Digunakan sebagai acuan evaluasi pada 12 titik lokus pengabdian masyarakat',
    stack: ['Statistical Modeling', 'Data Visualization', 'Instrument Design', 'Executive Brief'],
    blueprintType: 'analytics',
  },
  {
    id: 'proj-04',
    index: '04',
    title: 'Mahesa Editorial Portfolio & Digital Identity System',
    subtitle: 'Personal Branding · Interactive Web',
    category: 'Web & Systems',
    year: '2026',
    role: 'Creator & Frontend Developer',
    featured: false,
    summary:
      'Landing page portofolio berkonsep monokrom hitam-putih elegan dengan tipografi berjalan (PORTOFOLIO) dan navigasi glassmorphism yang presisi.',
    challenge:
      'Menyajikan profil akademik, pengalaman, kompetensi, sertifikasi, dan karya proyek dalam satu halaman web yang berkarakter kuat tanpa distraksi visual.',
    solution:
      'Mengimplementasikan tata letak editorial kontras tinggi, tipografi stroke berlapis di belakang potret utama, serta navigasi glass effect yang persisten.',
    impactMetric: 'Skor aksesibilitas & ketajaman tipografi optimal di desktop maupun mobile',
    stack: ['React 19', 'Tailwind CSS v4', 'Glassmorphism UI', 'Kinetic Typography'],
    blueprintType: 'mobile',
  },
];

export const ACHIEVEMENTS_CAROUSEL_DATA: AchievementCarouselItem[] = [
  {
    id: 'hki-brosur-umkm',
    stat: 'Pembuatan Hak Cipta Brosur Produksi Pangan UMKM Aman, Bergizi, dan Halal',
    quote:
      'Berkontribusi dalam pembuatan brosur berjudul "Produksi Pangan UMKM Aman, Bergizi, dan Halal" sebagai media informasi dan edukasi bagi pelaku Usaha Mikro, Kecil, dan Menengah (UMKM). Karya ini mengangkat pentingnya proses produksi pangan yang memperhatikan aspek keamanan, nilai gizi, dan kehalalan produk. Pengalaman ini memberikan kesempatan untuk berkontribusi dalam penyusunan media edukasi yang informatif dan komunikatif guna mendukung penyebarluasan informasi mengenai produksi pangan kepada masyarakat dan pelaku usaha.',
    author: 'Hak Cipta · No. Pencatatan 000974142',
    role: 'Karya Tulis Lainnya · EC002025133881 (17 September 2025)',
    defaultImage: '/assets/projects/hki-brosur-umkm.jpg',
    selectedImage: '/assets/projects/hki-brosur-umkm.jpg',
    alt: 'Surat Pencatatan Ciptaan Brosur Produksi Pangan UMKM Aman, Bergizi, dan Halal',
  },
  {
    id: 'hki-policy-brief',
    stat: 'Pembuatan Hak Cipta Policy Brief',
    quote:
      'Berkontribusi dalam penyusunan karya berjudul "Ancaman Sesar Aktif pada Sektor Pelayanan Publik di Kota Semarang" yang terdaftar sebagai kompilasi ciptaan/data. Karya ini mengangkat isu kebencanaan terkait ancaman sesar aktif dan kaitannya dengan sektor pelayanan publik di Kota Semarang. Keterlibatan dalam karya ini menjadi pengalaman dalam penyusunan dan pengolahan informasi serta dokumentasi data mengenai isu kebencanaan yang relevan dengan keberlangsungan pelayanan publik dan kesiapsiagaan terhadap risiko bencana.',
    author: 'Hak Cipta · No. Pencatatan 001003806',
    role: 'Kompilasi Ciptaan / Data · EC002025163546 (26 Oktober 2025)',
    defaultImage: '/assets/projects/hki-policy-brief.jpg',
    selectedImage: '/assets/projects/hki-policy-brief.jpg',
    alt: 'Surat Pencatatan Ciptaan Policy Brief Ancaman Sesar Aktif pada Sektor Pelayanan Publik di Kota Semarang',
  },
  {
    id: 'hki-rumah-literasi',
    stat: 'Pembuatan Hak Cipta Rumah Literasi',
    quote:
      'Berkontribusi dalam pembuatan karya rekaman video berjudul "Rumah Literasi Pembiayaan Kesehatan" yang berfokus pada penyampaian informasi dan edukasi mengenai pembiayaan kesehatan. Karya ini merupakan bentuk pemanfaatan media audiovisual untuk mendukung literasi masyarakat mengenai pembiayaan pelayanan kesehatan. Pengalaman dalam pembuatan karya ini turut mendukung pengembangan keterampilan produksi konten digital, penyampaian informasi, dan komunikasi kesehatan melalui media video.',
    author: 'Hak Cipta · No. Pencatatan 001003812',
    role: 'Karya Rekaman Video · EC002025163552 (26 Oktober 2025)',
    defaultImage: '/assets/projects/hki-rumah-literasi.jpg',
    selectedImage: '/assets/projects/hki-rumah-literasi.jpg',
    alt: 'Surat Pencatatan Ciptaan Karya Rekaman Video Rumah Literasi Pembiayaan Kesehatan',
  },
];
