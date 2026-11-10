// ==========================================================
// DaRyz Collection - Cloudflare Workers
// Cara guna: tampal seluruh fail ini dalam editor Worker -> Deploy
// ==========================================================

// ----------------------------------------------------------
// TETAPAN (satu-satunya tempat yang perlu anda ubah)
// Alamat server stream untuk SEMUA episod. Sekarang masih
// menunjuk ke bot lama. Bila bot dipindahkan, tukar baris ini
// sahaja (tanpa "/" di hujung), contoh: "https://stream.contoh.com"
// ----------------------------------------------------------
const STREAM_HOST = "https://daryz-addon.onrender.com";

// ==========================================
// HELPER FUNCTION UNTUK TAJUK & DESCRIPTION EPISOD
// ==========================================
function createEpisodes(list) {
    return list.map((item, idx) => {
        if (typeof item === 'string') {
            return { episode: idx + 1, title: `Episod ${idx + 1}`, overview: '', url: item };
        }
        return {
            episode: idx + 1,
            title: item.title || `Episod ${idx + 1}`,
            overview: item.description || item.overview || '',
            url: item.url
        };
    });
}

// ==========================================
// 1. MANIFEST ADDON
// ==========================================
const manifest = {
    id: "org.daryz.addon",
    version: "4.2.0",
    name: "DaRyz Collection",
    description: "Addon Stremio/Nuvio dengan katalog siri, ceramah, dan filem tersusun.",
    resources: ["catalog", "stream", "meta"],
    types: ["series"],
    idPrefixes: [
        "running_man", "running_man_2", "running_man_3", "running_man_4", "running_man_5", "running_man_6",
        "kisah_sahabat", "siri_ustazwadi", "akhir_zaman", "sirah_nabi", "ustaz_azlan", "ustaz_azhar", "siri_sirah", "mahsyar", "filem_dakwah_sengketa", "story_catalog", "sirah_nabawiyyah", "ustaz_auni", "ustaz_amin", "hada_kiddy", "kd_malay", "kd_eng",
        "malaysian_movies", "mm_", "tur_movies", "eng_movies", "kor_movies", "jap_movies", "ind_movies", "am_", "sembang_seram", "chiquititas_song", "chiquititas", "korean_series",
        "playful_kiss", "shark2", "a_teen", "a_teen2", "handmade_love", "17_special", "ending_again", "be_my_boyfriend", "mumul_zzumul", "ma_boy", "iloveyou_loser", "blue_birthday", "daebaking", "like", "mermaid_prince", "dalgona", "flower",
        "oddbods", "oggy1", "oggy2", "oggy3", "oggy4", "oggy5", "baby_oddbods", "felix", "tomjerry", "anak_anak_sidek", "satria_7pahlawan", "tiny_planet", "mr_bean_s1", "mr_bean_s2", "mr_bean_s3", "mr_bean_s4", "courage1", "courage2", "courage3", "courage4", "spies1", "spies2", "spies3", "martin", "omar_dan_hana",
        "dash", "chiikawa", "sakura", "clear_card", "doraemon", "pokemon_journeys", "midori_days", "ueki", "conan", "kaito_kid", "magic_kaito", "ginban", "black_cat", "hagemaru", "ninja_boy",  "digimon_01", "digimon_02", "digimon_03", "digimon_adventure2020", "digimon_tamers", "digimon_frontier", "digimon_fusion", "digimon_savers", "shin_chan", "edens_zero_series","nisekoi", "nisekoi_2", "time_bokan_24", "black_bullet", "one_punch_man", "high_rise_invasion", "demon_slayer", "gundam", "naruto_1-220", "boruto", "jjk", 
        "doraemon_movie", "dragonball_movie", "naruto_movie", "conan_movie", "teenieping1", "teenieping2", "teenieping3", "teenieping4", "teenieping5", 
        "perempuan_sialan", "anak_mak", "cela", "hening_cinta", "saat_aku_tahu", "aku_pilih_pelangi", "bayangan_dendam", "bidadari_tanpa_syurga", "cinta_dalam_sekam",
        "project", "budak_magik",
        "suzanna",

        "gadis_masa", "nenek_bongkok_tiga", "ijab_kabut", "anggun_mikayla", "abang_imam",
        "alter_naratif", "aisya", "dihatiku_ada_kamu", "w_two_world", "terlanjur_cinta",
        "bidaah", "kelas_belakang", "lambaian_huda", "mitos_cinta_akira", "pabila_dia_tersenyum",
        "puteri_kelas_atas", "puteri_and_phrince", "satu_dua_dia", "seadanya_kita", "sesaat_lebih",
        "walid", "seribu_nina", "cinderella_at_2am", "brewing_love", "family_by_choice", "undercover_high_school", "crushology_101",
        "andai_masih_ada_maaf", "sebenarnya_saya_isteri_dia", "jibril_catalog", "ganjil_catalog", "hilang_catalog", 
        "jendela_hati", "nafsu", "otw_halal", "perfect_family",
        "my_girlfriend_is_a_man", "my_youth", "reborn_rookie", "love_in_sync", "the_secret", "good_partner"
    ],
    catalogs: [
        { type: "series", id: "tur_movies_catalog", name: "Turkiye Movies" },
        { type: "series", id: "eng_movies_catalog", name: "English Movies" },
        { type: "series", id: "ind_movies_catalog", name: "Indian Movies" },
        { type: "series", id: "kor_movies_catalog", name: "Korean Movies" },
        { type: "series", id: "jap_movies_catalog", name: "Japanese Movies" },
        { type: "series", id: "malaysian_movies_catalog", name: "Malaysian Movies" },
        
        { type: "series", id: "malaysian_movies_seram_catalog", name: "Malaysian Horror & Thriller" },
        { type: "series", id: "animation_dub_catalog", name: "Animation & Anime Malay Dubbed" },
        { type: "series", id: "suzanna_catalog", name: "Suzanna" },
        { type: "series", id: "animation_movies_catalog", name: "Anime & Animation Movies" },

        { type: "series", id: "omar_dan_hana_catalog", name: "Omar & Hana" },
        { type: "series", id: "felix_catalog", name: "Felix The Cat" },
        { type: "series", id: "oggy1_catalog", name: "Oggy & The Cockroaches S1" },
        { type: "series", id: "oggy2_catalog", name: "Oggy & The Cockroaches S2" },
        { type: "series", id: "oggy3_catalog", name: "Oggy & The Cockroaches S3" },
        { type: "series", id: "oggy4_catalog", name: "Oggy & The Cockroaches S4" },
        { type: "series", id: "oggy5_catalog", name: "Oggy & The Cockroaches S5" },
        { type: "series", id: "anak_sidek_catalog", name: "Anak-Anak Sidek" },
        { type: "series", id: "satria_7pahlawan_catalog", name: "Satria 7 Pahlawan" },
        { type: "series", id: "tomjerry_catalog", name: "Tom & Jerry" },
        { type: "series", id: "oddbods_catalog", name: "Oddbots" },
        { type: "series", id: "baby_oddbods_catalog", name: "Baby Oddbots" },
        { type: "series", id: "courage1_catalog", name: "Courage The Cowardly Dog S1" },
        { type: "series", id: "courage2_catalog", name: "Courage The Cowardly Dog S2" },
        { type: "series", id: "courage3_catalog", name: "Courage The Cowardly Dog S3" },
        { type: "series", id: "courage4_catalog", name: "Courage The Cowardly Dog S4" },
        { type: "series", id: "martin_catalog", name: "Martin Mystery" },
        { type: "series", id: "spies1_catalog", name: "Totatlly Spies S1" },    
        { type: "series", id: "spies2_catalog", name: "Totatlly Spies S2" }, 
        { type: "series", id: "spies3_catalog", name: "Totatlly Spies S3" }, 
        { type: "series", id: "tiny_planet_catalog", name: "Tiny Planet" },
        { type: "series", id: "mr_bean_s1_catalog", name: "Mr Bean Animation S1" },
        { type: "series", id: "mr_bean_s2_catalog", name: "Mr Bean Animation S2" },
        { type: "series", id: "mr_bean_s3_catalog", name: "Mr Bean Animation S3" },
        { type: "series", id: "mr_bean_s4_catalog", name: "Mr Bean Animation S4" },

        { type: "series", id: "teenieping1_catalog", name: "Catch! Teenieping" },
        { type: "series", id: "teenieping2_catalog", name: "Twinkle Catch! Teenieping" },
        { type: "series", id: "teenieping3_catalog", name: "Secret Catch! Teenieping" },
        { type: "series", id: "teenieping4_catalog", name: "Dessert Catch! Teenieping" },
        { type: "series", id: "teenieping5_catalog", name: "Star Catch! Teenieping" },
        { type: "series", id: "shaman_king_s1_catalog", name: "Shaman King Season 1" },
        { type: "series", id: "shaman_king_s2_catalog", name: "Shaman King Season 2 : Flowers" },
        { type: "series", id: "super_beerus_catalog", name: "Dragon Ball Super Beerus" },
        { type: "series", id: "black_clover_s1_catalog", name: "Black Clover - Season 1" },
        { type: "series", id: "black_clover_s2_catalog", name: "Black Clover - Season 2" },
        { type: "series", id: "another_catalog", name: "Another" },
        { type: "series", id: "chiikawa_catalog", name: "Chiikawa" },
        { type: "series", id: "dash_catalog", name: "Dash Yonkuro" },
        { type: "series", id: "shin_chan_catalog", name: "Crayon Shin Chan" },
        { type: "series", id: "hagemaru_catalog", name: "Hagemaru" },
        { type: "series", id: "clear_card_catalog", name: "Cardcaptor Sakura - Clear Card" },
        { type: "series", id: "sakura_catalog", name: "Cardcaptor Sakura" },
        { type: "series", id: "ninja_boy_catalog", name: "Ninja Boy" },
        { type: "series", id: "digimon_01_catalog", name: "Digimon Adventure 01" },
        { type: "series", id: "digimon_02_catalog", name: "Digimon Adventure 02" },
        { type: "series", id: "digimon_03_catalog", name: "Digimon Adventure Tri" },
        { type: "series", id: "digimon_adventure2020_catalog", name: "Digimon Adventure 2020" },
        { type: "series", id: "digimon_tamers_catalog", name: "Digimon Tamers" },
        { type: "series", id: "digimon_frontier_catalog", name: "Digimon Frontier" },
        { type: "series", id: "digimon_savers_catalog", name: "Digimon Savers" },
        { type: "series", id: "digimon_fusion_catalog", name: "Digimon Fusion" },
        { type: "series", id: "edens_zero_catalog", name: "Edens Zero" },
        { type: "series", id: "nisekoi_catalog", name: "Nisekoi" },
        { type: "series", id: "nisekoi_2_catalog", name: "Nisekoi 2" },
        { type: "series", id: "time_bokan_24_catalog", name: "Time Bokan 24" },
        { type: "series", id: "black_bullet_catalog", name: "Black Bullet" },
        { type: "series", id: "one_punch_man_s1_malay_catalog", name: "One Punch Man" },
        { type: "series", id: "high_rise_invasion_catalog", name: "High Rise Invasion" },
        { type: "series", id: "demon_slayer_catalog", name: "Demon Slayer" },
        { type: "series", id: "gundam_catalog", name: "Gundam Build Fighter" },
        { type: "series", id: "naruto_1-220_catalog", name: "Naruto" },
        { type: "series", id: "boruto_catalog", name: "Boruto" },
        { type: "series", id: "jjk_catalog", name: "Jujutsu Kaisen" },
        { type: "series", id: "doraemon_catalog", name: "Doraemon" },
        { type: "series", id: "pokemon_catalog", name: "Pokemon Journeys" },
        { type: "series", id: "midori_days_catalog", name: "Midori Days" },
        { type: "series", id: "ueki_catalog", name: "The Law of Ueki" },
        { type: "series", id: "conan_catalog", name: "Detective Conan" },
        { type: "series", id: "kaito_kid_catalog", name: "Kaito Kid" },
        { type: "series", id: "magic_kaito_catalog", name: "Magic Kaito" },
        { type: "series", id: "ginban_catalog", name: "Ginban Kaleidoscope" },
        { type: "series", id: "black_cat_catalog", name: "Black Cat" },

        { type: "series", id: "pentaksub_catalog", name: "Jiwa Seorang Pentaksub" },
        { type: "series", id: "projek_catalog", name: "Project High Council" },
        { type: "series", id: "anak_mak_catalog", name: "Suamiku Anak Mak" },
        { type: "series", id: "cela_catalog", name: "Cela" },
        { type: "series", id: "budak_magik_catalog", name: "Budak Magik" },
        { type: "series", id: "hening_cinta_catalog", name: "Hening Cinta" },
        { type: "series", id: "walid_catalog", name: "Walid" },
        { type: "series", id: "sesaat_lebih_catalog", name: "Sesaat Lebih" },
        { type: "series", id: "seadanya_kita_catalog", name: "Seadanya Kita" },
        { type: "series", id: "satu_dua_dia_catalog", name: "Satu Dua .. Dia?" },
        { type: "series", id: "puteri_and_phrince_catalog", name: "Putri and Phrince" },
        { type: "series", id: "puteri_kelas_atas_catalog", name: "Puteri Kelas Atas" },
        { type: "series", id: "pabila_dia_tersenyum_catalog", name: "Pabila Dia Tersenyum" },
        { type: "series", id: "mitos_cinta_akira_catalog", name: "Mitos Cinta Akira" },
        { type: "series", id: "lambaian_huda_catalog", name: "Lambaian Huda" },
        { type: "series", id: "kelas_belakang_catalog", name: "Kelas Belakang" },
        { type: "series", id: "bidaah_catalog", name: "Bidaah" },
        { type: "series", id: "abang_imam_catalog", name: "Abang Imam Minah Skuter" },
        { type: "series", id: "terlanjur_cinta_catalog", name: "Terlanjur Cinta" },
        { type: "series", id: "w_two_world_catalog", name: "W : Two World" },
        { type: "series", id: "dihatiku_ada_kamu_catalog", name: "Di Hatiku Ada Kamu" },
        { type: "series", id: "aisya_catalog", name: "AI.5YA" },
        { type: "series", id: "alter_naratif_catalog", name: "Alter Naratif" },
        { type: "series", id: "anggun_mikayla_catalog", name: "Anggun Mikayla" },
        { type: "series", id: "ijab_kabut_catalog", name: "Ijab Kabut" },
        { type: "series", id: "nenek_bongkok_tiga_catalog", name: "Nenek Bongkok Tiga" },
        { type: "series", id: "gadis_masa_catalog", name: "Gadis Masa" },
        { type: "series", id: "saat_aku_tahu_catalog", name: "Saat Aku Tahu" },
        { type: "series", id: "aku_pilih_pelangi_catalog", name: "Aku Pilih Pelangi" },
        { type: "series", id: "bayangan_dendam_catalog", name: "Bayangan Dendam" },
        { type: "series", id: "bidadari_tanpa_syurga_catalog", name: "Bidadari Tanpa Syurga" },
        { type: "series", id: "cinta_dalam_sekam_catalog", name: "Cinta Dalam Sekam" },
        { type: "series", id: "perempuan_sialan_catalog", name: "Dia Perempuan Sialan (The Hidden Hand)" },
        { type: "series", id: "perfect_family_catalog", name: "Perfect Family" },
        { type: "series", id: "cinderella_at_2am_catalog", name: "Cinderella at 2AM" },
        { type: "series", id: "brewing_love_catalog", name: "Brewing Love" },
        { type: "series", id: "family_by_choice_catalog", name: "Family by Choice" },
        { type: "series", id: "undercover_high_school_catalog", name: "Undercover High School" },
        { type: "series", id: "crushology_101_catalog", name: "Crushology 101" },
        { type: "series", id: "my_girlfriend_is_a_man_catalog", name: "My Girlfriend Is a Man" },
        { type: "series", id: "my_youth_catalog", name: "My Youth" },
        { type: "series", id: "reborn_rookie_catalog", name: "Reborn Rookie" },
        { type: "series", id: "love_in_sync_catalog", name: "Love in Sync" },
        { type: "series", id: "the_secret_catalog", name: "The Secret" },
        { type: "series", id: "good_partner_catalog", name: "Good Partner" },
        { type: "series", id: "sebenarnya_saya_isteri_dia_catalog", name: "Sebenarnya Saya Isteri Dia" },
        { type: "series", id: "andai_masih_ada_maaf_catalog", name: "Andai Masih Ada Maaf" },
        { type: "series", id: "jibril_catalog", name: "Jibril" },
        { type: "series", id: "ganjil_catalog", name: "Ganjil" },
        { type: "series", id: "hilang_catalog", name: "Hilang" },
        { type: "series", id: "jendela_hati_catalog", name: "Jendela Hati" },
        { type: "series", id: "nafsu_catalog", name: "Nafsu" },
        { type: "series", id: "otw_halal_catalog", name: "OTW Halal" },
        { type: "series", id: "seribu_nina_catalog", name: "Seribu Nina" },
        
        { type: "series", id: "hada_kiddy_catalog", name: "HaDa Kiddy" },
        { type: "series", id: "kd_malay_catalog", name: "Kids Delights (Malay)" },
        { type: "series", id: "kd_eng_catalog", name: "Kids Delights (Eng)" },
        { type: "series", id: "story_catalog", name: "Story Of Islam" },
        { type: "series", id: "ustaz_auni_catalog", name: "Koleksi Ustaz Auni Mohamed" },
        { type: "series", id: "ustaz_amin_catalog", name: "Koleksi Ustaz Muhamad Amin" },
        { type: "series", id: "ustaz_azhar_catalog", name: "Ceramah Ustaz Azhar Idrus" },       
        { type: "series", id: "akhir_zaman_catalog", name: "Kisah Hidup Akhir Zaman - Ustaz Wadi Annuar" },
        { type: "series", id: "siri_ustazwadi_catalog", name: "Ceramah Ustaz Wadi Annuar" },
        { type: "series", id: "kisah_sahabat_catalog", name: "Kisah Para Sahabat Nabi - Ustaz Wadi Annuar" },
        { type: "series", id: "mahsyar_catalog", name: "Mahsyar - Ustaz Wadi Annuar" },
        { type: "series", id: "filem_dakwah_sengketa_catalog", name: "Filem Dakwah - Sengketa" },
        { type: "series", id: "sirah_nabawiyyah_catalog", name: "Sirah Nabawiyyah - Ustaz Azlan Shah" },
        { type: "series", id: "ustaz_azlan_catalog", name: "Koleksi Ustaz Azlan Shah" },
        { type: "series", id: "sirah_nabi_catalog", name: "Kisah Perjalanan Hidup Rasulullah SAW - Ustaz Azlan" },
        { type: "series", id: "siri_sirah_catalog", name: "Siri Sirah - Ustazah Nabihah Zakaria" },
        
        { type: "series", id: "sembang_seram_catalog", name: "Podcast Sembang Seram" },    
        
        { type: "series", id: "your_turn_to_kill_catalog", name: "Your Turn To Kill" },

        { type: "series", id: "playful_kiss_catalog", name: "Playful Kiss" },
        { type: "series", id: "heartstring_catalog", name: "Heartstrings" },
        { type: "series", id: "stairway_to_heaven_catalog", name: "Stairway To Heaven" },  
        { type: "series", id: "mumul_zzumul_catalog", name: "Mumul Zzumul" },
        { type: "series", id: "ma_boy_catalog", name: "Ma Boy" },
        { type: "series", id: "shark2_catalog", name: "Shark: The Storm 2" },
        { type: "series", id: "iloveyou_loser_catalog", name: "I Love You, Loser!" },
        { type: "series", id: "blue_birthday_catalog", name: "Blue Birthday" },
        { type: "series", id: "daebaking_catalog", name: "DaebaKing" },
        { type: "series", id: "like_catalog", name: "Like" },
        { type: "series", id: "a_teen_catalog", name: "A-Teen" },
        { type: "series", id: "a_teen2_catalog", name: "A-Teen Season 2" },
        { type: "series", id: "handmade_love_catalog", name: "Handmade Love" },
        { type: "series", id: "17_special_catalog", name: "Seventeen Special" },
        { type: "series", id: "ending_again_catalog", name: "Ending Again" },
        { type: "series", id: "be_my_boyfriend_catalog", name: "Be My Boyfriend" },
        { type: "series", id: "mermaid_prince_catalog", name: "Mermaid Prince" },
        { type: "series", id: "dalgona_catalog", name: "Dalgona" },
        { type: "series", id: "flower_catalog", name: "Flower Ever After" },
        
        { type: "series", id: "chiquititas_song_catalog", name: "Chiquititas Song" },
        { type: "series", id: "chiquititas_catalog", name: "Chiquititas" },
        
        { type: "series", id: "running_man_catalog", name: "Runningman 1-324" },
        { type: "series", id: "running_man_2_catalog", name: "Runningman 325-345" },
        { type: "series", id: "running_man_3_catalog", name: "Runningman 346-559" },
        { type: "series", id: "running_man_4_catalog", name: "Runningman 560-679" },
        { type: "series", id: "running_man_5_catalog", name: "Runningman 680-732" },
        { type: "series", id: "running_man_6_catalog", name: "Runningman 733-now" },
        // Katalog CARIAN (hanya muncul bila guna fungsi search dalam app)
        { type: "series", id: "daryz_search", name: "Cari DaRyz", extra: [{ name: "search", isRequired: true }], extraSupported: ["search"], extraRequired: ["search"] }
    ]
};

// ==========================================
// KUMPULAN KATALOG  (edit senarai di sini sahaja)
// Katalog dalam "members" disorokkan dari senarai utama dan digabung jadi 1 katalog.
// "members" = kunci dalam seriesDatabase (nama katalog, cth "playful_kiss_catalog").
// Tambah drama/anime baru? Letak kuncinya dalam senarai yang sesuai.
// sortAZ: true  -> susun ikut abjad;  false -> ikut turutan dalam senarai
// ==========================================
// ==========================================
// GABUNG MUSIM (SEASONS)
// Setiap baris = 1 tajuk. "seasons" = kunci katalog ikut turutan musim (musim 1, 2, 3, ...).
// Semua musim jadi 1 siri dengan pilihan Season dalam app. Siri yang disatukan guna ID musim 1
// (jadi sejarah tontonan musim 1 kekal). Musim kosong dilangkau tapi nombor musim kekal.
// Tambah siri baru? Salin satu baris dan tukar nama + kunci katalog.
// Pilihan: poster, description juga boleh diletak untuk menggantikan milik musim 1.
// Pilihan: continuous: true -> nombor episod bersambung antara musim (musim 2 bermula selepas episod terakhir musim 1).
// ==========================================
const SEASON_GROUPS = [
    { name: "Courage The Cowardly Dog", seasons: ["courage1_catalog", "courage2_catalog", "courage3_catalog", "courage4_catalog"] },
    { name: "Totally Spies", seasons: ["spies1_catalog", "spies2_catalog", "spies3_catalog"] },
    { name: "Mr Bean Animation", seasons: ["mr_bean_s1_catalog", "mr_bean_s2_catalog", "mr_bean_s3_catalog", "mr_bean_s4_catalog"] },
    { name: "Oggy and The Cockroaches", seasons: ["oggy1_catalog", "oggy2_catalog", "oggy3_catalog", "oggy4_catalog", "oggy5_catalog"] },
    { name: "Shaman King", seasons: ["shaman_king_s1_catalog", "shaman_king_s2_catalog"] },
    { name: "Black Clover", seasons: ["black_clover_s1_catalog", "black_clover_s2_catalog"] },
    { name: "A-Teen", seasons: ["a_teen_catalog", "a_teen2_catalog"] },
    { name: "Nisekoi", seasons: ["nisekoi_catalog", "nisekoi_2_catalog"] },
    { name: "Catch! Teenieping", seasons: ["teenieping1_catalog", "teenieping2_catalog", "teenieping3_catalog", "teenieping4_catalog", "teenieping5_catalog"] },
    { name: "Running Man", seasons: ["running_man_catalog", "running_man_2_catalog", "running_man_3_catalog", "running_man_4_catalog", "running_man_5_catalog", "running_man_6_catalog"], continuous: true },
];

const CATALOG_GROUPS = [
    {
        id: "korean_catalog",
        name: "Korean",
        sortAZ: true,
        members: [
            "kor_movies_catalog",
            "shark2_catalog", "mumul_zzumul_catalog", "ma_boy_catalog", "iloveyou_loser_catalog",
            "blue_birthday_catalog", "daebaking_catalog", "playful_kiss_catalog", "7_firstkissed_catalog",
            "like_catalog", "a_teen_catalog", "a_teen2_catalog", "handmade_love_catalog", "heartstring_catalog",
            "17_special_catalog", "ending_again_catalog", "be_my_boyfriend_catalog", "stairway_to_heaven_catalog",
            "mermaid_prince_catalog", "dalgona_catalog", "flower_catalog", "kor_movies_catalog"
        ]
    },
    {
        id: "Islamic_catalog",
        name: "Collection Islamic",
        sortAZ: true,
        members: [
            "ceramah_ustazazhar_catalog", "ceramah_ustazwadi_catalog", "ceramah_ustazauni_catalog", "ceramah_ustazazlan_catalog", "ceramah_ustazamin_catalog", "ceramah_ustazahnabihah_catalog",
            "hada_kiddy_catalog", "kd_malay_catalog", "kd_eng_catalog", "story_catalog"
        ]
    },
    {
        id: "japan_catalog",
        name: "Japan",
        sortAZ: true,
        members: [
            "your_turn_to_kill_catalog", "jap_movies_catalog"
        ]
    },
    {
        id: "viu_catalog",
        name: "Viu Malaysia",
        sortAZ: true,
        members: [
            "gadis_masa_catalog", "nenek_bongkok_tiga_catalog", "ijab_kabut_catalog", "anggun_mikayla_catalog", "abang_imam_catalog",
            "alter_naratif_catalog", "aisya_catalog", "dihatiku_ada_kamu_catalog", "w_two_world_catalog", "terlanjur_cinta_catalog",
            "bidaah_catalog", "kelas_belakang_catalog", "lambaian_huda_catalog", "mitos_cinta_akira_catalog", "pabila_dia_tersenyum_catalog",
            "puteri_kelas_atas_catalog", "puteri_and_phrince_catalog", "satu_dua_dia_catalog", "seadanya_kita_catalog", "sesaat_lebih_catalog",
            "walid_catalog", "perempuan_sialan_catalog", "anak_mak_catalog", "cela_catalog", "hening_cinta_catalog", "saat_aku_tahu_catalog", 
            "aku_pilih_pelangi_catalog", "bayangan_dendam_catalog", "bidadari_tanpa_syurga_catalog", "cinta_dalam_sekam_catalog", "seribu_nina_catalog",
            "andai_masih_ada_maaf_catalog", "sebenarnya_saya_isteri_dia_catalog", "jibril_catalog", "ganjil_catalog", "hilang_catalog", 
            "jendela_hati_catalog", "nafsu_catalog", "otw_halal_catalog", "perfect_family_catalog",
            "cinderella_at_2am_catalog", "brewing_love_catalog", "family_by_choice_catalog", "undercover_high_school_catalog", "crushology_101_catalog",
            "my_girlfriend_is_a_man_catalog", "my_youth_catalog", "reborn_rookie_catalog", "love_in_sync_catalog", "the_secret_catalog", "good_partner_catalog"
        ]
    },
    {
        id: "malaysia_catalog",
        name: "Malaysia",
        sortAZ: true,
        members: [
            "pentaksub_catalog", "projek_catalog", "budak_magik_catalog", "malaysian_movies_catalog", "malaysian_movies_seram_catalog", "indo_movies_catalog"
        ]
    },
    {
        id: "podcast_catalog",
        name: "Podcast",
        sortAZ: true,
        members: [
            "sembang_seram_catalog",
        ]
    },
    {
        id: "indonesia_catalog",
        name: "Indonesia",
        sortAZ: true,
        members: [
            "indo_movies_catalog", "suzanna_catalog"
        ]
    },
    {
        id: "anime_catalog",
        name: "Anime",
        sortAZ: true,
        members: [
            "sakura_catalog", "clear_card_catalog", "boruto_catalog", "jjk_catalog", "super_beerus_catalog",
            "edens_zero_catalog", "chiikawa_catalog", "shaman_king_s1_catalog", "shaman_king_s2_catalog",
            "high_rise_invasion_catalog", "demon_slayer_catalog", "midori_days_catalog",
            "ueki_catalog", "magic_kaito_catalog", "ginban_catalog", "black_clover_s1_catalog", "black_clover_s2_catalog",
            "black_cat_catalog", "digimon_01_catalog", "digimon_02_catalog", "digimon_03_catalog",
            "digimon_2020_catalog", "digimon_fusion_catalog", "digimon_tamers_catalog",
            "digimon_frontier_catalog", "digimon_savers_catalog", "another_catalog"
        ]
    },
    {
        id: "malay_dub_catalog",
        name: "Animation Malay Dubbed",
        sortAZ: true,
        members: [
            "animation_dub_catalog", "omar_dan_hana_catalog", "anak_sidek_catalog", "satria_7pahlawan_catalog",  "nisekoi_catalog", "nisekoi_2_catalog",
             "dash_catalog", "hagemaru_catalog", "ninja_boy_catalog", "shin_chan_catalog", "naruto_1-220_catalog", "time_bokan_24_catalog", 
             "doraemon_catalog", "pokemon_catalog", "conan_catalog", "black_bullet_catalog", "gundam_catalog", "kaito_kid_catalog", "one_punch_man_s1_malay_catalog", 
        ]
    },
    {
        id: "animation_catalog",
        name: "Animation",
        sortAZ: true,
        members: [
            "felix_catalog", "tiny_planet_catalog", "tomjerry_catalog", "oddbods_catalog", "baby_oddbods_catalog",
            "courage1_catalog", "courage2_catalog", "courage3_catalog", "courage4_catalog",
            "martin_catalog", "spies1_catalog", "spies2_catalog", "spies3_catalog",
            "mr_bean_s1_catalog", "mr_bean_s2_catalog","mr_bean_s3_catalog", "mr_bean_s4_catalog", 
            "oggy1_catalog", "oggy2_catalog", "oggy3_catalog", "oggy4_catalog", "oggy5_catalog",
            "teenieping1_catalog", "teenieping2_catalog", "teenieping3_catalog", "teenieping4_catalog", "teenieping5_catalog",
        ]
    },
    {
        id: "ceramah_ustazwadi_catalog",
        name: "Ceramah Ustaz Wadi Annuar",
        sortAZ: true,
        members: [
            "siri_ustazwadi_catalog", "akhir_zaman_catalog", "kisah_sahabat_catalog", "mahsyar_catalog", "filem_dakwah_sengketa_catalog"
        ]
    },
    {
        id: "ceramah_ustazazhar_catalog",
        name: "Ceramah Ustaz Azhar Idrus",
        sortAZ: true,
        members: [
            "ustaz_azhar_catalog"
        ]
    },
    {
        id: "ceramah_ustazauni_catalog",
        name: "Ceramah Ustaz Auni Mohamed",
        sortAZ: true,
        members: [
            "ustaz_auni_catalog"
      ]
    },
    {
        id: "ceramah_ustazazlan_catalog",
        name: "Ceramah Ustaz Azlan Shah",
        sortAZ: true,
        members: [
            "sirah_nabawiyyah_catalog", "sirah_nabi_catalog", "ustaz_azlan_catalog"
        ]
    },
    {
        id: "ceramah_ustazamin_catalog",
        name: "Ceramah Ustazah Amin",
        sortAZ: true,
        members: [
            "ustaz_amin_catalog"
        ]
    },
    {
        id: "ceramah_ustazahnabihah_catalog",
        name: "Ceramah Ustazah Nabihah Zakaria",
        sortAZ: true,
        members: [
            "siri_sirah_catalog"

        ]
    }
];

// ==========================================
// 2. DATABASE SENARAI SIRI & FILEM
// ==========================================
const seriesDatabase = {
    "cela_catalog": {
        id: "cela",
        catalogId: "cela_catalog",
        name: "Cela",
        poster: "https://i.postimg.cc/wMQGzXkZ/Cela-DP.jpg",
        background: "https://i.postimg.cc/qqx5rsG9/Cela-WP.jpg",
        backgroundShape: "Landscape",
        description: "Dato' Anees (Nabila Huda), wanita kaya yang juga isteri kepada bekas majikan arwah bapa Kaer. Dato' Anees menawarkan bantuan dengan membawa Kaer dan ibunya tinggal bersama di banglonya, serta menggajikan ibu Kaer sebagai pembantu rumah. Dato' Anees menjadi tempat Kaer menagih sokongan emosi. Lama-kelamaan, Kaer yang baru berusia 17 tahun mula terjatuh hati dan terobsesi dengan sosok Dato' Anees yang jauh lebih matang. Hubungan mereka bertukar menjadi intim. Namun, Kaer tidak menyedari bahawa dia hanyalah mainan dan sebahagian daripada rancangan manipulasi penuh lakonan dalam hidup orang kaya.",
        episodes: createEpisodes([
            { title: "Cela - Episode 01" , url: `${STREAM_HOST}/dl/6ae533e06e979983cdce66fe` },
            { title: "Cela - Episode 02" , url: `${STREAM_HOST}/dl/6ae533dc6e979983cdce66fd` },
            { title: "Cela - Episode 03" , url: `${STREAM_HOST}/dl/6ae533db6e979983cdce66fc` },
            { title: "Cela - Episode 04" , url: `${STREAM_HOST}/dl/6ae533db6e979983cdce66fb` },
            { title: "Cela - Episode 05" , url: `${STREAM_HOST}/dl/6ae533b46e979983cdce66fa` },
            { title: "Cela - Episode 06" , url: `${STREAM_HOST}/dl/6ae533ae6e979983cdce66f9` },
            { title: "Cela - Episode 07" , url: `${STREAM_HOST}/dl/6ae533ad6e979983cdce66f7` },
            { title: "Cela - Episode 08" , url: `${STREAM_HOST}/dl/6ae533a56e979983cdce66f3` },
            { title: "Cela - Episode 09" , url: `${STREAM_HOST}/dl/6ae533a56e979983cdce66f4` },
            { title: "Cela - Episode 10" , url: `${STREAM_HOST}/dl/6ae533a86e979983cdce66f5` },
            { title: "Cela - Episode 11" , url: `${STREAM_HOST}/dl/6ae533a96e979983cdce66f6` },
            { title: "Cela - Episode 12" , url: `${STREAM_HOST}/dl/6ae533a36e979983cdce66f2` }
        ])
    },
    "suzanna_catalog": {
        id: "suzanna_catalog",
        isMulti: true,
        items: [
           { id: "suzanna_malam_jumat_kliwon", name: "Malam Jumat Kliwon", poster: "https://i.postimg.cc/VvB4vK5Q/malam-jumat-kliwon-DP.jpg" , background : "https://i.postimg.cc/vZQ84T2w/Malam-Jumat-Kliwon.webp", description : "Ayu Minati (Suzzanna) yang sedang sarat mengandung. Dia telah disantau oleh madunya, Roro Ayu Punirah, yang bekerjasama dengan dukun teluh untuk merampas harta keluarga. Akibat santau tersebut, bayi di dalam kandungannya berpindah ke bahagian belakang badan lalu meletus keluar pada malam Jumaat Kliwon, menyebabkan Minati mati tragis dan bangkit sebagai hantu Sundel Bolong.", url: `${STREAM_HOST}/dl/6aee545e6e979983cdce696d` },
           { id: "suzanna_bernapas_dalam_kubur_2018", name: "Suzzanna: Bernapas dalam Kubur", poster: "https://i.postimg.cc/tJtDJBJ8/bernapas-dalam-kubur-DP.jpg" , background : "https://i.postimg.cc/sxRw3kjq/Bernapas-Dalam-Kubur-WP.webp", description : "Suzzanna dan Satria (Herjunot Ali), yang telah berkahwin selama tujuh tahun namun belum dikurniakan zuriat. Kegembiraan akhirnya tiba apabila Suzzanna disahkan hamil. Namun, berita gembira itu hadir bersamaan dengan tugasan Satria yang terpaksa keluar negara untuk urusan kerja. Ketiadaan Satria di rumah telah dimanfaatkan oleh empat orang pekerjanya yang menyimpan dendam iaitu Jonal, Umar, Dudun, dan Gino. Mereka merancang untuk merompak rumah Satria. Malang tidak berbau, Suzzanna yang sepatutnya keluar bersama pembantu rumahnya, terpaksa pulang awal kerana keadaan badannya yang lemah. Keesokan harinya, satu keanehan berlaku apabila Suzzanna kembali beraktiviti di rumah seperti biasa seolah-olah tiada apa yang terjadi. Hakikatnya, dia telah bangkit semula sebagai hantu Sundel Bolong demi membalas dendam terhadap keempat-empat pembunuhnya dan melindungi bayinya.", url: `${STREAM_HOST}/dl/6aee54a56e979983cdce696e` },
           { id: "suzanna_malam_satu_suro_1988", name: "Malam Satu Suro", poster: "https://i.postimg.cc/1XcMXvX2/Malam-Satu-Suro-DP.jpg" , background : "https://i.postimg.cc/FzgGzTz6/Malam-Satu-Suro-WP.webp", description : "Selepas berkahwin, Bardo membawa Suketi tinggal di kota. Kehidupan mereka sangat bahagia dan dikurniakan dua orang cahaya mata, Ryo dan Preti. Malah, perniagaan Bardo juga menjadi sangat maju dan kaya-raya. Namun, kejayaan Bardo menimbulkan rasa cemburu dan dengki dalam kalangan pesaing perniagaannya, terutamanya seorang lelaki licik bernama Joni. Joni berjumpa dengan seorang bomoh lain bernama Mak Talo dan mendapat tahu rahsia bahawa isteri Bardo sebenarnya adalah jelmaan sundel bolong. Kumpulan penjahat Joni bertindak mencabut paku keramat di kepala Suketi semasa ketiadaan Bardo, menyebabkan Suketi serta-merta berubah semula menjadi hantu sundel bolong yang mengerikan. Keadaan menjadi lebih tragis apabila anak perempuan mereka, Preti, diculik oleh kumpulan Joni dan terbunuh secara tidak sengaja.", url: `${STREAM_HOST}/dl/6aee580b6e979983cdce6970` },
           { id: "suzanna_sengkolo_malam_satu_suro", name: "Sengkolo Malam Satu Suro", poster: "https://i.postimg.cc/RhQGhgh8/Sengkolo-Malam-Satu-Suro-DP.jpg" , background : "https://i.postimg.cc/MH8dzCZx/Sengkolo-Malam-Satu-Suro-WP.jpg", description : "Selepas berkahwin, Bardo membawa Suketi tinggal di kota. Kehidupan mereka sangat bahagia dan dikurniakan dua orang cahaya mata, Ryo dan Preti. Malah, perniagaan Bardo juga menjadi sangat maju dan kaya-raya. Namun, kejayaan Bardo menimbulkan rasa cemburu dan dengki dalam kalangan pesaing perniagaannya, terutamanya seorang lelaki licik bernama Joni. Joni berjumpa dengan seorang bomoh lain bernama Mak Talo dan mendapat tahu rahsia bahawa isteri Bardo sebenarnya adalah jelmaan sundel bolong. Kumpulan penjahat Joni bertindak mencabut paku keramat di kepala Suketi semasa ketiadaan Bardo, menyebabkan Suketi serta-merta berubah semula menjadi hantu sundel bolong yang mengerikan. Keadaan menjadi lebih tragis apabila anak perempuan mereka, Preti, diculik oleh kumpulan Joni dan terbunuh secara tidak sengaja.", url: `${STREAM_HOST}/dl/6aee580b6e979983cdce6970` },           
           { id: "suzanna_ratu_buaya_putih_1988", name: "Ratu Buaya Putih", poster: "https://i.postimg.cc/yxzv7M6C/Ratu-Buaya-Putih-DP.jpg" , background : "https://i.postimg.cc/1XZJykRQ/Ratu-Buaya-Putih-WP.webp", description : "Sumarna, seorang pawang buaya yang tamak. Demi mendapatkan kuasa mutlak untuk menundukkan segala jenis buaya yang ganas, dia sanggup membunuh teman seperguruannya sendiri untuk merebut sebuah jimat sakti. Walaupun berjaya memiliki jimat tersebut, perbuatan kejam Sumarna mendatangkan kutukan yang dahsyat ke atas keturunannya. Dua puluh tahun kemudian, kutukan itu mula menuntut bela. Dua orang anak lelaki Sumarna meninggal dunia secara tragis dalam masa yang singkat.", url: `${STREAM_HOST}/dl/6aee59956e979983cdce6971` },
           { id: "suzanna_nyi_blorong_1982", name: "Nyi Blorong", poster: "https://i.postimg.cc/nrt0nyFy/Nyi-Blorong-DP.jpg" , background : "https://i.postimg.cc/rsLQqByX/Nyi-Blorong-WP.jpg", description : "aden Cokro (diperankan oleh Ratno Timoer) ialah seorang lelaki yang tamak dan bercita-cita mahu menjadi pengusaha yang kaya-raya. Demi mencapai impiannya, dia sanggup melakukan ritual hitam dan meminta bantuan daripada Nyi Blorong. Nyi Blorong bersetuju untuk memberikan kekayaan melimpah-ruah dengan syarat Cokro mesti memberikan tumbal nyawa daripada ahli keluarga sendiri secara berkala.", url: `${STREAM_HOST}/dl/6aee59dc6e979983cdce6972` },
           { id: "suzanna_sundel_bolong_1981", name: "Sundel Bolong", poster: "https://i.postimg.cc/5yMnfh4Z/Sundel-Bolong-DP.jpg" , background : "https://i.postimg.cc/RhzXvkSD/Sundel-Bolong-WP.webp", description : "Alisa (Suzzanna) ialah seorang bekas pekerja seks yang memilih untuk meninggalkan masa lalu hitamnya selepas berkahwin dengan seorang kapten kapal bernama Hendarto (Barry Prima). Kehidupan mereka pada awalnya bahagia, sehinggalah Hendarto terpaksa belayar ke luar negara bagi tugasan jangka masa lama. Tinggal sendirian di rumah, Alisa mengisi masa lapang dengan menyulam pakaian. Dia kemudian mendapat tawaran bekerja daripada seorang pemilik butik pakaian bernama Rudi (Rudy Salam). Disebabkan hasutan bekas germo (ibu ayam) Alisa iaitu Mami (Ruth Pelupessy) yang berasa rugi atas persaraan Alisa, Rudi mula tergoda dengan kecantikan Alisa dan cuba mengganggunya. Alisa dengan tegas menolak pelawaan Rudi. Berang dan sakit hati dengan penolakan tersebut, Rudi dan konconya menculik serta merogol Alisa secara berkumpulan di sebuah bangunan kosong sehingga dia mengandung. Kematian tragis itu mengubah roh Alisa menjadi Sundel Bolong—makhluk halus bergaun putih dan berambut panjang dengan lubang reput yang menggerikan di bahagian belakang badannya. Menggunakan nama samaran 'Shinta', arwah Alisa mula memburu dan membunuh satu persatu dalang yang telah merosakkan kehidupannya termasuk Rudi, Mami, dan konco-konconya.", url: `${STREAM_HOST}/dl/6aee5a736e979983cdce6973` },
           { id: "suzanna_napsu_gila_1973", name: "Napsu Gila", poster: "https://i.postimg.cc/HnCBTqYv/Napsu-Gila-DP.webp" , background : "https://i.postimg.cc/qqdjpPJW/Napsu-Gila-WP.webp", description : "Keadaan yang pada mulanya tenang bertukar menjadi mimpi ngeri sejurus selepas ketibaan Piah. Rentetan peristiwa pembunuhan misteri mula berlaku satu per satu melibatkan penghuni rumah tersebut. Mangsa pertama ialah Nurnaningsih yang ditemui mati tergantung. Piah cuba meyakinkan orang lain bahawa mangsa membunuh diri, namun rahsia itu mula goyah apabila Kapten secara tidak sengaja ternampak bahawa Piah sebenarnya yang membunuh wanita tersebut. Keadaan menjadi semakin kucar-kacir dan penuh paranoia apabila Kapten serta pengurus rumah, Pak Siman, turut dibunuh secara kejam (di mana Baron juga terlibat dalam kegilaan itu). Pak Bisu yang mula mencurigai gerak-geri Piah dan menyimpan nota harian tentang kematian di wisma tersebut akhirnya turut ditemui mati di dalam peti matinya.", url: `${STREAM_HOST}/dl/6aee5ae46e979983cdce6974` },
           { id: "suzanna_ratapan_dan_rintihan", name: "Ratapan Dan Rintihan", poster: "https://i.postimg.cc/T1XCTzd7/Ratapan-Dan-Rintihan-DP.webp" , background : "https://i.postimg.cc/cCNXdpxD/Ratapan-Dan-Rintihan-WP.webp", description : "Kerana berasa malu dengan masa lalu dan takut kehilangan calon suaminya, Marlia (Suzzanna) memilih untuk menyembunyikan kewujudan anak kandungnya, Jamila (Faradilla Sandy), yang tidak diketahui siapa bapa kandungnya. Marlia menyerahkan Jamila untuk dijaga oleh Mak Zaenab. Marlia kemudiannya berkahwin dengan Johan (Ratno Timoer), seorang lelaki yang sudah menduda sebanyak dua kali semata-mata kerana perkahwinan terdahulu tidak dikurniakan zuriat. Johan mengahwini Marlia demi memenuhi tuntutan ibunya yang amat inginkan cucu. Selepas tujuh tahun melayari bahtera perkahwinan, Marlia masih gagal memberikan zuriat kepada Johan. ", url: `${STREAM_HOST}/dl/6aee5ae86e979983cdce6975` }, 
        ]
    },
    "teenieping1_catalog": {
        id: "teenieping1",
        catalogId: "teenieping1_catalog",
        name: "Catch! Teenieping",
        poster: "https://i.postimg.cc/yNyzp5kc/Catch-Teenieping-DP.webp",
        background: "https://i.postimg.cc/zfF12MVR/Catch-Teenieping-WP.jpg",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aeac8a75478b7042933a91e` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aeac8065478b7042933a913` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aeac9235478b7042933a928` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aeac91e5478b7042933a926` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aeac8ac5478b7042933a921` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aeac8065478b7042933a90e` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aeac88d5478b7042933a919` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aeac92d5478b7042933a92b` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aeac92d5478b7042933a92a` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aeac92d5478b7042933a92c` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aeac72f5478b7042933a903` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aeac7a25478b7042933a909` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6aeac7a25478b7042933a905` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6aeac7a25478b7042933a906` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6aeac71e6e979983cdce692a` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6aeac7a25478b7042933a904` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6aeac8065478b7042933a912` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6aeac8255478b7042933a915` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6aeac8065478b7042933a90f` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6aeac7245478b7042933a900` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6aeac8065478b7042933a911` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6aeac7a25478b7042933a908` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6aeac7a75478b7042933a90b` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6aeac71e6e979983cdce692e` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6aeac88d5478b7042933a918` },
            { title: "Episode 26", url: `${STREAM_HOST}/dl/6aeac8065478b7042933a910` },
            { title: "Episode 27", url: `${STREAM_HOST}/dl/6aeac91d5478b7042933a923` },
            { title: "Episode 28", url: `${STREAM_HOST}/dl/6aeac82f5478b7042933a916` },
            { title: "Episode 29", url: `${STREAM_HOST}/dl/6aeac72f5478b7042933a902` },
            { title: "Episode 30", url: `${STREAM_HOST}/dl/6aeac92d5478b7042933a929` },
            { title: "Episode 31", url: `${STREAM_HOST}/dl/6aeac7a75478b7042933a90d` },
            { title: "Episode 32", url: `${STREAM_HOST}/dl/6aeac88d5478b7042933a91d` },
            { title: "Episode 33", url: `${STREAM_HOST}/dl/6aeac71e6e979983cdce6929` },
            { title: "Episode 34", url: `${STREAM_HOST}/dl/6aeac71e6e979983cdce692b` },
            { title: "Episode 35", url: `${STREAM_HOST}/dl/6aeac8a75478b7042933a91f` },
            { title: "Episode 36", url: `${STREAM_HOST}/dl/6aeac8245478b7042933a914` },
            { title: "Episode 37", url: `${STREAM_HOST}/dl/6aeac88d5478b7042933a91b` },
            { title: "Episode 38", url: `${STREAM_HOST}/dl/6aeac8ac5478b7042933a920` },
            { title: "Episode 39", url: `${STREAM_HOST}/dl/6aeac88d5478b7042933a91a` },
            { title: "Episode 40", url: `${STREAM_HOST}/dl/6aeac71e6e979983cdce692c` },
            { title: "Episode 41", url: `${STREAM_HOST}/dl/6aeac91e5478b7042933a927` },
            { title: "Episode 42", url: `${STREAM_HOST}/dl/6aeac7a75478b7042933a90c` },
            { title: "Episode 43", url: `${STREAM_HOST}/dl/6aeac91d5478b7042933a922` },
            { title: "Episode 44", url: `${STREAM_HOST}/dl/6aeac82f5478b7042933a917` },
            { title: "Episode 45", url: `${STREAM_HOST}/dl/6aeac7a25478b7042933a90a` },
            { title: "Episode 46", url: `${STREAM_HOST}/dl/6aeac88d5478b7042933a91c` },
            { title: "Episode 47", url: `${STREAM_HOST}/dl/6aeac92d5478b7042933a92d` },
            { title: "Episode 48", url: `${STREAM_HOST}/dl/6aeac7a25478b7042933a907` },
            { title: "Episode 49", url: `${STREAM_HOST}/dl/6aeac72a5478b7042933a901` },
            { title: "Episode 50", url: `${STREAM_HOST}/dl/6aeac71e6e979983cdce692d` },
            { title: "Episode 51", url: `${STREAM_HOST}/dl/6aeac91e5478b7042933a925` },
            { title: "Episode 52", url: `${STREAM_HOST}/dl/6aeac91e5478b7042933a924` }
        ])
    },
    "teenieping2_catalog": {
        id: "teenieping2",
        catalogId: "teenieping2_catalog",
        name: "Twinkle Catch! Teenieping",
        poster: "https://i.postimg.cc/rpNLZbKR/Twinkle-Catch-Teenieping-DP.webp",
        background: "https://i.postimg.cc/nLGtS5CX/Twinkle-Catch-Teenieping-WP.jpg",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aead1dd6e979983cdce6952` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aead1dd6e979983cdce6954` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aead1dd6e979983cdce6953` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aead1dd6e979983cdce6956` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aead1dd6e979983cdce6955` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aead1dd6e979983cdce6957` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aead18a6e979983cdce6951` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aead1846e979983cdce6950` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aead1846e979983cdce694f` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aead1846e979983cdce694e` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aead1716e979983cdce6948` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aead1716e979983cdce694a` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6aead1716e979983cdce694b` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6aead1716e979983cdce694d` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6aead1716e979983cdce6949` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6aead1716e979983cdce694c` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6aead114b12e94565aa066f7` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6aead10fb12e94565aa066f6` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6aead10ab12e94565aa066f4` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6aead10ab12e94565aa066f5` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6aead109b12e94565aa066ef` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6aead10ab12e94565aa066f2` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6aead10ab12e94565aa066f3` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6aead10ab12e94565aa066f0` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6aead109b12e94565aa066ee` },
            { title: "Episode 26", url: `${STREAM_HOST}/dl/6aead10ab12e94565aa066f1` }
        ])
    },
    "teenieping3_catalog": {
        id: "teenieping3",
        catalogId: "teenieping3_catalog",
        name: "Secret Catch! Teenieping",
        poster: "https://i.postimg.cc/d0jKNXL1/Secret-Catch-Teenieping-DP.webp",
        background: "https://i.postimg.cc/zfF12MVV/Secret-Catch-Teenieping-WP.jpg",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aead44d0189c5af1f64b597` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aead44d0189c5af1f64b598` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aead44d0189c5af1f64b599` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aead44d0189c5af1f64b59a` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aead44d0189c5af1f64b59b` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aead44d0189c5af1f64b59c` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aead4580189c5af1f64b59d` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aead4580189c5af1f64b59e` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aead4580189c5af1f64b59f` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aead4580189c5af1f64b5a0` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aead4a00189c5af1f64b5a1` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aead4a00189c5af1f64b5a2` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6aead4a00189c5af1f64b5a3` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6aead4a00189c5af1f64b5a4` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6aead4a00189c5af1f64b5a5` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6aead3db0189c5af1f64b594` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6aead3e00189c5af1f64b595` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6aead3e50189c5af1f64b596` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6aead3db0189c5af1f64b593` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6aead3d56e979983cdce695b` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6aead3d56e979983cdce6959` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6aead3d56e979983cdce695c` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6aead3d56e979983cdce695d` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6aead3d56e979983cdce695a` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6aead3d56e979983cdce6958` }
        ])
    },
    "teenieping4_catalog": {
        id: "teenieping4",
        catalogId: "teenieping4_catalog",
        name: "Dessert Catch! Teenieping",
        poster: "https://i.postimg.cc/Jh5WYgG7/Dessert-Catch-Teenieping-DP.webp",
        background: "https://i.postimg.cc/HL9CvKVp/Dessert-Catch-Teenieping-WP.jpg",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aeaca886e979983cdce692f` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aeaca886e979983cdce6930` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aeaca886e979983cdce6931` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aeaca886e979983cdce6932` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aeaca886e979983cdce6933` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aeaca886e979983cdce6934` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aeaca906e979983cdce6935` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aeaca906e979983cdce6936` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aeaca906e979983cdce6937` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aeaca906e979983cdce6938` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aeacb0b6e979983cdce6939` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aeacb0b6e979983cdce693a` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6aeacb0b6e979983cdce693b` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6aeacb0b6e979983cdce693c` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6aeacb0b6e979983cdce693d` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6aeacb0b6e979983cdce693e` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6aeacb136e979983cdce693f` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6aeacb136e979983cdce6940` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6aeacb136e979983cdce6941` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6aeacb136e979983cdce6942` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6aeacb4b6e979983cdce6943` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6aeacb4b6e979983cdce6944` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6aeacb4b6e979983cdce6945` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6aeacb4b6e979983cdce6946` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6aeacb4b6e979983cdce6947` }
        ])
    },
    "teenieping5_catalog": {
        id: "teenieping5",
        catalogId: "teenieping5_catalog",
        name: "Star Catch! Teenieping",
        poster: "https://i.postimg.cc/g0HPt5nk/Star-Catch-Teenieping-DP.webp",
        background: "https://i.postimg.cc/VNWcZTdz/Star-Catch-Teenieping-WP.jpg",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aead9936e979983cdce6961` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aead9936e979983cdce6962` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aead999267be32eb8d9d68a` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aead99e267be32eb8d9d68b` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aead99e267be32eb8d9d68c` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aead9a3267be32eb8d9d68d` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aeada23267be32eb8d9d692` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aeada23267be32eb8d9d68f` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aeada23267be32eb8d9d68e` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aeada23267be32eb8d9d690` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aeada23267be32eb8d9d691` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6aeada23267be32eb8d9d693` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6aeada24267be32eb8d9d695` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6aeada24267be32eb8d9d694` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6aeada2e267be32eb8d9d696` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6aeada2e267be32eb8d9d697` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6aeada55267be32eb8d9d698` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6aeada55267be32eb8d9d699` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6aeada6b267be32eb8d9d69a` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6aeada6b267be32eb8d9d69b` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6aeada6f267be32eb8d9d69c` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6aead9936e979983cdce6960` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6aead9936e979983cdce695e` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6aead9936e979983cdce6963` },
            { title: "Episode 26", url: `${STREAM_HOST}/dl/6aead9936e979983cdce695f` }
        ])
    },
    "cinderella_at_2am_catalog": {
        id: "cinderella_at_2am",
        catalogId: "cinderella_at_2am_catalog",
        name: "Cinderella at 2AM",
        poster: "https://i.postimg.cc/x1ytDP5H/cinderella-at-2-am-DP.jpg",
        background: "https://i.postimg.cc/fbz5w0qV/cinderella-at-2-am-WP.jpg",
        description: "Ha Yun-seo (Shin Hyun-been) ialah seorang wanita bekerjaya yang sangat berdikari, bijak, dan realistik. Dia bekerja sebagai ketua pasukan pemasaran di sebuah syarikat kad kredit terkemuka. Kehidupan Yun-seo yang stabil mula berubah apabila dia mendapat tahu bahawa kekasih mudanya, Seo Ju-won (Moon Sang-min)—yang selama ini disangka hanyalah seorang pekerja baharu biasa di pejabatnya—sebenarnya adalah anak pemilik syarikat (waris chaebol generasi ketiga) yang sedang menyamar. Mengetahui perbezaan darjat sosial mereka, ibu Ju-won yang kaya-raya telah menemui Yun-seo dan menawarkan sejumlah wang yang besar agar dia memutuskan hubungan dengan anaknya. Sebagai seorang wanita pragmatik yang tidak percaya pada keajaiban atau kisah dongeng Cinderella di alam nyata, Yun-seo memilih untuk bersikap realistik. Dia menerima wang tersebut dan berjanji akan berpisah dengan Ju-won dalam masa dua bulan.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea7f65892bec8df4deeff5` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea7fa4892bec8df4deeff9` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea7f6a892bec8df4deeff6` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea7f71892bec8df4deeff7` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea7f75892bec8df4deeff8` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea7f5d892bec8df4deeff4` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea7f58892bec8df4deeff3` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea7f53892bec8df4deeff2` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea7f3e892bec8df4deeff1` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea7f39892bec8df4deeff0` }
        ])
    },
    "perfect_family_catalog": {
        id: "perfect_family",
        catalogId: "perfect_family_catalog",
        name: "Perfect Family",
        poster: "https://i.postimg.cc/wjc08k2m/Perfect-Family-DP.jpg",
        background: "https://i.postimg.cc/2SF2RxGW/Perfect-Family-WP.jpg",
        description: "Choi Sun-hui dan Lee Su-yeon merupakan sahabat baik sejak zaman kanak-kanak semasa membesar di panti asuhan (rumah anak yatim). Selepas berlakunya satu insiden kebakaran besar di panti asuhan tersebut—di mana Sun-hui secara tidak sengaja menjadi punca kebakaran—Sun-hui telah diambil sebagai anak angkat oleh sebuah keluarga kaya, ternama, dan dihormati. Sejak itu, kehidupan Sun-hui berubah menjadi sangat cemerlang dan serba sempurna.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea7fbb892bec8df4deeffe` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea7fb7892bec8df4deeffd` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea7fb3892bec8df4deeffc` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea7fc3892bec8df4def000` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea7fbf892bec8df4deefff` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea7faf892bec8df4deeffb` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea7fac892bec8df4deeffa` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea7fc7892bec8df4def001` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea7fd2892bec8df4def004` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea7fee892bec8df4def005` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea7fce892bec8df4def003` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea7fcb892bec8df4def002` }
        ])
    },
    "brewing_love_catalog": {
        id: "brewing_love",
        catalogId: "brewing_love_catalog",
        name: "Brewing Love",
        poster: "https://i.postimg.cc/DwdBkc6S/Brewing-Love-DP.jpg",
        background: "https://i.postimg.cc/fRjBnvCm/Brewing-Love-WP.jpg",
        description: "Chae Yong Ju (lakonan Kim Se-jeong) ialah seorang bekas ahli pasukan khas tentera yang kini bekerja sebagai ketua pasukan pemasaran di syarikat minuman keras, Jisang Liquor. Dikenali sebagai Ratu Jualan, dia mendominasi industri tersebut dengan stamina besi, mental yang kuat, dan personaliti yang ceria. Bagaimanapun, cawangan tempat dia berkhidmat selama 6 tahun tiba-tiba terancam untuk ditutup. Demi menyelamatkan pekerjaan rakan-rakannya, Yong Ju memulakan misi penting untuk menjual produk bir baharu. Misi ini membawanya bertemu dengan Yoon Min Ju (lakonan Lee Jong-won), seorang pakar pembuat bir (brewmaster) berbakat besar dan CEO kepada sebuah kilang bir kecil di kawasan luar bandar. Min Ju ialah seorang empath—seorang yang terlampau sensitif sehingga mampu menyerap emosi orang di sekelilingnya. Untuk mengelakkan diri daripada kepenatan emosi, dia sengaja menjauhkan diri daripada orang ramai dan hidup dengan tenang.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea7bbb407f72dd9aaf150c` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea7bb6407f72dd9aaf150b` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea7bb6407f72dd9aaf150a` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea7bb6407f72dd9aaf1509` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea7bb1407f72dd9aaf1508` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea7bb1407f72dd9aaf1507` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea7bac407f72dd9aaf1506` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea7bac407f72dd9aaf1505` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea7b8e407f72dd9aaf1504` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea7b8a407f72dd9aaf1503` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea7b87407f72dd9aaf1502` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea7b82407f72dd9aaf1501` }

        ])
    },
    "family_by_choice_catalog": {
        id: "family_by_choice",
        catalogId: "family_by_choice_catalog",
        name: "Family by Choice",
        poster: "https://i.postimg.cc/XYcQSgLX/Family-by-Choice-DP.jpg",
        background: "https://i.postimg.cc/BncM9CpX/Family-by-Choice-WP.jpg",
        description: "Yoon Ju-won ialah seorang gadis ceria yang sentiasa menganggap San-ha dan Hae-jun sebagai abang kandungnya sendiri. Kim San-ha pula kelihatan sempurna dari luaran, namun dia menyimpan rasa bersalah yang mendalam akibat kisah silam keluarganya. Manakala Kang Hae-jun, seorang remaja yang sangat meminati sukan bola keranjang, sentiasa berusaha melakukan yang terbaik demi membalas budi bapa Ju-won yang telah membesarkannya dengan penuh kasih sayang. Namun, takdir membawa mereka ke jalan yang berbeza apabila masing-masing terpaksa berpisah demi mengejar impian serta menyelesaikan konflik keluarga kandung. San-ha berpindah ke Seoul manakala Hae-jun pula berhijrah ke Amerika Syarikat, meninggalkan Ju-won.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea7b34407f72dd9aaf14f2` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea7b38407f72dd9aaf14f3` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea7b3e407f72dd9aaf14f4` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea7b43407f72dd9aaf14f5` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea7b48407f72dd9aaf14f6` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea7b4e407f72dd9aaf14f7` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea7b52407f72dd9aaf14f8` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea7b56407f72dd9aaf14f9` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea7b59407f72dd9aaf14fa` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea7b5d407f72dd9aaf14fb` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea7b60407f72dd9aaf14fc` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6aea7b70407f72dd9aaf14fd` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6aea7b70407f72dd9aaf14fe` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6aea7b75407f72dd9aaf14ff` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6aea7b75407f72dd9aaf1500` }
        ])
    },
    "undercover_high_school_catalog": {
        id: "undercover_high_school",
        catalogId: "undercover_high_school_catalog",
        name: "Undercover High School",
        poster: "https://i.postimg.cc/9QtJ5BbM/Undercover-High-School-DP.webp",
        background: "https://i.postimg.cc/6pLYJhcq/Undercover-High-School-WP.jpg",
        description: "Jung Hae-Seong (diperankan oleh Seo Kang-Joon) ialah seorang ejen lapangan terbaik di Perkhidmatan Perisikan Negara (NIS). Namun, selepas satu insiden besar dan kegagalan dalam satu operasi penting, dia telah diturunkan pangkat dan pasukannya berada dalam bahaya. Untuk menyelamatkan karier serta pasukannya daripada dibubarkan, Hae-Seong terpaksa menerima satu tugasan rahsia yang kedengaran tidak masuk akal: menyamar sebagai pelajar sekolah menengah.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea75e56e979983cdce691b` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea75df6e979983cdce6919` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea75e56e979983cdce691d` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea75e96e979983cdce691e` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea75e56e979983cdce691c` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea75df6e979983cdce691a` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea75eb6e979983cdce691f` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea75df6e979983cdce6918` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea76166e979983cdce6920` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea75da6e979983cdce6917` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea76166e979983cdce6921` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea76176e979983cdce6922` }
        ])
    },
    "crushology_101_catalog": {
        id: "crushology_101",
        catalogId: "crushology_101_catalog",
        name: "Crushology 101",
        poster: "https://i.postimg.cc/GmJqwjKc/Crushology-101-DP.jpg",
        background: "https://i.postimg.cc/L8BNKVD6/Crushology-101-WP.jpg",
        description: "Ban Hee Jin, atau lebih dikenali dengan nama panggilan Bunny (Bani), merupakan seorang pelajar cemerlang di jurusan seni pahat Universitas Yein. Walaupun dia seorang yang sangat sukakan rupa paras yang tampan (seorang visual-lover), Bani pada awalnya percaya bahawa keikhlasan hati adalah perkara paling penting dalam perhubungan. Namun, tanggapan itu memakan diri apabila cinta pertama beliau—seorang lelaki berwajah biasa dengan perangai yang sangat buruk—meninggalkan dirinya dan melakukan kesilapan besar yang memalukan Bani di hadapan seluruh kampus. Hubungan yang gagal itu meninggalkan kesan mendalam dan menyebabkan Bani mengalami masalah kurang keyakinan diri (low self-esteem).",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea75bc6e979983cdce6914` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea75bf6e979983cdce6915` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea75b86e979983cdce6913` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea75b56e979983cdce6912` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea75b26e979983cdce6911` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea75ae6e979983cdce6910` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea75aa6e979983cdce690f` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea75a64e31a4878f8537e2` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea75a34e31a4878f8537e1` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea759f4e31a4878f8537e0` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea759c4e31a4878f8537df` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea75c36e979983cdce6916` }
        ])
    },
    "my_girlfriend_is_a_man_catalog": {
        id: "my_girlfriend_is_a_man",
        catalogId: "my_girlfriend_is_a_man_catalog",
        name: "My Girlfriend Is a Man",
        poster: "https://i.postimg.cc/Mpbd2Y5S/My-Girlfriend-Is-a-Man-DP.jpg",
        background: "https://i.postimg.cc/GmJqwjK3/My-Girlfriend-Is-a-Man-WP.jpg",
        description: "Park Yoon-jae (Yoon San-ha) ialah seorang pelajar universiti yang mengambil jurusan astronomi. Dia bertemu dengan Kim Ji-eun (Arin) melalui janji temu buta (blind date) pertamanya di universiti. Yoon-jae jatuh cinta pandang pertama kepada Ji-eun yang jelita dan berhati mesra, lalu mereka berdua rasmi menjalin hubungan sebagai pasangan kekasih yang bahagia. Namun, kebahagiaan mereka berubah menjadi huru-hara apabila pada suatu hari, seorang lelaki misteri dan tampan muncul di hadapan Yoon-jae dan mendakwa bahawa dia adalah Ji-eun. Rupa-rupanya, akibat genetik unik yang mengalir dalam keluarganya, Ji-eun telah berubah menjadi seorang lelaki dalam masa semalaman.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea6f2acbe10cccb5cd540d` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea6f25cbe10cccb5cd540c` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea6f25cbe10cccb5cd540b` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea6f1fcbe10cccb5cd540a` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea6ef7cbe10cccb5cd5409` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea6ef7cbe10cccb5cd5408` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea6ef2cbe10cccb5cd5407` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea6eedcbe10cccb5cd5406` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea6eedcbe10cccb5cd5405` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea6ee8cbe10cccb5cd5403` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea6ee8cbe10cccb5cd5404` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea6ee3cbe10cccb5cd5402` }
        ])
    },
    "my_youth_catalog": {
        id: "my_youth",
        catalogId: "my_youth_catalog",
        name: "My Youth",
        poster: "https://i.postimg.cc/VkBDQFRx/My-Youth-DP.jpg",
        background: "https://i.postimg.cc/sg9wdJmC/My-Youth-WP.jpg",
        description: "Sun Woo-hae pernah menjadi bintang kanak-kanak yang sangat bersinar, namun populariti tersebut meragut zaman kanaknya dan meninggalkan luka batin yang mendalam. Demi menyembuhkan trauma masa lalu, dia menjauhkan diri daripada dunia glamor dan membina hidup baharu yang serba ringkas. Sementara itu, Sung Je-yeon yang dahulunya hidup senang dalam keluarga kaya, terpaksa berdepan realiti hidup yang perit selepas perniagaan keluarganya muflis. Kini, dia bekerja keras sebagai ketua pasukan yang bercita-cita tinggi di agensi hiburan Feel Entertainment. Demi mencapai kejayaan dan matlamat profesionalnya, Je-yeon perlu menjejaki semula dan membawa Woo-hae kembali ke industri hiburan, sekaligus mengganggu ketenteraman hidup lelaki itu.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea6eb7cbe10cccb5cd5400` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea6eaccbe10cccb5cd53fc` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea6eb7cbe10cccb5cd53ff` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea6eb2cbe10cccb5cd53fe` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea6e7acbe10cccb5cd53f9` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea6eb1cbe10cccb5cd53fd` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea6ebccbe10cccb5cd5401` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea6eaccbe10cccb5cd53fb` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea6e7bcbe10cccb5cd53fa` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea6e75cbe10cccb5cd53f8` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea6e75cbe10cccb5cd53f7` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea6e70cbe10cccb5cd53f6` }
        ])
    },
    "reborn_rookie_catalog": {
        id: "reborn_rookie",
        catalogId: "reborn_rookie_catalog",
        name: "Reborn Rookie",
        poster: "https://i.postimg.cc/7ZMm8NVp/Reborn-Rookie-DP.jpg",
        background: "https://i.postimg.cc/JzcPVQxV/Reborn-Rookie-WP.jpg",
        description: " Kang Yong-ho (lakonan Son Hyun-joo), seorang pengerusi korporat berpengaruh dan genius dari konglomerat gergasi Choiseong Group yang digelar sebagai Dewa Bisnes. Kehidupannya yang sempurna berubah sekelip mata apabila dia terlibat dalam satu kemalangan misteri. Selepas insiden itu, rohnya secara tiba-tiba bertukar ke dalam badan seorang pemain bola sepak muda berusia 20-an bernama Hwang Jun-hyeon (lakonan Lee Jun-young), yang juga merupakan mangsa tabrak lari oleh anak-anak kandung Yong-ho sendiri.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea6e0fcbe10cccb5cd53ec` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea6e0bcbe10cccb5cd53eb` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea6e07cbe10cccb5cd53ea` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea6e04cbe10cccb5cd53e9` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea6e00cbe10cccb5cd53e8` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea6dfdcbe10cccb5cd53e7` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea6df9cbe10cccb5cd53e6` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea6df6cbe10cccb5cd53e5` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea6df2cbe10cccb5cd53e4` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea6defcbe10cccb5cd53e3` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea6deccbe10cccb5cd53e2` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea6de9cbe10cccb5cd53e1` }
        ])
    },
    "love_in_sync_catalog": {
        id: "love_in_sync",
        catalogId: "love_in_sync_catalog",
        name: "Love in Sync",
        poster: "https://i.postimg.cc/dVK4xf2J/Love-in-Sync-DP.jpg",
        background: "https://i.postimg.cc/jSrZF1Hx/Love-in-Sync-WP.jpg",
        description: "Kisah percintaan fantasi yang berlaku apabila seorang wanita yang menolak perasaan empati dan seorang lelaki yang terpaksa menanggung bebanan empati yang terlampau banyak, secara tidak sengaja mula berkongsi emosi serta perasaan antara satu sama lain selepas satu kejadian misteri. Apabila dunia mereka bertembung dan emosi mula bercampur aduk, kedua-duanya mula belajar memahami perasaan baharu dan menyembuhkan luka kisah silam bersama-sama.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea68c96e979983cdce690c` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea68cc6e979983cdce690d` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea68c46e979983cdce690b` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea68c16e979983cdce690a` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea68ba6e979983cdce6908` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea68bd6e979983cdce6909` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea68b66e979983cdce6907` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea68b26e979983cdce6906` }
        ])
    },
    "the_secret_catalog": {
        id: "the_secret",
        catalogId: "the_secret_catalog",
        name: "The Secret",
        poster: "https://i.postimg.cc/dVK4xf2P/The-Secret-DP.jpg",
        background: "https://i.postimg.cc/8zVt0YRN/The-Secret-WP.jpg",
        description: "Penemuan mayat Liya (Ellyza Azizi), seorang pelajar universiti terkemuka yang popular. Pihak berkuasa dan polis mengklasifikasikan kematiannya sebagai kes bunuh diri. Bagaimanapun, Johanna (Siti Saleha), pensyarah kepada Liya, merupakan satu-satunya individu yang berasa curiga dan mengesyaki ada sesuatu yang lebih buruk telah berlaku selepas dia menemui sepucuk surat ugutan di bilik asrama (hostel) Liya.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea668d6c1867154e3fc4c8` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea66916c1867154e3fc4c9` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea66946c1867154e3fc4ca` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea66996c1867154e3fc4cb` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea669d6c1867154e3fc4cc` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea66a16c1867154e3fc4cd` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea66a66c1867154e3fc4ce` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea66aa6c1867154e3fc4cf` }
        ])
    },
    "good_partner_catalog": {
        id: "good_partner",
        catalogId: "good_partner_catalog",
        name: "Good Partner",
        poster: "https://i.postimg.cc/Njwpzn6Y/Good-Partner-DP.jpg",
        background: "https://i.postimg.cc/Gm1q5fFC/Good-Partner-WP.jpg",
        description: "Disebabkan perbezaan nilai hidup dan pengalaman, Eun-kyung dan Yu-ri sering berselisih pendapat dalam hampir semua kes yang dikendalikan. Walau bagaimanapun, sepanjang menyelesaikan pelbagai kes penceraian yang penuh emosi, mereka mula belajar memahami antara satu sama lain, melengkapi kekurangan masing-masing, dan berkembang menjadi rakan kongsi yang terbaik (good partner).",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea7ff3892bec8df4def006` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea7ffe892bec8df4def008` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea7ff8892bec8df4def007` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea7ffe892bec8df4def009` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea802f892bec8df4def00b` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea7ffe892bec8df4def00a` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea8039892bec8df4def00c` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea803a892bec8df4def00f` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea803a892bec8df4def00d` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea803a892bec8df4def00e` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea806b892bec8df4def011` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea8041892bec8df4def010` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6aea8070892bec8df4def012` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6aea8070892bec8df4def013` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6aea8070892bec8df4def014` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6aea8075892bec8df4def015` }
        ])
    },
    "andai_masih_ada_maaf_catalog": {
        id: "andai_masih_ada_maaf",
        catalogId: "andai_masih_ada_maaf_catalog",
        name: "Andai Masih Ada Maaf",
        poster: "https://i.postimg.cc/YCwbsP1J/Andai-Masih-Ada-Maaf.webp",
        background: "https://i.postimg.cc/cLNXbzQj/Andai-Masih-Ada-Maaf-WP.jpg",
        description: "Hana (Hannah Delisha), wanita berkerjaya yang hidup bahagia bersama suaminya yang juga doktor psikologi, Dr. Reza (Fattah Amin), serta anak mereka, Suci. Ketenangan mereka teruji dengan kemunculan Azmeer (Nazrief Nazri), kenalan lama universiti yang menyimpan dendam dan merancang memusnahkan rumah tangga Hana. Melalui manipulasi dan perangkap fitnah termasuk kes tangkap basah rekaan, Reza akhirnya mempercayai Hana berlaku curang lalu menceraikannya. Selepas insiden tersebut tular hingga menyebabkan Hana kehilangan anak, kerjaya, dan maruah akibat kecaman, dia dibantu majikannya Haris dan sahabatnya Mira untuk bangkit membersihkan namanya.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea824d27cd3687399e8ed4` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea825927cd3687399e8ed5` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea825c27cd3687399e8ed6` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea826327cd3687399e8ed7` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea826727cd3687399e8ed8` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea826a27cd3687399e8ed9` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea827027cd3687399e8eda` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea827427cd3687399e8edb` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea827827cd3687399e8edc` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea827b27cd3687399e8edd` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea828027cd3687399e8ede` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea828427cd3687399e8edf` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6aea828e27cd3687399e8ee0` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6aea829327cd3687399e8ee1` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6aea829927cd3687399e8ee2` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6aea829927cd3687399e8ee3` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6aea829f27cd3687399e8ee4` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6aea82cf27cd3687399e8ee5` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6aea82d427cd3687399e8ee6` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6aea82d427cd3687399e8ee7` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6aea82de27cd3687399e8ee8` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6aea82df27cd3687399e8ee9` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6aea82df27cd3687399e8eea` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6aea830b27cd3687399e8eeb` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6aede71d6e979983cdce6968` },
            { title: "Episode 26", url: `${STREAM_HOST}/dl/6aede7216e979983cdce6969` },
            { title: "Episode 27", url: `${STREAM_HOST}/dl/6aee4ffd6e979983cdce696a` },
            { title: "Episode 28", url: `${STREAM_HOST}/dl/6aee50006e979983cdce696b` }
        ])
    },
    "sebenarnya_saya_isteri_dia_catalog": {
        id: "sebenarnya_saya_isteri_dia",
        catalogId: "sebenarnya_saya_isteri_dia_catalog",
        name: "Sebenarnya Saya Isteri Dia",
        poster: "https://i.postimg.cc/RZzXDYcD/Sebenarnya-Saya-Isteri-Dia-DP.jpg",
        background: "https://i.postimg.cc/rwLQPHS3/Sebenarnya-Saya-Isteri-Dia-WP.jpg",
        description: "Syaf pada asalnya merancang untuk berkahwin dengan kekasihnya, Farish. Namun, mereka menjadi mangsa rancangan jahat Raimy dan Rania dalam sebuah majlis hari jadi. Syaf dan adik Farish, iaitu Firash, telah diperangkap dan ditangkap tidur sebilik dalam keadaan mencurigakan. Demi menjaga maruah keluarga, ibu mereka (Datin Farizah) meminta Firash berkahwin dengan Syaf. Walaupun ditentang hebat oleh Firash kerana dia baru berusia 21 tahun dan masih belajar, perkahwinan tetap diteruskan secara rahsia tanpa pengetahuan sesiapa.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea847c27cd3687399e8eec` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea848327cd3687399e8eee` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea848a27cd3687399e8ef0` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea849127cd3687399e8ef2` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea849427cd3687399e8ef3` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea849827cd3687399e8ef4` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea847f27cd3687399e8eed` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea849b27cd3687399e8ef5` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea848727cd3687399e8eef` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea849f27cd3687399e8ef6` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea84a227cd3687399e8ef7` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6aea84c227cd3687399e8ef8` }
        ])
    },
    "jibril_catalog": {
        id: "jibril",
        catalogId: "jibril_catalog",
        name: "Jibril",
        poster: "https://i.postimg.cc/bwj3B5Q5/Jibril-DP.jpg",
        background: "https://i.postimg.cc/bwj3B5QC/Jibril-WP.jpg",
        description: "seorang peguam bela yang sangat genius dan memiliki kebijaksanaan luar biasa serta keupayaan luar biasa dalam melakukan analisis kes. Kehidupan Jibril berubah apabila dia perlu mengendalikan kes pembunuhan berprofil tinggi yang melibatkan seorang CEO syarikat teknologi terkemuka. Siasatan kes ini membawanya ke dalam satu rantaian misteri yang jauh lebih besar daripada sekadar kes jenayah biasa. Jibril terpaksa berhadapan dengan sebuah organisasi rahsia yang licik dan berbahaya yang bergerak di sebalik tabir untuk mencetuskan huru-hara dalam masyarakat. Menggunakan kepintaran logik, undang-undang, dan sains forensik, Jibril cuba merungkai konspirasi hitam ini demi menegakkan keadilan.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea4ce66e979983cdce68cf` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea4e386e979983cdce68d1` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea4cde6e979983cdce68ce` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea4e356e979983cdce68d0` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea4cd76e979983cdce68cd` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea4ccf6e979983cdce68cc` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea4ccb6e979983cdce68cb` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea4cc86e979983cdce68ca` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea4cb76e979983cdce68c9` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea4cb36e979983cdce68c8` }

        ])
    },
    "ganjil_catalog": {
        id: "ganjil",
        catalogId: "ganjil_catalog",
        name: "Ganjil",
        poster: "https://i.postimg.cc/YCwbsP1d/Ganjil-DP.jpg",
        background: "https://i.postimg.cc/3xHncqgf/Ganjil-WP.jpg",
        description: "Amry, seorang jurutera IT yang introspektif, dan Nabila, seorang personaliti media sosial (influencer) yang ceria. Mereka berdua menjalani dua realiti kehidupan berbeza, namun dipertemukan oleh takdir dengan cara yang paling aneh dan luar biasa—iaitu menerusi pertemuan di dalam alam mimpi yang sama.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea4e426e979983cdce68d2` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea4e466e979983cdce68d3` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea4e4a6e979983cdce68d4` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea4e4e6e979983cdce68d5` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea4e526e979983cdce68d6` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea4e566e979983cdce68d7` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea4e5a6e979983cdce68d8` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea4e5e6e979983cdce68d9` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea4e626e979983cdce68da` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea4e666e979983cdce68db` }
        ])
    },
    "hilang_catalog": {
        id: "hilang",
        catalogId: "hilang_catalog",
        name: "Hilang",
        poster: "https://i.postimg.cc/6pNYmPdH/Hilang-DP.jpg",
        background: "https://i.postimg.cc/DwKBMNqB/Hilang-WP.jpg",
        description: "Mengisahkan tentang Inspektor Munir (Khir Rahman), seorang pegawai polis yang terpaksa kembali ke kampung halamannya di sebuah bandar fiksyen bernama Seri Daik selepas 17 tahun. Kepulangannya adalah untuk menyiasat kes pembunuhan kejam seorang remaja perempuan yang tidak mempunyai dokumen identiti. Siasatan tersebut mempertemukan semula Munir dengan Yusof (Aqasha), seorang guru agama / ustaz yang juga rakan zaman kanak-kanaknya. Munir menyimpan dendam lama dan menuduh Yusof sebagai punca kematian adiknya akibat satu upacara rawatan mistik yang gagal pada masa lalu.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea5d7f6e979983cdce68ef` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea5d7a6e979983cdce68ee` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea5d766e979983cdce68ed` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea5d716e979983cdce68ec` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea5d6c6e979983cdce68eb` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea5d676e979983cdce68ea` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea5d606e979983cdce68e9` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea5d5c6e979983cdce68e8` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea5d596e979983cdce68e7` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea5d556e979983cdce68e6` }
        ])
    },
    "nenek_bongkok_tiga_catalog": {
        id: "nenek_bongkok_tiga",
        catalogId: "nenek_bongkok_tiga_catalog",
        name: "Nenek Bongkok Tiga",
        poster: "https://i.postimg.cc/4xTBS0zP/Nenek-Bongkok-Tiga-DP.jpg",
        background: "https://i.postimg.cc/bwj3B5Q9/Nenek-Bongkok-Tiga-WP.jpg",
        description: " Mereka bukan sekadar terperangkap di dalam rumah dan hutan tersebut, malah menyedari bahawa mereka berada dalam satu dimensi asing yang aneh. Untuk keluar dan kembali ke dunia asal, kelapan-lapan tebusan dipaksa bersaing dan menyelesaikan siri permainan tradisional Melayu. Permainan ini semakin bahaya dan memaksa mereka untuk saling mengkhianati antara satu sama lain demi kelangsungan hidup",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea60a26e979983cdce68f0` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea60af6e979983cdce68f1` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea60b66e979983cdce68f2` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6ae6aaf56e979983cdce67cd` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6ae6aaed6e979983cdce67ca` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6ae6aaed6e979983cdce67cc` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea60d96e979983cdce68f3` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea60e16e979983cdce68f4` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6ae6aaed6e979983cdce67c9` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6ae6aaed6e979983cdce67cb` }
        ])
    },
    "jendela_hati_catalog": {
        id: "jendela_hati",
        catalogId: "jendela_hati_catalog",
        name: "Jendela Hati",
        poster: "https://i.postimg.cc/t4H2Mchz/Jendela-Hati-DP.jpg",
        background: "https://i.postimg.cc/RZzXDYcQ/Jendela-Hati-WP.jpg",
        description: "Farah (kembar seiras kepada arwah Sarah) yang terpaksa berkahwin dengan abang iparnya, Lukman, demi memenuhi wasiat terakhir Sarah dan menjaga anak mereka, Zahin. Perkahwinan secara ganti tikar ini membawa konflik mendalam kerana Lukman masih hanyut dalam kenangan isterinya dan gagal menerima Farah sepenuhnya, manakala Farah pula berdepan dilema perasaan yang turut diuji oleh ego serta kemunculan pihak ketiga. Sinopsis rasmi penuh drama ini boleh didapati di sumber rujukan.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea61fa6e979983cdce68f5` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea61ff6e979983cdce68f6` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea62046e979983cdce68f7` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea62076e979983cdce68f8` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea620e6e979983cdce68f9` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea62136e979983cdce68fa` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea621a6e979983cdce68fb` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea621d6e979983cdce68fc` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea62216e979983cdce68fd` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea62256e979983cdce68fe` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6aea62286e979983cdce68ff` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6aea622b6e979983cdce6900` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6aea622f6e979983cdce6901` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6aea62326e979983cdce6902` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6aea62356e979983cdce6903` }

        ])
    },
    "seribu_nina_catalog": {
        id: "seribu_nina",
        catalogId: "seribu_nina_catalog",
        name: "Seribu Nina",
        poster: "https://i.postimg.cc/sgRwNLpp/Seribu-Nina-DP.jpg",
        background: "https://i.postimg.cc/htqp5Y9L/Seribu-Nina-WP.jpg",
        description: "Mengisahkan tentang pasangan yang mempunyai personaliti yang sangat berbeza. Amar merupakan seorang pensyarah muda bidang sejarah yang hidupnya penuh rutin, teliti, dan skema. Manakala teman wanitanya, Nina, bekerja sebagai seorang barista kafe tempatan yang berjiwa bebas, kasual, dan bersikap spontan. Demi menyelamatkan cinta hatinya, Amar terpaksa memulakan satu pengembaraan epik dan berbahaya merentas seribu dimensi alam semesta paralel. Di setiap alam alternatif yang dilalui, Amar bertemu dengan pelbagai versi Nina yang berbeza watak—ada yang gila, ada yang menjadi pembunuh, dan ada juga yang kelihatan jauh lebih sempurna daripada Nina yang asal.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea4fa76e979983cdce68dc` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea4fab6e979983cdce68dd` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea4faf6e979983cdce68de` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea4fb36e979983cdce68df` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea4fb76e979983cdce68e0` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea4fbc6e979983cdce68e1` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea4fbf6e979983cdce68e2` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea4fc36e979983cdce68e3` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6aea4fc76e979983cdce68e4` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6aea4fca6e979983cdce68e5` }
        ])
    },
    "terlanjur_cinta_catalog": {
        id: "terlanjur_cinta",
        catalogId: "terlanjur_cinta_catalog",
        name: "Terlanjur Cinta",
        poster: "https://i.postimg.cc/GhDXzRsM/Terlanjur-Cinta-DP.jpg",
        background: "https://i.postimg.cc/CL8cJ0fr/Terlanjur-Cinta-WP.jpg",
        description: "Aishah (lakonan Puteri Balqis) terpaksa melupakan perasaan cintanya terhadap kawan baiknya sejak kecil iaitu Amir (lakonan Syafiq Kyle). Dia menerima lamaran seorang duda yang jauh lebih berusia iaitu Pak Majid (lakonan Khir Rahman). Perkahwinan itu dilakukan demi menyelamatkan abangnya, Salleh (lakonan Syafie Naswip) yang merupakan seorang penagih dadah daripada terus dihukum penjara, serta mengikis belenggu kemiskinan keluarga mereka.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6ae6a0feb83c8d1c75dd6afd` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6ae6a0feb83c8d1c75dd6afc` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6ae6a0d2b83c8d1c75dd6afa` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea63a76e979983cdce6905` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6ae6a0cdb83c8d1c75dd6af9` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6ae6a0cdb83c8d1c75dd6af8` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea63716e979983cdce6904` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6ae6a0c8b83c8d1c75dd6af6` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6ae6a0c2b83c8d1c75dd6af4` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6ae6a091b83c8d1c75dd6af2` }
        ])
    },
    "budak_magik_catalog": {
        id: "budak_magik",
        catalogId: "budak_magik_catalog",
        name: "Budak Magik",
        poster: "https://i.postimg.cc/Dwrjr5Cv/Budak-Magik-DP.webp",
        background: "https://i.postimg.cc/bwcVS4R2/Budak-Magik-WP.jpg",
        description: "Cerita ini mengisahkan empat orang remaja sekolah—Imran, Myra, Haikal, and Zarra—yang mendapat kuasa luar biasa selepas terkena titisan hujan pelik. Pada mulanya, mereka menyangka kuasa tersebut ialah unsur paranormal yang menakutkan. Namun, mereka akhirnya belajar mengawal kelebihan itu untuk tujuan kebaikan sambil melalui pelbagai cabaran dan pengembaraan.",
        episodes: createEpisodes([
        ])
    },
    "otw_halal_catalog": {
        id: "otw_halal",
        catalogId: "otw_halal_catalog",
        name: "OTW Halal",
        poster: "https://i.postimg.cc/X75sxWyL/OTW-Halal-DP.webp",
        background: "https://i.postimg.cc/HsM63m73/OTW-Halal-WP.jpg",
        description: "Renatta, seorang wanita pendamping (LC) di kota Jakarta yang hidup mewah namun tidak bijak menguruskan kewangan. Apabila kelab malam ditutup sepanjang bulan Ramadan dan kekasih rahsianya (sugar daddy) memutuskan hubungan, Renatta berdepan krisis kewangan yang teruk. Demi kelangsungan hidup dan mendapatkan diskaun sewa bilik, dia terpaksa berpindah ke sebuah rumah tumpangan wanita muslimah yang dikendalikan oleh Bu Fatimah dengan menyamar sebagai wanita alim dan memakai hijab. Di sana, dia bertemu dengan Rafi, seorang ustaz muda yang memimpin kelas pengajian Ramadan. Hubungan cinta mula mekar di antara dua dunia yang sangat berbeza ini, sementara Renatta bergelut untuk menyembunyikan masa lalu kelamnya yang boleh terbongkar pada bila-bila masa.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea6e6bcbe10cccb5cd53f4` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea6e6bcbe10cccb5cd53f3` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea6e35cbe10cccb5cd53f2` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea6e35cbe10cccb5cd53f1` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea6e34cbe10cccb5cd53f0` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea6e2fcbe10cccb5cd53ef` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea6e2fcbe10cccb5cd53ee` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea6e2acbe10cccb5cd53ed` }
        ])
    },
    "nafsu_catalog": {
        id: "nafsu",
        catalogId: "nafsu_catalog",
        name: "Nafsu",
        poster: "https://i.postimg.cc/5NzspJF7/Nafsu-DP.png",
        background: "https://i.postimg.cc/GhDXzRsq/Nafsu-WP.jpg",
        description: "Sam (Kamal Adli) menyamar sebagai bomoh penipu bersama rakan sekutunya, Suria (Nia Atasha), demi memanfaatkan golongan elit yang mempercayai ilmu hitam. Walaupun mempunyai deria keenam yang dianggap sumpahan dari masa lalu, Sam terpaksa menggunakan semula keupayaan itu apabila bekas kekasihnya, Dina (Azira Shafinaz), meminta pertolongan untuk mencari adiknya, Alia (Khayrisyah Kemal), yang hilang secara misteri. Pencarian tersebut mendedahkan rangkaian ajaran sesat golongan elit yang dipimpin oleh Gusti (Aqasha) yang kejam dan berkarisma, mengheret Sam, Dina, dan Suria ke dalam kancah misteri yang mengancam nyawa.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6aea65846c1867154e3fc4c0` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6aea65886c1867154e3fc4c1` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6aea658c6c1867154e3fc4c2` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6aea658f6c1867154e3fc4c3` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6aea65936c1867154e3fc4c4` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6aea65976c1867154e3fc4c5` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6aea659a6c1867154e3fc4c6` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6aea659f6c1867154e3fc4c7` }
        ])
    },
    "pentaksub_catalog": {
        id: "pentaksub",
        catalogId: "pentaksub_catalog",
        name: "Jiwa Seorang Pentaksub",
        poster: "https://i.postimg.cc/65f6q9Jm/Jiwa-Seorang-Pentaksub-DP.webp",
        background: "https://i.postimg.cc/RVLChM5Y/Jiwa-Seorang-Pentaksub-WP.jpg",
        description: "Ambisi Firzan merosakkan rumah tangganya sendiri sehingga menyebabkan kematian tragis Anis. Dia kemudian mengejutkan keluarganya apabila memikat dan mengahwini Diana (Sophia Albarakbah), seorang pempengaruh media sosial yang juga merupakan bekas teman wanita anaknya sendiri, Aiman.",
        episodes: createEpisodes([
            { title: "Jiwa Seorang Pentaksub - Episode 1", url: `${STREAM_HOST}/dl/6ae743a86e979983cdce681f` },
            { title: "Jiwa Seorang Pentaksub - Episode 2", url: `${STREAM_HOST}/dl/6ae743a46e979983cdce681e` },
            { title: "Jiwa Seorang Pentaksub - Episode 3", url: `${STREAM_HOST}/dl/6ae743a06e979983cdce681d` },
            { title: "Jiwa Seorang Pentaksub - Episode 4", url: `${STREAM_HOST}/dl/6ae7439d6e979983cdce681c` },
            { title: "Jiwa Seorang Pentaksub - Episode 5", url: `${STREAM_HOST}/dl/6ae743986e979983cdce681b` },
            { title: "Jiwa Seorang Pentaksub - Episode 6", url: `${STREAM_HOST}/dl/6ae743956e979983cdce681a` },
            { title: "Jiwa Seorang Pentaksub - Episode 7", url: `${STREAM_HOST}/dl/6ae743926e979983cdce6819` },
            { title: "Jiwa Seorang Pentaksub - Episode 8", url: `${STREAM_HOST}/dl/6ae7438f6e979983cdce6818` },
            { title: "Jiwa Seorang Pentaksub - Episode 9", url: `${STREAM_HOST}/dl/6ae7438c6e979983cdce6817` },
            { title: "Jiwa Seorang Pentaksub - Episode 10", url: `${STREAM_HOST}/dl/6ae743866e979983cdce6816` },
            { title: "Jiwa Seorang Pentaksub - Episode 11", url: `${STREAM_HOST}/dl/6ae743836e979983cdce6815` },
            { title: "Jiwa Seorang Pentaksub - Episode 12", url: `${STREAM_HOST}/dl/6ae743806e979983cdce6814` },
            { title: "Jiwa Seorang Pentaksub - Episode 13", url: `${STREAM_HOST}/dl/6ae7437d6e979983cdce6813` },
            { title: "Jiwa Seorang Pentaksub - Episode 14", url: `${STREAM_HOST}/dl/6ae743796e979983cdce6812` },
            { title: "Jiwa Seorang Pentaksub - Episode 15", url: `${STREAM_HOST}/dl/6ae743756e979983cdce6811` },
            { title: "Jiwa Seorang Pentaksub - Episode 16", url: `${STREAM_HOST}/dl/6ae743726e979983cdce6810` },
            { title: "Jiwa Seorang Pentaksub - Episode 17", url: `${STREAM_HOST}/dl/6ae7436e6e979983cdce680f` },
            { title: "Jiwa Seorang Pentaksub - Episode 18", url: `${STREAM_HOST}/dl/6ae7436a6e979983cdce680e` },
            { title: "Jiwa Seorang Pentaksub - Episode 19", url: `${STREAM_HOST}/dl/6ae743666e979983cdce680d` },
            { title: "Jiwa Seorang Pentaksub - Episode 20", url: `${STREAM_HOST}/dl/6ae743626e979983cdce680c` },
            { title: "Jiwa Seorang Pentaksub - Episode 21", url: `${STREAM_HOST}/dl/6ae7435e6e979983cdce680b` },
            { title: "Jiwa Seorang Pentaksub - Episode 22", url: `${STREAM_HOST}/dl/6ae7435b6e979983cdce680a` },
            { title: "Jiwa Seorang Pentaksub - Episode 23", url: `${STREAM_HOST}/dl/6ae743566e979983cdce6809` },
            { title: "Jiwa Seorang Pentaksub - Episode 24", url: `${STREAM_HOST}/dl/6ae743516e979983cdce6808` },
            { title: "Jiwa Seorang Pentaksub - Episode 25", url: `${STREAM_HOST}/dl/6ae7434d6e979983cdce6807` }
        ])
    },
    "stairway_to_heaven_catalog": {
        id: "stairway_to_heaven",
        catalogId: "stairway_to_heaven_catalog",
        name: "Stairway To Heaven",
        poster: "https://i.postimg.cc/kXvMGn3j/Stairway-To-Heaven-DP.webp",
        background: "https://i.postimg.cc/gkHcjYFt/Stairway-To-Heaven-WP.jpg",
        description: "Mengisahkan tentang cinta sejati antara Han Jung-suh dan Cha Song-joo yang teruji oleh pelbagai rintangan, termasuk penderaan keluarga tiri, kemalangan yang menyebabkan amnesia, serta penyakit kanser yang meragut nyawa. Hubungan mereka turut diuji dengan pengorbanan tragis oleh abang tiri Jung-suh, Tae-hwa, yang mendermakan korneanya sebelum kesudahan yang menyayat hati.",
        episodes: createEpisodes([
            { title: "Stairway to Heaven - Episode 1", url: `${STREAM_HOST}/dl/6ae754846e979983cdce6825` },
            { title: "Stairway to Heaven - Episode 2", url: `${STREAM_HOST}/dl/6ae7548b6e979983cdce6827` },
            { title: "Stairway to Heaven - Episode 3", url: `${STREAM_HOST}/dl/6ae754b36e979983cdce6832` },
            { title: "Stairway to Heaven - Episode 4", url: `${STREAM_HOST}/dl/6ae754a16e979983cdce682d` },
            { title: "Stairway to Heaven - Episode 5", url: `${STREAM_HOST}/dl/6ae754c56e979983cdce6836` },
            { title: "Stairway to Heaven - Episode 6", url: `${STREAM_HOST}/dl/6ae7549e6e979983cdce682c` },
            { title: "Stairway to Heaven - Episode 7", url: `${STREAM_HOST}/dl/6ae754976e979983cdce682a` },
            { title: "Stairway to Heaven - Episode 8", url: `${STREAM_HOST}/dl/6ae754c06e979983cdce6834` },
            { title: "Stairway to Heaven - Episode 9", url: `${STREAM_HOST}/dl/6ae754c06e979983cdce6835` },
            { title: "Stairway to Heaven - Episode 10", url: `${STREAM_HOST}/dl/6ae754b06e979983cdce6831` },
            { title: "Stairway to Heaven - Episode 11", url: `${STREAM_HOST}/dl/6ae754886e979983cdce6826` },
            { title: "Stairway to Heaven - Episode 12", url: `${STREAM_HOST}/dl/6ae754ac6e979983cdce6830` },
            { title: "Stairway to Heaven - Episode 13", url: `${STREAM_HOST}/dl/6ae754a56e979983cdce682e` },
            { title: "Stairway to Heaven - Episode 14", url: `${STREAM_HOST}/dl/6ae754806e979983cdce6824` },
            { title: "Stairway to Heaven - Episode 15", url: `${STREAM_HOST}/dl/6ae7548f6e979983cdce6828` },
            { title: "Stairway to Heaven - Episode 16", url: `${STREAM_HOST}/dl/6ae754926e979983cdce6829` },
            { title: "Stairway to Heaven - Episode 17", url: `${STREAM_HOST}/dl/6ae754b66e979983cdce6833` },
            { title: "Stairway to Heaven - Episode 18", url: `${STREAM_HOST}/dl/6ae7549a6e979983cdce682b` },
            { title: "Stairway to Heaven - Episode 19", url: `${STREAM_HOST}/dl/6ae755716e979983cdce6837` },
            { title: "Stairway to Heaven - Episode 20", url: `${STREAM_HOST}/dl/6ae754a96e979983cdce682f` }
        ])
    },
    "black_clover_s1_catalog": {
        id: "black_clover_s1",
        catalogId: "black_clover_s1_catalog",
        name: "Black Clover - Season 1",
      poster: "https://i.postimg.cc/xTSkCfqr/Black-Clover-1-DP.jpg",
        background: "https://i.postimg.cc/kXdV4JDd/Black-Clover-1-WP.jpg",
        description: "Dunia hampir dimusnahkan oleh syaitan, namun telah diselamatkan oleh seorang penyihir yang dikenali sebagai Maharaja Sihir (Wizard King). Bertahun-tahun kemudian, dua bayi anak yatim piatu, Asta dan Yuno, ditinggalkan di sebuah gereja di kawasan pinggiran Kerajaan Clover. Di dunia di mana sihir adalah segala-galanya, Yuno membesar sebagai seorang yang sangat berbakat dan mempunyai kuasa sihir luar biasa, manakala Asta lahir tanpa sebarang kuasa sihir langsung. Walaupun begitu, kedua-duanya berjanji untuk bersaing bagi mencapai impian yang sama, iaitu menjadi Maharaja Sihir yang seterusnya.",
        episodes: createEpisodes([
            { title: "Black Clover - Episode 1", url: `${STREAM_HOST}/dl/6aef416c6e979983cdce6a10` },
            { title: "Black Clover - Episode 2", url: `${STREAM_HOST}/dl/6aef41436e979983cdce6a0f` },
            { title: "Black Clover - Episode 3", url: `${STREAM_HOST}/dl/6aef4d7b7e2062e6659dc938` },
            { title: "Black Clover - Episode 4", url: `${STREAM_HOST}/dl/6aef41416e979983cdce6a0e` },
            { title: "Black Clover - Episode 5", url: `${STREAM_HOST}/dl/6aef41406e979983cdce6a0d` },
            { title: "Black Clover - Episode 6", url: `${STREAM_HOST}/dl/6aef4d917e2062e6659dc939` },
            { title: "Black Clover - Episode 7", url: `${STREAM_HOST}/dl/6aef413b6e979983cdce6a0c` },
            { title: "Black Clover - Episode 8", url: `${STREAM_HOST}/dl/6aef41356e979983cdce6a0a` },
            { title: "Black Clover - Episode 9", url: `${STREAM_HOST}/dl/6aef41356e979983cdce6a09` },
            { title: "Black Clover - Episode 10", url: `${STREAM_HOST}/dl/6aef41356e979983cdce6a0b` },
            { title: "Black Clover - Episode 11", url: `${STREAM_HOST}/dl/6aef41356e979983cdce6a08` },
            { title: "Black Clover - Episode 12", url: `${STREAM_HOST}/dl/6aef412c6e979983cdce6a07` },
            { title: "Black Clover - Episode 13", url: `${STREAM_HOST}/dl/6aef412c6e979983cdce6a06` },
            { title: "Black Clover - Episode 14", url: `${STREAM_HOST}/dl/6aef412c6e979983cdce6a05` },
            { title: "Black Clover - Episode 15", url: `${STREAM_HOST}/dl/6aef412c6e979983cdce6a04` },
            { title: "Black Clover - Episode 16", url: `${STREAM_HOST}/dl/6aef412c6e979983cdce6a02` },
            { title: "Black Clover - Episode 17", url: `${STREAM_HOST}/dl/6aef412c6e979983cdce6a03` },
            { title: "Black Clover - Episode 18", url: `${STREAM_HOST}/dl/6aef38516e979983cdce6a01` },
            { title: "Black Clover - Episode 19", url: `${STREAM_HOST}/dl/6aef38506e979983cdce6a00` },
            { title: "Black Clover - Episode 20", url: `${STREAM_HOST}/dl/6aef384b6e979983cdce69ff` },
            { title: "Black Clover - Episode 21", url: `${STREAM_HOST}/dl/6aef384b6e979983cdce69fe` },
            { title: "Black Clover - Episode 22", url: `${STREAM_HOST}/dl/6aef38456e979983cdce69fb` },
            { title: "Black Clover - Episode 23", url: `${STREAM_HOST}/dl/6aef38456e979983cdce69fd` },
            { title: "Black Clover - Episode 24", url: `${STREAM_HOST}/dl/6aef38456e979983cdce69fc` },
            { title: "Black Clover - Episode 25", url: `${STREAM_HOST}/dl/6aef381a6e979983cdce69fa` },
            { title: "Black Clover - Episode 26", url: `${STREAM_HOST}/dl/6aef38196e979983cdce69f9` },
            { title: "Black Clover - Episode 27", url: `${STREAM_HOST}/dl/6aef38136e979983cdce69f8` },
            { title: "Black Clover - Episode 28", url: `${STREAM_HOST}/dl/6aef380e6e979983cdce69f7` },
            { title: "Black Clover - Episode 29", url: `${STREAM_HOST}/dl/6aef380e6e979983cdce69f6` },
            { title: "Black Clover - Episode 30", url: `${STREAM_HOST}/dl/6aef380e6e979983cdce69f5` },
            { title: "Black Clover - Episode 31", url: `${STREAM_HOST}/dl/6aef380e6e979983cdce69f3` },
            { title: "Black Clover - Episode 32", url: `${STREAM_HOST}/dl/6aef380e6e979983cdce69f4` },
            { title: "Black Clover - Episode 33", url: `${STREAM_HOST}/dl/6aef38086e979983cdce69f2` },
            { title: "Black Clover - Episode 34", url: `${STREAM_HOST}/dl/6aef37dc6e979983cdce69f1` },
            { title: "Black Clover - Episode 35", url: `${STREAM_HOST}/dl/6aef37dc6e979983cdce69f0` },
            { title: "Black Clover - Episode 36", url: `${STREAM_HOST}/dl/6aef37dc6e979983cdce69ef` },
            { title: "Black Clover - Episode 37", url: `${STREAM_HOST}/dl/6aef37d76e979983cdce69ed` },
            { title: "Black Clover - Episode 38", url: `${STREAM_HOST}/dl/6aef44d07e2062e6659dc924` },
            { title: "Black Clover - Episode 39", url: `${STREAM_HOST}/dl/6aef37d76e979983cdce69ee` },
            { title: "Black Clover - Episode 40", url: `${STREAM_HOST}/dl/6aef37d26e979983cdce69eb` },
            { title: "Black Clover - Episode 41", url: `${STREAM_HOST}/dl/6aef37d26e979983cdce69ec` },
            { title: "Black Clover - Episode 42", url: `${STREAM_HOST}/dl/6aef37d26e979983cdce69ea` },
            { title: "Black Clover - Episode 43", url: `${STREAM_HOST}/dl/6aef37d26e979983cdce69e9` },
            { title: "Black Clover - Episode 44", url: `${STREAM_HOST}/dl/6aef37c96e979983cdce69e4` },
            { title: "Black Clover - Episode 45", url: `${STREAM_HOST}/dl/6aef37c96e979983cdce69e6` },
            { title: "Black Clover - Episode 46", url: `${STREAM_HOST}/dl/6aef37c96e979983cdce69e3` },
            { title: "Black Clover - Episode 47", url: `${STREAM_HOST}/dl/6aef37c96e979983cdce69e7` },
            { title: "Black Clover - Episode 48", url: `${STREAM_HOST}/dl/6aef37c96e979983cdce69e5` },
            { title: "Black Clover - Episode 49", url: `${STREAM_HOST}/dl/6aef37c96e979983cdce69e8` },
            { title: "Black Clover - Episode 50", url: `${STREAM_HOST}/dl/6aef33536e979983cdce69e2` },
            { title: "Black Clover - Episode 51", url: `${STREAM_HOST}/dl/6aef33536e979983cdce69e1` },
            { title: "Black Clover - Episode 52", url: `${STREAM_HOST}/dl/6aef33276e979983cdce69e0` },
            { title: "Black Clover - Episode 53", url: `${STREAM_HOST}/dl/6aef33266e979983cdce69df` },
            { title: "Black Clover - Episode 54", url: `${STREAM_HOST}/dl/6aef33266e979983cdce69de` },
            { title: "Black Clover - Episode 55", url: `${STREAM_HOST}/dl/6aef33216e979983cdce69dd` },
            { title: "Black Clover - Episode 56", url: `${STREAM_HOST}/dl/6aef33206e979983cdce69dc` },
            { title: "Black Clover - Episode 57", url: `${STREAM_HOST}/dl/6aef331c6e979983cdce69db` },
            { title: "Black Clover - Episode 58", url: `${STREAM_HOST}/dl/6aef331b6e979983cdce69da` },
            { title: "Black Clover - Episode 59", url: `${STREAM_HOST}/dl/6aef331b6e979983cdce69d9` },
            { title: "Black Clover - Episode 60", url: `${STREAM_HOST}/dl/6aef33186e979983cdce69d8` },
            { title: "Black Clover - Episode 61", url: `${STREAM_HOST}/dl/6aef33176e979983cdce69d7` },
            { title: "Black Clover - Episode 62", url: `${STREAM_HOST}/dl/6aef32e66e979983cdce69d6` },
            { title: "Black Clover - Episode 63", url: `${STREAM_HOST}/dl/6aef32e66e979983cdce69d4` },
            { title: "Black Clover - Episode 64", url: `${STREAM_HOST}/dl/6aef32e66e979983cdce69d5` },
            { title: "Black Clover - Episode 65", url: `${STREAM_HOST}/dl/6aef32e16e979983cdce69d3` },
            { title: "Black Clover - Episode 66", url: `${STREAM_HOST}/dl/6aef32e06e979983cdce69d2` },
            { title: "Black Clover - Episode 67", url: `${STREAM_HOST}/dl/6aef32dd6e979983cdce69d0` },
            { title: "Black Clover - Episode 68", url: `${STREAM_HOST}/dl/6aef32dd6e979983cdce69d1` },
            { title: "Black Clover - Episode 69", url: `${STREAM_HOST}/dl/6aef32dd6e979983cdce69cf` },
            { title: "Black Clover - Episode 70", url: `${STREAM_HOST}/dl/6aef329f6e979983cdce69c6` },
            { title: "Black Clover - Episode 71", url: `${STREAM_HOST}/dl/6aef329f6e979983cdce69c5` },
            { title: "Black Clover - Episode 72", url: `${STREAM_HOST}/dl/6aef329f6e979983cdce69c7` },
            { title: "Black Clover - Episode 73", url: `${STREAM_HOST}/dl/6aef32a56e979983cdce69c8` },
            { title: "Black Clover - Episode 74", url: `${STREAM_HOST}/dl/6aef32aa6e979983cdce69c9` },
            { title: "Black Clover - Episode 75", url: `${STREAM_HOST}/dl/6aef32aa6e979983cdce69ca` },
            { title: "Black Clover - Episode 76", url: `${STREAM_HOST}/dl/6aef32ab6e979983cdce69cb` },
            { title: "Black Clover - Episode 77", url: `${STREAM_HOST}/dl/6aef32ab6e979983cdce69cc` },
            { title: "Black Clover - Episode 78", url: `${STREAM_HOST}/dl/6aef32ab6e979983cdce69cd` },
            { title: "Black Clover - Episode 79", url: `${STREAM_HOST}/dl/6aef32db6e979983cdce69ce` },
            { title: "Black Clover - Episode 80", url: `${STREAM_HOST}/dl/6aef329f6e979983cdce69c4` },
            { title: "Black Clover - Episode 81", url: `${STREAM_HOST}/dl/6aef32966e979983cdce69c2` },
            { title: "Black Clover - Episode 82", url: `${STREAM_HOST}/dl/6aef32966e979983cdce69c1` },
            { title: "Black Clover - Episode 83", url: `${STREAM_HOST}/dl/6aef32966e979983cdce69bf` },
            { title: "Black Clover - Episode 84", url: `${STREAM_HOST}/dl/6aef32966e979983cdce69c0` },
            { title: "Black Clover - Episode 85", url: `${STREAM_HOST}/dl/6aef32966e979983cdce69be` },
            { title: "Black Clover - Episode 86", url: `${STREAM_HOST}/dl/6aef32966e979983cdce69c3` },
            { title: "Black Clover - Episode 87", url: `${STREAM_HOST}/dl/6aef2ca66e979983cdce69bd` },
            { title: "Black Clover - Episode 88", url: `${STREAM_HOST}/dl/6aef2ca16e979983cdce69bc` },
            { title: "Black Clover - Episode 89", url: `${STREAM_HOST}/dl/6aef2ca16e979983cdce69bb` },
            { title: "Black Clover - Episode 90", url: `${STREAM_HOST}/dl/6aef2c9c6e979983cdce69ba` },
            { title: "Black Clover - Episode 91", url: `${STREAM_HOST}/dl/6aef2c9c6e979983cdce69b9` },
            { title: "Black Clover - Episode 92", url: `${STREAM_HOST}/dl/6aef2c9c6e979983cdce69b7` },
            { title: "Black Clover - Episode 93", url: `${STREAM_HOST}/dl/6aef2c9c6e979983cdce69b8` },
            { title: "Black Clover - Episode 94", url: `${STREAM_HOST}/dl/6aef2c936e979983cdce69b3` },
            { title: "Black Clover - Episode 95", url: `${STREAM_HOST}/dl/6aef2c936e979983cdce69b4` },
            { title: "Black Clover - Episode 96", url: `${STREAM_HOST}/dl/6aef2c936e979983cdce69b6` },
            { title: "Black Clover - Episode 97", url: `${STREAM_HOST}/dl/6aef2c936e979983cdce69b2` },
            { title: "Black Clover - Episode 98", url: `${STREAM_HOST}/dl/6aef2c936e979983cdce69b1` },
            { title: "Black Clover - Episode 99", url: `${STREAM_HOST}/dl/6aef2c936e979983cdce69b5` },
            { title: "Black Clover - Episode 100", url: `${STREAM_HOST}/dl/6aef2acf6e979983cdce69b0` },
            { title: "Black Clover - Episode 101", url: `${STREAM_HOST}/dl/6aef2ace6e979983cdce69af` },
            { title: "Black Clover - Episode 102", url: `${STREAM_HOST}/dl/6aef2ace6e979983cdce69ae` },
            { title: "Black Clover - Episode 103", url: `${STREAM_HOST}/dl/6aef2ac96e979983cdce69ad` },
            { title: "Black Clover - Episode 104", url: `${STREAM_HOST}/dl/6aef2ac46e979983cdce69ac` },
            { title: "Black Clover - Episode 105", url: `${STREAM_HOST}/dl/6aef2ac46e979983cdce69ab` },
            { title: "Black Clover - Episode 106", url: `${STREAM_HOST}/dl/6aef2ac46e979983cdce69aa` },
            { title: "Black Clover - Episode 107", url: `${STREAM_HOST}/dl/6aef2abe6e979983cdce69a9` },
            { title: "Black Clover - Episode 108", url: `${STREAM_HOST}/dl/6aef2abb6e979983cdce69a3` },
            { title: "Black Clover - Episode 109", url: `${STREAM_HOST}/dl/6aef2abb6e979983cdce69a6` },
            { title: "Black Clover - Episode 110", url: `${STREAM_HOST}/dl/6aef2abb6e979983cdce69a5` },
            { title: "Black Clover - Episode 111", url: `${STREAM_HOST}/dl/6aef2abb6e979983cdce69a8` },
            { title: "Black Clover - Episode 112", url: `${STREAM_HOST}/dl/6aef2abb6e979983cdce69a7` },
            { title: "Black Clover - Episode 113", url: `${STREAM_HOST}/dl/6aef2abb6e979983cdce69a4` },
            { title: "Black Clover - Episode 114", url: `${STREAM_HOST}/dl/6aef29e76e979983cdce69a2` },
            { title: "Black Clover - Episode 115", url: `${STREAM_HOST}/dl/6aef29e46e979983cdce69a1` },
            { title: "Black Clover - Episode 116", url: `${STREAM_HOST}/dl/6aef29df6e979983cdce69a0` },
            { title: "Black Clover - Episode 117", url: `${STREAM_HOST}/dl/6aeef21f6e979983cdce699e` },
            { title: "Black Clover - Episode 118", url: `${STREAM_HOST}/dl/6aeef2176e979983cdce699a` },
            { title: "Black Clover - Episode 119", url: `${STREAM_HOST}/dl/6aeef2176e979983cdce6998` },
            { title: "Black Clover - Episode 120", url: `${STREAM_HOST}/dl/6aeef21f6e979983cdce699d` },
            { title: "Black Clover - Episode 121", url: `${STREAM_HOST}/dl/6aeef21f6e979983cdce699c` },
            { title: "Black Clover - Episode 122", url: `${STREAM_HOST}/dl/6aeeed4c6e979983cdce6986` },
            { title: "Black Clover - Episode 123", url: `${STREAM_HOST}/dl/6aeef2176e979983cdce6999` },
            { title: "Black Clover - Episode 124", url: `${STREAM_HOST}/dl/6aeeeeda6e979983cdce698b` },
            { title: "Black Clover - Episode 125", url: `${STREAM_HOST}/dl/6aeef2176e979983cdce6997` },
            { title: "Black Clover - Episode 126", url: `${STREAM_HOST}/dl/6aeef2176e979983cdce6996` },
            { title: "Black Clover - Episode 127", url: `${STREAM_HOST}/dl/6aeef2186e979983cdce699b` },
            { title: "Black Clover - Episode 128", url: `${STREAM_HOST}/dl/6aef44d07e2062e6659dc920` },
            { title: "Black Clover - Episode 129", url: `${STREAM_HOST}/dl/6aeeef276e979983cdce6995` },
            { title: "Black Clover - Episode 130", url: `${STREAM_HOST}/dl/6aeeef276e979983cdce6994` },
            { title: "Black Clover - Episode 131", url: `${STREAM_HOST}/dl/6aeeef1c6e979983cdce6993` },
            { title: "Black Clover - Episode 132", url: `${STREAM_HOST}/dl/6aeeef1c6e979983cdce6992` },
            { title: "Black Clover - Episode 133", url: `${STREAM_HOST}/dl/6aeeeee16e979983cdce6990` },
            { title: "Black Clover - Episode 134", url: `${STREAM_HOST}/dl/6aeeeee16e979983cdce6991` },
            { title: "Black Clover - Episode 135", url: `${STREAM_HOST}/dl/6aeeeee16e979983cdce698f` },
            { title: "Black Clover - Episode 136", url: `${STREAM_HOST}/dl/6aeeeedc6e979983cdce698d` },
            { title: "Black Clover - Episode 137", url: `${STREAM_HOST}/dl/6aef44127e2062e6659dc91e` },
            { title: "Black Clover - Episode 138", url: `${STREAM_HOST}/dl/6aef432f6e979983cdce6a19` },
            { title: "Black Clover - Episode 139", url: `${STREAM_HOST}/dl/6aeeeeda6e979983cdce698c` },
            { title: "Black Clover - Episode 140", url: `${STREAM_HOST}/dl/6aeeeedc6e979983cdce698e` },
            { title: "Black Clover - Episode 141", url: `${STREAM_HOST}/dl/6aeeeed96e979983cdce6989` },
            { title: "Black Clover - Episode 142", url: `${STREAM_HOST}/dl/6aeeeed96e979983cdce6988` },
            { title: "Black Clover - Episode 143", url: `${STREAM_HOST}/dl/6aeeeed96e979983cdce698a` },
            { title: "Black Clover - Episode 144", url: `${STREAM_HOST}/dl/6aeeeed96e979983cdce6987` },
            { title: "Black Clover - Episode 145", url: `${STREAM_HOST}/dl/6aef4ba97e2062e6659dc937` },
            { title: "Black Clover - Episode 146", url: `${STREAM_HOST}/dl/6aef422e6e979983cdce6a16` },
            { title: "Black Clover - Episode 147", url: `${STREAM_HOST}/dl/6aef42366e979983cdce6a17` },
            { title: "Black Clover - Episode 148", url: `${STREAM_HOST}/dl/6aef422e6e979983cdce6a15` },
            { title: "Black Clover - Episode 149", url: `${STREAM_HOST}/dl/6aef422e6e979983cdce6a14` },
            { title: "Black Clover - Episode 150", url: `${STREAM_HOST}/dl/6aef44d07e2062e6659dc922` },
            { title: "Black Clover - Episode 151", url: `${STREAM_HOST}/dl/6aef422e6e979983cdce6a12` },
            { title: "Black Clover - Episode 152", url: `${STREAM_HOST}/dl/6aef422e6e979983cdce6a13` },
            { title: "Black Clover - Episode 153", url: `${STREAM_HOST}/dl/6aef422e6e979983cdce6a11` },
            { title: "Black Clover - Episode 154", url: `${STREAM_HOST}/dl/6aef47f27e2062e6659dc926` },
            { title: "Black Clover - Episode 155", url: `${STREAM_HOST}/dl/6aef47f27e2062e6659dc92a` },
            { title: "Black Clover - Episode 156", url: `${STREAM_HOST}/dl/6aef47f27e2062e6659dc92b` },
            { title: "Black Clover - Episode 157", url: `${STREAM_HOST}/dl/6aef47f27e2062e6659dc929` },
            { title: "Black Clover - Episode 158", url: `${STREAM_HOST}/dl/6aef47f27e2062e6659dc928` },
            { title: "Black Clover - Episode 159", url: `${STREAM_HOST}/dl/6aef47f27e2062e6659dc927` },
            { title: "Black Clover - Episode 160", url: `${STREAM_HOST}/dl/6aef47f37e2062e6659dc92c` },
            { title: "Black Clover - Episode 161", url: `${STREAM_HOST}/dl/6aef4b107e2062e6659dc936` },
            { title: "Black Clover - Episode 162", url: `${STREAM_HOST}/dl/6aef4a3c7e2062e6659dc92e` },
            { title: "Black Clover - Episode 163", url: `${STREAM_HOST}/dl/6aef4a3c7e2062e6659dc930` },
            { title: "Black Clover - Episode 164", url: `${STREAM_HOST}/dl/6aef4a3c7e2062e6659dc92d` },
            { title: "Black Clover - Episode 165", url: `${STREAM_HOST}/dl/6aef4a3d7e2062e6659dc932` },
            { title: "Black Clover - Episode 166", url: `${STREAM_HOST}/dl/6aef4a3d7e2062e6659dc931` },
            { title: "Black Clover - Episode 167", url: `${STREAM_HOST}/dl/6aef4a3c7e2062e6659dc92f` },
            { title: "Black Clover - Episode 168", url: `${STREAM_HOST}/dl/6aef4a427e2062e6659dc933` },
            { title: "Black Clover - Episode 169", url: `${STREAM_HOST}/dl/6aef4a427e2062e6659dc934` },
            { title: "Black Clover - Episode 170", url: `${STREAM_HOST}/dl/6aef4a427e2062e6659dc935` },
        ])
    },
    "heartstring_catalog": {
        id: "heartstrings",
        catalogId: "heartstring_catalog",
        name: "Heartstring",
        poster: "",
        background: "",
        description: "Kehidupan Gyu-won berubah apabila dia bertemu dengan Lee Shin (Jung Yong-hwa), seorang pelajar jurusan muzik moden yang juga vokalis dan gitaris utama kumpulan rock kampus terkenal bernama The Stupid. Lee Shin dikenali sebagai seorang yang sangat kacak tetapi berpewatakan dingin, sombong, dan tidak mempunyai impian besar untuk masa depannya.",
        episodes: createEpisodes([
            { title: "Heartstrings - Episode 1", url: `${STREAM_HOST}/dl/6ae756636e979983cdce6838` },
            { title: "Heartstrings - Episode 2", url: `${STREAM_HOST}/dl/6ae88a896e979983cdce689c` },
            { title: "Heartstrings - Episode 3", url: `${STREAM_HOST}/dl/6ae756686e979983cdce6839` },
            { title: "Heartstrings - Episode 4", url: `${STREAM_HOST}/dl/6ae88a806e979983cdce6896` },
            { title: "Heartstrings - Episode 5", url: `${STREAM_HOST}/dl/6ae88a806e979983cdce6899` },
            { title: "Heartstrings - Episode 6", url: `${STREAM_HOST}/dl/6ae88a806e979983cdce689a` },
            { title: "Heartstrings - Episode 7", url: `${STREAM_HOST}/dl/6ae756736e979983cdce683b` },
            { title: "Heartstrings - Episode 8", url: `${STREAM_HOST}/dl/6ae756776e979983cdce683c` },
            { title: "Heartstrings - Episode 9", url: `${STREAM_HOST}/dl/6ae7567b6e979983cdce683d` },
            { title: "Heartstrings - Episode 10", url: `${STREAM_HOST}/dl/6ae7567e6e979983cdce683e` },
            { title: "Heartstrings - Episode 11", url: `${STREAM_HOST}/dl/6ae756826e979983cdce683f` },
            { title: "Heartstrings - Episode 12", url: `${STREAM_HOST}/dl/6ae88a896e979983cdce689b` },
            { title: "Heartstrings - Episode 13", url: `${STREAM_HOST}/dl/6ae88a806e979983cdce6897` },
            { title: "Heartstrings - Episode 14", url: `${STREAM_HOST}/dl/6ae88a806e979983cdce6895` },
            { title: "Heartstrings - Episode 15", url: `${STREAM_HOST}/dl/6ae756866e979983cdce6840` }
        ])
    },
    "shaman_king_s1_catalog": {
        id: "shaman_king_s1",
        catalogId: "shaman_king_s1_catalog",
        name: "Shaman King Season 1",
        poster: "https://i.postimg.cc/YqfvL5mC/Shaman-King-DP.jpg",
        background: "https://i.postimg.cc/5NqXQhFJ/Shaman-King-WP.jpg",
        description: "Setiap 500 tahun, sebuah kejohanan agung yang dipanggil Shaman Fight diadakan untuk memilih seorang Shaman King (Raja Pawang). Pemenang kejohanan ini akan bersatu dengan Great Spirit (Semangat Agung) dan memperoleh kuasa mutlak untuk mencorakkan semula dunia mengikut kehendaknya. Yoh Asakura menyertai pertandingan ini dengan impian mudah: untuk hidup tenang dan bebas daripada sebarang kerisauan. Sepanjang perjalanannya, Yoh dibantu oleh rakan manusia biasa bernama Manta Oyamada dan roh pahlawan samurai legenda berusia 600 tahun, Amidamaru.",
        episodes: createEpisodes([
            { title: "Shaman King - Episode 1", url: `${STREAM_HOST}/dl/6ae7593f6e979983cdce6881` },
            { title: "Shaman King - Episode 2", url: `${STREAM_HOST}/dl/6ae7593f6e979983cdce6880` },
            { title: "Shaman King - Episode 3", url: `${STREAM_HOST}/dl/6ae7593f6e979983cdce687e` },
            { title: "Shaman King - Episode 4", url: `${STREAM_HOST}/dl/6ae7593f6e979983cdce687f` },
            { title: "Shaman King - Episode 5", url: `${STREAM_HOST}/dl/6ae759326e979983cdce687d` },
            { title: "Shaman King - Episode 6", url: `${STREAM_HOST}/dl/6ae759326e979983cdce687c` },
            { title: "Shaman King - Episode 7", url: `${STREAM_HOST}/dl/6ae759326e979983cdce687b` },
            { title: "Shaman King - Episode 8", url: `${STREAM_HOST}/dl/6ae7590b6e979983cdce687a` },
            { title: "Shaman King - Episode 9", url: `${STREAM_HOST}/dl/6ae759076e979983cdce6879` },
            { title: "Shaman King - Episode 10", url: `${STREAM_HOST}/dl/6ae759016e979983cdce6878` },
            { title: "Shaman King - Episode 11", url: `${STREAM_HOST}/dl/6ae759006e979983cdce6877` },
            { title: "Shaman King - Episode 12", url: `${STREAM_HOST}/dl/6ae759006e979983cdce6876` },
            { title: "Shaman King - Episode 13", url: `${STREAM_HOST}/dl/6ae758fb6e979983cdce6874` },
            { title: "Shaman King - Episode 14", url: `${STREAM_HOST}/dl/6ae758fb6e979983cdce6875` },
            { title: "Shaman King - Episode 15", url: `${STREAM_HOST}/dl/6ae758fa6e979983cdce6873` },
            { title: "Shaman King - Episode 16", url: `${STREAM_HOST}/dl/6ae758fa6e979983cdce6872` },
            { title: "Shaman King - Episode 17", url: `${STREAM_HOST}/dl/6ae758ca6e979983cdce6871` },
            { title: "Shaman King - Episode 18", url: `${STREAM_HOST}/dl/6ae758ca6e979983cdce6870` },
            { title: "Shaman King - Episode 19", url: `${STREAM_HOST}/dl/6ae758ca6e979983cdce686f` },
            { title: "Shaman King - Episode 20", url: `${STREAM_HOST}/dl/6ae758c46e979983cdce686e` },
            { title: "Shaman King - Episode 21", url: `${STREAM_HOST}/dl/6ae758c46e979983cdce686d` },
            { title: "Shaman King - Episode 22", url: `${STREAM_HOST}/dl/6ae758c06e979983cdce686c` },
            { title: "Shaman King - Episode 23", url: `${STREAM_HOST}/dl/6ae758be6e979983cdce686b` },
            { title: "Shaman King - Episode 24", url: `${STREAM_HOST}/dl/6ae758be6e979983cdce6869` },
            { title: "Shaman King - Episode 25", url: `${STREAM_HOST}/dl/6ae758be6e979983cdce686a` },
            { title: "Shaman King - Episode 26", url: `${STREAM_HOST}/dl/6ae758b96e979983cdce6868` },
            { title: "Shaman King - Episode 27", url: `${STREAM_HOST}/dl/6ae7589a6e979983cdce6867` },
            { title: "Shaman King - Episode 28", url: `${STREAM_HOST}/dl/6ae758966e979983cdce6866` },
            { title: "Shaman King - Episode 29", url: `${STREAM_HOST}/dl/6ae758916e979983cdce6865` },
            { title: "Shaman King - Episode 30", url: `${STREAM_HOST}/dl/6ae7588e6e979983cdce6864` },
            { title: "Shaman King - Episode 31", url: `${STREAM_HOST}/dl/6ae7588a6e979983cdce6863` },
            { title: "Shaman King - Episode 32", url: `${STREAM_HOST}/dl/6ae758876e979983cdce6862` },
            { title: "Shaman King - Episode 33", url: `${STREAM_HOST}/dl/6ae758836e979983cdce6861` },
            { title: "Shaman King - Episode 34", url: `${STREAM_HOST}/dl/6ae7587f6e979983cdce6860` },
            { title: "Shaman King - Episode 35", url: `${STREAM_HOST}/dl/6ae7587d6e979983cdce685f` },
            { title: "Shaman King - Episode 36", url: `${STREAM_HOST}/dl/6ae758786e979983cdce685e` },
            { title: "Shaman King - Episode 37", url: `${STREAM_HOST}/dl/6ae758746e979983cdce685d` },
            { title: "Shaman King - Episode 38", url: `${STREAM_HOST}/dl/6ae758716e979983cdce685c` },
            { title: "Shaman King - Episode 39", url: `${STREAM_HOST}/dl/6ae7586d6e979983cdce685b` },
            { title: "Shaman King - Episode 40", url: `${STREAM_HOST}/dl/6ae758686e979983cdce685a` },
            { title: "Shaman King - Episode 41", url: `${STREAM_HOST}/dl/6ae758646e979983cdce6859` },
            { title: "Shaman King - Episode 42", url: `${STREAM_HOST}/dl/6ae7585f6e979983cdce6858` },
            { title: "Shaman King - Episode 43", url: `${STREAM_HOST}/dl/6ae7585c6e979983cdce6857` },
            { title: "Shaman King - Episode 44", url: `${STREAM_HOST}/dl/6ae758586e979983cdce6856` },
            { title: "Shaman King - Episode 45", url: `${STREAM_HOST}/dl/6ae758556e979983cdce6855` },
            { title: "Shaman King - Episode 46", url: `${STREAM_HOST}/dl/6ae758516e979983cdce6854` },
            { title: "Shaman King - Episode 47", url: `${STREAM_HOST}/dl/6ae7584c6e979983cdce6853` },
            { title: "Shaman King - Episode 48", url: `${STREAM_HOST}/dl/6ae758496e979983cdce6852` },
            { title: "Shaman King - Episode 49", url: `${STREAM_HOST}/dl/6ae758456e979983cdce6851` },
            { title: "Shaman King - Episode 50", url: `${STREAM_HOST}/dl/6ae758426e979983cdce6850` },
            { title: "Shaman King - Episode 51", url: `${STREAM_HOST}/dl/6ae7583e6e979983cdce684f` },
            { title: "Shaman King - Episode 52", url: `${STREAM_HOST}/dl/6ae7583b6e979983cdce684e` }
        ])
    },
    "shaman_king_s2_catalog": {
        id: "shaman_king_s2",
        catalogId: "shaman_king_s2_catalog",
        name: "Shaman King Season 2 : Flowers",
        poster: "https://i.postimg.cc/dtmhZbTw/Shaman-King-2-DP.jpg",
        background: "https://i.postimg.cc/gkqxLC6G/Shaman-King-2-WP.webp",
        description: "Tiga belas tahun selepas tamatnya Pertarungan Shaman yang epik, dunia berada dalam keadaan aman. Fokus cerita kini beralih kepada Hana Asakura, anak lelaki kepada Yoh Asakura dan Anna Kyoyama. Berbeza dengan bapanya yang tenang dan pemalas, Hana membesar menjadi seorang remaja yang panas baran, kasar, dan bosan dengan kehidupan hariannya yang dianggap terlalu tenang. Kerana dilarang menggunakan kuasa pawangnya oleh ibu angkatnya, Tamao Tamamura, Hana berasa bakatnya dipersia-siakan.",
        episodes: createEpisodes([
            { title: "Shaman King S2 - Episode 1", url: `${STREAM_HOST}/dl/6ae758006e979983cdce684d` },
            { title: "Shaman King S2 - Episode 2", url: `${STREAM_HOST}/dl/6ae757fc6e979983cdce684c` },
            { title: "Shaman King S2 - Episode 3", url: `${STREAM_HOST}/dl/6ae757f66e979983cdce684b` },
            { title: "Shaman King S2 - Episode 4", url: `${STREAM_HOST}/dl/6ae757f26e979983cdce684a` },
            { title: "Shaman King S2 - Episode 5", url: `${STREAM_HOST}/dl/6ae757ed6e979983cdce6849` },
            { title: "Shaman King S2 - Episode 6", url: `${STREAM_HOST}/dl/6ae757e96e979983cdce6848` },
            { title: "Shaman King S2 - Episode 7", url: `${STREAM_HOST}/dl/6ae757e56e979983cdce6847` },
            { title: "Shaman King S2 - Episode 8", url: `${STREAM_HOST}/dl/6ae757e06e979983cdce6846` },
            { title: "Shaman King S2 - Episode 9", url: `${STREAM_HOST}/dl/6ae757dd6e979983cdce6845` },
            { title: "Shaman King S2 - Episode 10", url: `${STREAM_HOST}/dl/6ae757d96e979983cdce6844` },
            { title: "Shaman King S2 - Episode 11", url: `${STREAM_HOST}/dl/6ae757d56e979983cdce6843` },
            { title: "Shaman King S2 - Episode 12", url: `${STREAM_HOST}/dl/6ae757cf6e979983cdce6842` },
            { title: "Shaman King S2 - Episode 13", url: `${STREAM_HOST}/dl/6ae757c46e979983cdce6841` }
        ])
    },
    "super_beerus_catalog": {
        id: "super_beerus",
        catalogId: "super_beerus_catalog",
        name: "Dragon Ball Super Beerus",
        poster: "https://i.postimg.cc/ZKFWvGvQ/Dragon-Ball-Super-Beerus-DP.jpg",
        background: "https://i.postimg.cc/fTjVSGS6/Dragon-Ball-Super-Beerus-WP.webp",
        description: "Tugas utama Beerus adalah untuk mengekalkan keseimbangan alam semesta dengan memusnahkan planet-planet yang dianggap tidak berpotensi atau mengancam keharmonian. Namun, dia lebih sering bertindak mengikut emosi, mood, dan seleranya terhadap makanan. Kehadiran Beerus membuka jalan kepada pendedahan yang lebih besar dalam garis masa Dragon Ball Super, termasuk kewujudan 12 buah semesta lain, abangnya Champa (Dewa Pemusnah Semesta 6), dan pemerintah tertinggi pelbagai semesta, Zeno.",
        episodes: createEpisodes([
            { title: "Dragon Ball Super Beerus - Episode 1", url: `${STREAM_HOST}/dl/6ae7462e6e979983cdce6822` },
            { title: "Dragon Ball Super Beerus - Episode 2", url: `${STREAM_HOST}/dl/6ae7462b6e979983cdce6821` },
            { title: "Dragon Ball Super Beerus - Episode 3", url: `${STREAM_HOST}/dl/6ae746276e979983cdce6820` },
            { title: "Dragon Ball Super Beerus - Episode 4", url: `${STREAM_HOST}/dl/6ae882636e979983cdce6893` }
        ])
    },
    "black_clover_s2_catalog": {
        id: "black_clover_s2",
        catalogId: "black_clover_s2_catalog",
        name: "Black Clover - Season 2",
        poster: "https://i.postimg.cc/VLBJ0xbQ/Black-Clover-Season-2-DP.webp",
        background: "https://i.postimg.cc/15c8VkVb/Black-Clover-Season-2-WP.jpg",
        description: "Asta bekerjasama dengan iblisnya, Liebe, serta berlatih bersama Nacht untuk menguasai bentuk Devil Union. Sementara itu, para Ksatria Sihir Kerajaan Clover bersatu dan melancarkan serangan besar-besaran ke Kerajaan Spade untuk menyelamatkan Yami dan William serta menghentikan ritual tersebut.",
        episodes: createEpisodes([
            { title: "Black Clover S2 - Episode 1", url: `${STREAM_HOST}/dl/6ae759b06e979983cdce6886` },
            { title: "Black Clover S2 - Episode 2", url: `${STREAM_HOST}/dl/6ae759ac6e979983cdce6885` },
            { title: "Black Clover S2 - Episode 3", url: `${STREAM_HOST}/dl/6ae759a86e979983cdce6884` },
            { title: "Black Clover S2 - Episode 4", url: `${STREAM_HOST}/dl/6ae7599d6e979983cdce6883` },
            { title: "Black Clover S2 - Episode 5", url: `${STREAM_HOST}/dl/6ae7599a6e979983cdce6882` },
        ])
    },
    "another_catalog": {
        id: "another",
        catalogId: "another_catalog",
        name: "Another",
        poster: "https://i.postimg.cc/Gh1B2LtV/Another-DP.jpg",
        background: "https://i.postimg.cc/wTdtvq3Y/Another-WP.jpg",
        description: "Apabila Kouichi mula bersekolah, dia menyedari atmosfera di dalam Kelas 3-3 sangat suram, tegang, dan penuh ketakutan. Paling pelik, Mei Misaki juga berada di dalam kelas itu, namun semua pelajar dan guru bertingkah seolah-olah Mei tidak wujud. Walaupun sudah diberi amaran secara halus oleh rakan sekelasnya untuk tidak mendekati perkara yang tidak wujud, sifat ingin tahu Kouichi membuatkan dia tetap mendekati Mei. Tindakan Kouichi ini tanpa sengaja telah melanggar satu peraturan penting, lalu mencetuskan semula sebuah kutukan berdarah yang ngeri.",
        episodes: createEpisodes([
            { title: "Another - Episode 1", url: `${STREAM_HOST}/dl/6ae782476e979983cdce688a` },
            { title: "Another - Episode 2", url: `${STREAM_HOST}/dl/6ae782476e979983cdce688a` },
            { title: "Another - Episode 3", url: `${STREAM_HOST}/dl/6ae7824b6e979983cdce688b` },
            { title: "Another - Episode 4", url: `${STREAM_HOST}/dl/6ae7824f6e979983cdce688c` },
            { title: "Another - Episode 5", url: `${STREAM_HOST}/dl/6ae782526e979983cdce688d` },
            { title: "Another - Episode 6", url: `${STREAM_HOST}/dl/6ae782566e979983cdce688e` },
            { title: "Another - Episode 7", url: `${STREAM_HOST}/dl/6ae782596e979983cdce688f` },
            { title: "Another - Episode 8", url: `${STREAM_HOST}/dl/6ae7823d6e979983cdce6887` },
            { title: "Another - Episode 9", url: `${STREAM_HOST}/dl/6ae7825c6e979983cdce6890` },
            { title: "Another - Episode 10", url: `${STREAM_HOST}/dl/6ae782606e979983cdce6891` },
            { title: "Another - Episode 11", url: `${STREAM_HOST}/dl/6ae7823f6e979983cdce6888` },
            { title: "Another - Episode 12", url: `${STREAM_HOST}/dl/6ae782636e979983cdce6892` },
            { title: "Another - Episode 13 (OVA 1)", url: `${STREAM_HOST}/dl/6ae782446e979983cdce6889` },
        ])
    },
    "your_turn_to_kill_catalog": {
        id: "your_turn_to_kill",
        catalogId: "your_turn_to_kill_catalog",
        name: "Your Turn To Kill",
        poster: "https://i.postimg.cc/cC47799B/Your-Turn-To-Kill-DP.jpg",
        background: "https://i.postimg.cc/sxDPP669/Your-Turn-To-Kill-WP.jpg",
        backgroundShape: "Landscape",
        description: "Namun, segalanya berubah apabila Nana menghadiri mesyuarat jawatankuasa penduduk apartmen yang pertama. Dalam perjumpaan tersebut, perbualan santai bertukar menjadi pelik apabila pengurus apartmen melontarkan topik tentang pembunuhan. Mereka mula berbincang bahawa sekiranya seseorang ingin membunuh musuh, mereka lebih mudah terlepas daripada ditangkap polis jika tiada motif yang jelas (tiada kaitan langsung dengan mangsa). Suasana apartmen bertukar menjadi tegang, penuh syak wasangka, dan ketakutan. Penduduk yang terlibat dalam permainan tersebut mula menerima nota ugutan misteri yang bertulis: Giliran anda untuk membunuh (Your Turn to Kill). Mereka dipaksa untuk membunuh sasaran pada kertas yang mereka cabut, sebagai balasan kerana orang lain telah pun membunuh sasaran mereka.",
        episodes: createEpisodes([
            { title: "Your Turn to Kill S01E01", url: `${STREAM_HOST}/dl/6ae5327d6e979983cdce66c6` },
            { title: "Your Turn to Kill S01E02", url: `${STREAM_HOST}/dl/6ae532836e979983cdce66c8` },
            { title: "Your Turn to Kill S01E03", url: `${STREAM_HOST}/dl/6ae532ae6e979983cdce66c9` },
            { title: "Your Turn to Kill S01E04", url: `${STREAM_HOST}/dl/6ae532836e979983cdce66c7` },
            { title: "Your Turn to Kill S01E05", url: `${STREAM_HOST}/dl/6ae532b56e979983cdce66cd` },
            { title: "Your Turn to Kill S01E06", url: `${STREAM_HOST}/dl/6ae532af6e979983cdce66ca` },
            { title: "Your Turn to Kill S01E07", url: `${STREAM_HOST}/dl/6ae532af6e979983cdce66cb` },
            { title: "Your Turn to Kill S01E08", url: `${STREAM_HOST}/dl/6ae532b36e979983cdce66cc` },
            { title: "Your Turn to Kill S01E09", url: `${STREAM_HOST}/dl/6ae532b96e979983cdce66ce` },
            { title: "Your Turn to Kill S01E10", url: `${STREAM_HOST}/dl/6ae532b96e979983cdce66cf` },
            { title: "Your Turn to Kill S01E11", url: `${STREAM_HOST}/dl/6ae532786e979983cdce66c5` },
            { title: "Your Turn to Kill S01E12", url: `${STREAM_HOST}/dl/6ae532786e979983cdce66c4` },
            { title: "Your Turn to Kill S01E13", url: `${STREAM_HOST}/dl/6ae532786e979983cdce66c3` },
            { title: "Your Turn to Kill S01E14", url: `${STREAM_HOST}/dl/6ae532726e979983cdce66c2` },
            { title: "Your Turn to Kill S01E15", url: `${STREAM_HOST}/dl/6ae532726e979983cdce66c1` },
            { title: "Your Turn to Kill S01E16", url: `${STREAM_HOST}/dl/6ae532726e979983cdce66c0` },
            { title: "Your Turn to Kill S01E17", url: `${STREAM_HOST}/dl/6ae532476e979983cdce66bf` },
            { title: "Your Turn to Kill S01E18", url: `${STREAM_HOST}/dl/6ae532466e979983cdce66be` },
            { title: "Your Turn to Kill S01E19", url: `${STREAM_HOST}/dl/6ae532466e979983cdce66bd` },
            { title: "Your Turn to Kill S01E20", url: `${STREAM_HOST}/dl/6ae532416e979983cdce66bc` },
        ])
    },
    "hening_cinta_catalog": {
        id: "hening_cinta",
        catalogId: "hening_cinta_catalog",
        name: "Hening Cinta",
        poster: "https://i.postimg.cc/fyfrscv1/Hening-Cinta-DP.jpg",
        background: "https://i.postimg.cc/Gtx5RFjg/Hening-Cinta-WP.jpg",
        backgroundShape: "Landscape",
        description: "Pertemuan takdir antara dua insan dari latar belakang yang jauh berbeza. Arfan Mansor (Kamal Adli) ialah seorang anak jutawan dan pewaris kaya yang tersesat arah. Dia terjebak dalam kehidupan lampau yang kelam sebagai bekas gangster serta dipenuhi kemaksiatan. Namun, selepas mengalami sebuah kemalangan jalan raya yang hampir meragut nyawanya ketika cuba mengelak daripada melanggar seorang wanita, timbul rasa takut akan kematian di dalam dirinya. Arfan tekad untuk berubah dan meninggalkan dunia hitam tersebut.",
        episodes: createEpisodes([
            { title: "Hening Cinta - Episode 01" , url: `${STREAM_HOST}/dl/6ae534d56e979983cdce6727` },
            { title: "Hening Cinta - Episode 02" , url: `${STREAM_HOST}/dl/6ae534d16e979983cdce6725` },
            { title: "Hening Cinta - Episode 03" , url: `${STREAM_HOST}/dl/6ae534d16e979983cdce6724` },
            { title: "Hening Cinta - Episode 04" , url: `${STREAM_HOST}/dl/6ae534d16e979983cdce6723` },
            { title: "Hening Cinta - Episode 05" , url: `${STREAM_HOST}/dl/6ae534d06e979983cdce6722` },
            { title: "Hening Cinta - Episode 06" , url: `${STREAM_HOST}/dl/6ae5349b6e979983cdce6720` },
            { title: "Hening Cinta - Episode 07" , url: `${STREAM_HOST}/dl/6ae5349b6e979983cdce671f` },
            { title: "Hening Cinta - Episode 08" , url: `${STREAM_HOST}/dl/6ae5349b6e979983cdce671e` },
            { title: "Hening Cinta - Episode 09" , url: `${STREAM_HOST}/dl/6ae534976e979983cdce671d` },
            { title: "Hening Cinta - Episode 10" , url: `${STREAM_HOST}/dl/6ae534966e979983cdce671b` }
        ])
    },
    "saat_aku_tahu_catalog": {
        id: "saat_aku_tahu",
        catalogId: "saat_aku_tahu_catalog",
        name: "Saat Aku Tahu",
        poster: "https://i.postimg.cc/wMQGzXVK/Saat-Aku-Tahu-DP.jpg",
        background: "https://i.postimg.cc/br9BPxTc/Saat-Aku-Tahu-WP.jpg",
        backgroundShape: "Landscape",
        description: "Hidup Ameena hancur berkecai apabila mendapat tahu suaminya, Zarif, menjalin hubungan sulit dengan Maira. Daripada terus bersedih, Ameena berubah menjadi seorang wanita yang tenang, dingin, dan mula merancang balasan dendam. Apabila Maira tidak mahu mengalah, konflik bertukar menjadi perang psikologi yang mengancam keselamatan dan emosi semua orang di sekeliling mereka.",
        episodes: createEpisodes([
            { title: "Saat Aku Tahu - Episode 01" , url: `${STREAM_HOST}/dl/6ae535176e979983cdce6735` },
            { title: "Saat Aku Tahu - Episode 02" , url: `${STREAM_HOST}/dl/6ae5351c6e979983cdce6736` },
            { title: "Saat Aku Tahu - Episode 03" , url: `${STREAM_HOST}/dl/6ae535446e979983cdce6738` },
            { title: "Saat Aku Tahu - Episode 04" , url: `${STREAM_HOST}/dl/6ae535446e979983cdce6739` },
            { title: "Saat Aku Tahu - Episode 05" , url: `${STREAM_HOST}/dl/6ae5354f6e979983cdce673b` },
            { title: "Saat Aku Tahu - Episode 06" , url: `${STREAM_HOST}/dl/6ae535506e979983cdce673e` },
            { title: "Saat Aku Tahu - Episode 07" , url: `${STREAM_HOST}/dl/6ae535446e979983cdce6737` },
            { title: "Saat Aku Tahu - Episode 08" , url: `${STREAM_HOST}/dl/6ae535556e979983cdce673f` },
            { title: "Saat Aku Tahu - Episode 09" , url: `${STREAM_HOST}/dl/6ae535506e979983cdce673d` },
            { title: "Saat Aku Tahu - Episode 10" , url: `${STREAM_HOST}/dl/6ae535806e979983cdce6740` },
            { title: "Saat Aku Tahu - Episode 11" , url: `${STREAM_HOST}/dl/6ae535806e979983cdce6741` },
            { title: "Saat Aku Tahu - Episode 12" , url: `${STREAM_HOST}/dl/6ae535856e979983cdce6742` },
            { title: "Saat Aku Tahu - Episode 13" , url: `${STREAM_HOST}/dl/6ae535866e979983cdce6743` },
            { title: "Saat Aku Tahu - Episode 14" , url: `${STREAM_HOST}/dl/6ae535866e979983cdce6744` },
            { title: "Saat Aku Tahu - Episode 15" , url: `${STREAM_HOST}/dl/6ae5358b6e979983cdce6745` }
        ])
    },
    "aku_pilih_pelangi_catalog": {
        id: "aku_pilih_pelangi",
        catalogId: "aku_pilih_pelangi_catalog",
        name: "Aku Pilih Pelangi",
        poster: "https://i.postimg.cc/6qfmKrhS/Aku-Pilih-Pelangi-DP.jpg",
        background: "https://i.postimg.cc/prJ6vfBS/Aku-Pilih-Pelangi-WP.jpg",
        backgroundShape: "Landscape",
        description: "Nayla mula menemui ketenangan dan rasa dihargai apabila kembali rapat dengan rakan lamanya, Iskandar. Firdaus yang mula mendalami dunia melalui pendengaran dan intuisi dapat merasakannya—jarak yang semakin renggang dalam hati Nayla serta hubungan yang terjalin antara Iskandar dengan anak mereka, Wafi. Di ambang kepayahan ini, Nayla terpaksa membuat keputusan sukar: memilih antara lelaki yang memberikan dia rasa dihargai kembali (Iskandar) atau suami yang masih memiliki seluruh hatinya (Firdaus).",
        episodes: createEpisodes([
            { title: "Aku Pilih Pelangi - Episode 01" , url: `${STREAM_HOST}/dl/6ae535176e979983cdce6734` },
            { title: "Aku Pilih Pelangi - Episode 02" , url: `${STREAM_HOST}/dl/6ae535166e979983cdce6733` },
            { title: "Aku Pilih Pelangi - Episode 03" , url: `${STREAM_HOST}/dl/6ae535126e979983cdce6732` },
            { title: "Aku Pilih Pelangi - Episode 04" , url: `${STREAM_HOST}/dl/6ae535116e979983cdce6731` },
            { title: "Aku Pilih Pelangi - Episode 05" , url: `${STREAM_HOST}/dl/6ae5350d6e979983cdce672f` },
            { title: "Aku Pilih Pelangi - Episode 06" , url: `${STREAM_HOST}/dl/6ae5350d6e979983cdce672e` },
            { title: "Aku Pilih Pelangi - Episode 07" , url: `${STREAM_HOST}/dl/6ae5350c6e979983cdce672d` },
            { title: "Aku Pilih Pelangi - Episode 08" , url: `${STREAM_HOST}/dl/6ae534e06e979983cdce672c` },
            { title: "Aku Pilih Pelangi - Episode 09" , url: `${STREAM_HOST}/dl/6ae534df6e979983cdce672b` },
            { title: "Aku Pilih Pelangi - Episode 10" , url: `${STREAM_HOST}/dl/6ae534db6e979983cdce672a` },
            { title: "Aku Pilih Pelangi - Episode 11" , url: `${STREAM_HOST}/dl/6ae534da6e979983cdce6729` },
            { title: "Aku Pilih Pelangi - Episode 12" , url: `${STREAM_HOST}/dl/6ae534d66e979983cdce6728` }
        ])
    },
    "bayangan_dendam_catalog": {
        id: "bayangan_dendam",
        catalogId: "bayangan_dendam_catalog",
        name: "Bayangan Dendam",
        poster: "https://i.postimg.cc/cCSbP9Qy/Bayangan-Dendam-DP.jpg",
        background: "https://i.postimg.cc/1XQjbCDk/Bayangan-Dendam-WP.jpg",
        backgroundShape: "Landscape",
        description: "Melissa dan Ariana merupakan dua orang sahabat baik yang telah mengenali antara satu sama lain sejak zaman sekolah asrama lagi. Apabila kekasih Melissa, Farhan, melanjutkan pelajaran ke luar negara, Melissa yang terlalu mempercayai kekasihnya telah meminta bantuan Ariana yang kebetulan menuntut di universiti yang sama untuk memantau gerak-geri Farhan di sana tanpa pengetahuan lelaki itu. Kematian Melissa mula membongkar pelbagai rahsia, pengkhianatan tersembunyi, dan dendam yang selama ini dipendam. Farhan dan Ariana terjerat sebagai suspek utama, manakala penyiasatan polis mula mendedahkan bahawa setiap orang di sekeliling Melissa mempunyai motif tersendiri. Persoalan utama yang perlu dirungkai. Adakah Melissa benar-benar membunuh diri, atau dia sebenarnya telah dibunuh?",
        episodes: createEpisodes([
            { title: "Bayangan Dendam - Episode 01" , url: `${STREAM_HOST}/dl/6ae533eb6e979983cdce6703` },
            { title: "Bayangan Dendam - Episode 02" , url: `${STREAM_HOST}/dl/6ae533eb6e979983cdce6704` },
            { title: "Bayangan Dendam - Episode 03" , url: `${STREAM_HOST}/dl/6ae533e66e979983cdce6701` },
            { title: "Bayangan Dendam - Episode 04" , url: `${STREAM_HOST}/dl/6ae533e16e979983cdce66ff` },
            { title: "Bayangan Dendam - Episode 05" , url: `${STREAM_HOST}/dl/6aede5af6e979983cdce6966` },
            { title: "Bayangan Dendam - Episode 06" , url: `${STREAM_HOST}/dl/6aede5b36e979983cdce6967` }
        ])
    },
    "bidadari_tanpa_syurga_catalog": {
        id: "bidadari_tanpa_syurga",
        catalogId: "bidadari_tanpa_syurga_catalog",
        name: "Bidadari Tanpa Syurga",
        poster: "https://i.postimg.cc/BbBV3TCm/Bidadari-Tanpa-Syurga-DP.jpg",
        background: "https://i.postimg.cc/L53bStVy/Bidadari-Tanpa-Syurga-WP.jpg",
        backgroundShape: "Landscape",
        description: "Azlan, seorang pengasas pertubuhan bukan kerajaan (NGO) yang sangat dikenali, dihormati, dan dianggap sebagai wira masyarakat. Di mata orang ramai, Azlan ialah seorang lelaki Muslim yang warak, tenang, berilmu, dan sentiasa menggunakan agama sebagai panduan hidup untuk membantu golongan miskin serta menyelesaikan masalah hutang atau aib keluarga lain. Namun, di sebalik topeng kesempurnaan tersebut, Azlan mempunyai sifat narsistik yang tegar dan merupakan seorang penunggang agama yang memanipulasi emosi orang sekeliling, terutamanya di rumah. Kehidupan rumah tangganya bersama isteri pertama, Farhah, dipenuhi dengan pergolakan dan penderaan mental. Farhah sering diasingkan dan dipersalahkan kerana mempersoalkan keutamaan masa Azlan, menyebabkan masyarakat luar tersalah anggap bahawa Farhah adalah seorang isteri yang tidak bersyukur dan sukar memahami tugas suaminya.",
        episodes: createEpisodes([
            { title: "Bidadari Tanpa Syurga - Episode 01" , url: `${STREAM_HOST}/dl/6ae534276e979983cdce670e` },
            { title: "Bidadari Tanpa Syurga - Episode 02" , url: `${STREAM_HOST}/dl/6ae534536e979983cdce670f` },
            { title: "Bidadari Tanpa Syurga - Episode 03" , url: `${STREAM_HOST}/dl/6ae534536e979983cdce6710` },
            { title: "Bidadari Tanpa Syurga - Episode 04" , url: `${STREAM_HOST}/dl/6ae534276e979983cdce670d` },
            { title: "Bidadari Tanpa Syurga - Episode 05" , url: `${STREAM_HOST}/dl/6ae534226e979983cdce670c` },
            { title: "Bidadari Tanpa Syurga - Episode 06" , url: `${STREAM_HOST}/dl/6ae534226e979983cdce670b` },
            { title: "Bidadari Tanpa Syurga - Episode 07" , url: `${STREAM_HOST}/dl/6ae5341d6e979983cdce670a` },
            { title: "Bidadari Tanpa Syurga - Episode 08" , url: `${STREAM_HOST}/dl/6ae5341c6e979983cdce6709` },
            { title: "Bidadari Tanpa Syurga - Episode 09" , url: `${STREAM_HOST}/dl/6ae5341c6e979983cdce6708` },
            { title: "Bidadari Tanpa Syurga - Episode 10" , url: `${STREAM_HOST}/dl/6ae5341c6e979983cdce6707` },
            { title: "Bidadari Tanpa Syurga - Episode 11" , url: `${STREAM_HOST}/dl/6ae534176e979983cdce6706` },
            { title: "Bidadari Tanpa Syurga - Episode 12" , url: `${STREAM_HOST}/dl/6ae534176e979983cdce6705` }
        ])
    },
    "cinta_dalam_sekam_catalog": {
        id: "cinta_dalam_sekam",
        catalogId: "cinta_dalam_sekam_catalog",
        name: "Cinta Dalam Sekam",
        poster: "https://i.postimg.cc/PJQRHWM3/Cinta-Dalam-Sekam-DP.jpg",
        background: "https://i.postimg.cc/PJQRHWMR/Cinta-Dalam-Sekam-WP.jpg",
        backgroundShape: "Landscape",
        description: "Hubungan dan pilihan hidup mereka diuji dengan rasa cemburu, pengkhianatan, serta jurang sosial yang mengubah takdir hidup mereka buat selama-lamanya. Kisah beralih kepada Uwan (lakonan Razak Ahmad / Shafiq tua), seorang warga emas yang menghidap dementia (nyanyuk). Memorinya seolah-olah terperangkap pada tahun 1988, dan dia terus-menerus merintih serta menyebut nama Laila.  Usaha ahli keluarga merungkai misteri di sebalik nama Laila membawa mereka kepada kisah cinta lama, luka terpendam, serta pengorbanan yang tidak pernah selesai selama puluhan tahun.",
        episodes: createEpisodes([
            { title: "Cinta Dalam Sekam - Episode 01" , url: `${STREAM_HOST}/dl/6ae5348f6e979983cdce671a` },
            { title: "Cinta Dalam Sekam - Episode 02" , url: `${STREAM_HOST}/dl/6ae534966e979983cdce671c` },
            { title: "Cinta Dalam Sekam - Episode 03" , url: `${STREAM_HOST}/dl/6ae5348f6e979983cdce6719` },
            { title: "Cinta Dalam Sekam - Episode 04" , url: `${STREAM_HOST}/dl/6ae534646e979983cdce6718` },
            { title: "Cinta Dalam Sekam - Episode 05" , url: `${STREAM_HOST}/dl/6ae534646e979983cdce6717` },
            { title: "Cinta Dalam Sekam - Episode 06" , url: `${STREAM_HOST}/dl/6ae5345f6e979983cdce6716` },
            { title: "Cinta Dalam Sekam - Episode 07" , url: `${STREAM_HOST}/dl/6ae5345e6e979983cdce6715` },
            { title: "Cinta Dalam Sekam - Episode 08" , url: `${STREAM_HOST}/dl/6ae5ccc96e979983cdce6755` },
            { title: "Cinta Dalam Sekam - Episode 09" , url: `${STREAM_HOST}/dl/6ae5345e6e979983cdce6714` },
            { title: "Cinta Dalam Sekam - Episode 10" , url: `${STREAM_HOST}/dl/6ae534596e979983cdce6713` },
            { title: "Cinta Dalam Sekam - Episode 11" , url: `${STREAM_HOST}/dl/6ae534596e979983cdce6712` },
            { title: "Cinta Dalam Sekam - Episode 12" , url: `${STREAM_HOST}/dl/6ae534546e979983cdce6711` }
        ])
    },
    "running_man_catalog": {
        id: "running_man",
        catalogId: "running_man_catalog",
        name: "Runningman 1-324",
        poster: "https://i.postimg.cc/wMYXFx0G/RM-2.jpg",
        background: "https://i.postimg.cc/0NCNGNjW/RM7012.jpg",
        backgroundShape: "Landscape",
        description: "Koleksi Episod Running Man (Episod 1 - 324). Cast : Yoo Jae Suk, Ji Seok Jin, Kim Jong Kook, Kang Gary, HaHa, Lee Kwang Soo & Song Ji Hyo.",
        episodes: createEpisodes([
            { title: "Episod 1: Times Square", description: "Lee Hyori and Hwang Jung Eum join the casts for their first run. 2 teams are created 'Expensive' and 'Cheap' teams.", url: `${STREAM_HOST}/dl/6acbff846e979983cdce555e` },
            { title: "Episod 2: Suwon World Cup Stadium, Part 1", description: "Lee Chun Hee and Goo Hara join in with the cast as they venture through Suwon stadium.", url: `${STREAM_HOST}/dl/6acc00196e979983cdce5561` },
            { title: "Episod 3: Suwon World Cup Stadium, Part 2", description: "Continuing on from Episode 2. More fierce games pursue and only 1 team will come out victorious!", url: `${STREAM_HOST}/dl/6acc00196e979983cdce555f` },
            { title: "Episod 4: Gwacheon National Science Museum, Part 1", description: "An exciting day at Gwacheon National Science Museum. Guest appearances from Nichkhun and Jessica.", url: `${STREAM_HOST}/dl/6acc00196e979983cdce5562` },
            { title: "Episod 5: Gwacheon National Science Museum, Part 2", description: "Continuing from episode 4, the 2 teams battle for the rights to leave.", url: `${STREAM_HOST}/dl/6acc001a6e979983cdce5563` },
            { title: "Episod 6: Namsan Tower", description: "YG's prince Se7en, song queen Son Dam Bi, and Kim Shin Young join the cast in Seoul Tower.", url: `${STREAM_HOST}/dl/6acc00196e979983cdce5560` },
            { title: "Episod 7: Sejong Center For The Performing Arts", description: "Taking place in Sejong Center of Performing Arts with Jo Kwon, Jung Yong Hwa and Eun Jeong.", url: `${STREAM_HOST}/dl/6acc001a6e979983cdce5564` },
            { title: "Episod 8: Seoul Museum of History, Gyeonghui Palace", description: "Special guests Victoria, Lee Joon, and Park Jun Gyu.", url: `${STREAM_HOST}/dl/6acc001c6e979983cdce5565` },
            { title: "Episod 9: Lotte World", description: "Hilarious episode starring Shin Bong Sun and Kim Jong Kook in Seoul's famous Lotte World.", url: `${STREAM_HOST}/dl/6acc001c6e979983cdce5566` },
            { title: "Episod 10: National Museum of Contemporary Art", description: "Cha Tae Hyun and Yoon Se Ah join the cast at National Museum of Contemporary Art.", url: `${STREAM_HOST}/dl/6acc001d6e979983cdce5567` },
            { title: "Episod 11: Seoul Central Post Office", description: "Individually earn Running Balls at Seoul Central Post Office.", url: `${STREAM_HOST}/dl/6acc00216e979983cdce5569` },
            { title: "Episod 12: Seoul Design Fair @ Seoul Olympic Stadium", description: "The Ultimate Design Race. The Running Man team dives into the world of design.", url: `${STREAM_HOST}/dl/6acc00216e979983cdce5568` },
            { title: "Episod 13: SBS Broadcasting Center", description: "All-Night Broadcast Battle. Special guests Jang Dong-min and Lizzy (After School).", url: `${STREAM_HOST}/dl/6acc00266e979983cdce556a` },
            { title: "Episod 14: Boramae Safety Experience Center", description: "Lizzy returns for another exciting trip taking place in Boramae Safety Experience Center.", url: `${STREAM_HOST}/dl/6acc00266e979983cdce556b` },
            { title: "Episod 15: Seoul Metro Train Depot", description: "Subway Chase and Ji-hyo's Heart. Guests: Tony An, Kim Kwang-gyu.", url: `${STREAM_HOST}/dl/6acc002c6e979983cdce556c` },
            { title: "Episod 16: I'Park Mall (Yongsan-gu, Seoul)", description: "Individually earn running balls and get 200,000 won in receipts and trade it for a running ball.", url: `${STREAM_HOST}/dl/6acc002c6e979983cdce556d` },
            { title: "Episod 17: Hanyang Women's University", description: "Individually earn running balls and find the 4 bells hidden in the school and ring them.", url: `${STREAM_HOST}/dl/6acc00586e979983cdce556e` },
            { title: "Episod 18: Busan International Cruise Ship", description: "Individually earn Running Balls and find the 6 map pieces.", url: `${STREAM_HOST}/dl/6acc00596e979983cdce556f` },
            { title: "Episod 19: Namsangol Hanok Village", description: "Earn the Running Balls & Complete the ten traditional Symbols of Longevity.", url: `${STREAM_HOST}/dl/6acc00596e979983cdce5570` },
            { title: "Episod 20: Korea Meteorological Administration", description: "Earn the Running Balls and find the 4 Running Man umbrellas.", url: `${STREAM_HOST}/dl/6acc005d6e979983cdce5571` },
            { title: "Episod 21: Gwangmyeong Station", description: "Earn the running balls and find the 5 train tickets.", url: `${STREAM_HOST}/dl/6acc005d6e979983cdce5572` },
            { title: "Episod 22: Lotte Mart (Gwangjin-gu, Seoul)", description: "Earn the Running Balls and find the 4 ornaments and decorate the tree.", url: `${STREAM_HOST}/dl/6acc005e6e979983cdce5573` },
            { title: "Episod 23: Alpensia Ski Resort", description: "Earn the running balls and find the 5 gold medals.", url: `${STREAM_HOST}/dl/6acc00636e979983cdce5574` },
            { title: "Episod 24: Xi Wi City", description: "Running Man episode at Xi Wi City.", url: `${STREAM_HOST}/dl/6acc00686e979983cdce5575` },
            { title: "Episod 25: Museum Comics Information Center", description: "Running Man episode at Museum Comics Information Center, Bucheon.", url: `${STREAM_HOST}/dl/6acc00696e979983cdce5576` },
            { title: "Episod 26: Nakwon Instruments Shopping Center", description: "Running Man episode at Nakwon Instruments Shopping Center, Insadong.", url: `${STREAM_HOST}/dl/6acc00696e979983cdce5577` },
            { title: "Episod 27: Seoul Arts Center", description: "Guests: Chang-min Shim, Jung Yunho.", url: `${STREAM_HOST}/dl/6acc00696e979983cdce5578` },
            { title: "Episod 28: Ansung Natural Resort", description: "Running Man episode at Ansung Natural Resort.", url: `${STREAM_HOST}/dl/6acc00946e979983cdce5579` },
            { title: "Episod 29: COEX Aquarium", description: "Running Man episode at COEX Aquarium, Gangnam.", url: `${STREAM_HOST}/dl/6acc00946e979983cdce557a` },
            { title: "Episod 30: National Center for Korean Traditional Performing Arts", description: "Guests: Choo Shin Soo, Ryu Hyun Jin, Jin Sae Yeon.", url: `${STREAM_HOST}/dl/6acc00996e979983cdce557b` },
            { title: "Episod 31: Alpensia Ocean 700 Water Park", description: "Running Man episode at Ocean 700 Water Park.", url: `${STREAM_HOST}/dl/6acc009a6e979983cdce557c` },
            { title: "Episod 32: Woongjin Think Big Office", description: "Running Man episode at Woongjin Think Big Office, Paju.", url: `${STREAM_HOST}/dl/6acc009f6e979983cdce557d` },
            { title: "Episod 33: Incheon International Airport", description: "Running Man episode at Incheon International Airport.", url: `${STREAM_HOST}/dl/6acc00a06e979983cdce557e` },
            { title: "Episod 34: Hongdae Area", description: "Running Man episode at Hongdae Area, Mapo-gu.", url: `${STREAM_HOST}/dl/6acc00a46e979983cdce557f` },
            { title: "Episod 35: Nanji Camp, Part 1", description: "Running Man episode at Nanji Camp, Sangam-dong.", url: `${STREAM_HOST}/dl/6acc00a46e979983cdce5580` },
            { title: "Episod 36: Nanji Camp, Part 2", description: "Running Man episode continuing at Nanji Camp.", url: `${STREAM_HOST}/dl/6acc00a56e979983cdce5581` },
            { title: "Episod 37: Metapolis", description: "Running Man episode at Metapolis, Hwaseong.", url: `${STREAM_HOST}/dl/6acc00a56e979983cdce5582` },
            { title: "Episod 38: Seoul Medical Center", description: "Running Man episode at Seoul Medical Center.", url: `${STREAM_HOST}/dl/6acc00d06e979983cdce5583` },
            { title: "Episod 39: Seoul Folk Flea Market", description: "Running Man episode at Seoul Folk Flea Market.", url: `${STREAM_HOST}/dl/6acc00d56e979983cdce5584` },
            { title: "Episod 40: Petite France", description: "Running Man episode at Petite France, Gapyeong.", url: `${STREAM_HOST}/dl/6acc00d66e979983cdce5585` },
            { title: "Episod 41: National Digital Library of Korea", description: "Guest: Lee Sun-kyun.", url: `${STREAM_HOST}/dl/6acc00da6e979983cdce5586` },
            { title: "Episod 42: SBS Tanhyeon-dong Production Center", description: "Running Man episode at SBS Production Center.", url: `${STREAM_HOST}/dl/6acc00db6e979983cdce5587` },
            { title: "Episod 43: Daegu Stadium", description: "Guest: IU.", url: `${STREAM_HOST}/dl/6acc00dc6e979983cdce5588` },
            { title: "Episod 44: Cheil Worldwide Building, Part 1", description: "Running Man episode at Cheil Worldwide Building, Itaewon.", url: `${STREAM_HOST}/dl/6acc00e06e979983cdce5589` },
            { title: "Episod 45: Cheil Worldwide Building, Part 2", description: "Continuing race at Cheil Worldwide Building.", url: `${STREAM_HOST}/dl/6acc00e06e979983cdce558a` },
            { title: "Episod 46: Kyobo Book Center, Part 1", description: "Running Man episode at Kyobo Book Center.", url: `${STREAM_HOST}/dl/6acc00e06e979983cdce558b` },
            { title: "Episod 47: Kyobo Book Center, Part 2", description: "Continuing race at Kyobo Book Center.", url: `${STREAM_HOST}/dl/6acc00e66e979983cdce558c` },
            { title: "Episod 48: National Museum of Korea", description: "Running Man episode at National Museum of Korea.", url: `${STREAM_HOST}/dl/6acc010d6e979983cdce558d` },
            { title: "Episod 49: Dream Forest", description: "Running Man episode at Dream Forest, Gangbuk-gu.", url: `${STREAM_HOST}/dl/6acc01116e979983cdce558e` },
            { title: "Episod 50: Bangkok, Thailand", description: "Special Overseas episode in Bangkok, Thailand.", url: `${STREAM_HOST}/dl/6acc01136e979983cdce558f` },
            { title: "Episod 51: Pattaya, Thailand", description: "Special Overseas episode in Pattaya, Thailand.", url: `${STREAM_HOST}/dl/6acc01136e979983cdce5590` },
            { title: "Episod 52: Gyeongju World", description: "Running Man episode at Gyeongju World.", url: `${STREAM_HOST}/dl/6acc01176e979983cdce5591` },
            { title: "Episod 53: Blue One Resort", description: "Running Man episode at Blue One Resort, Gyeongju.", url: `${STREAM_HOST}/dl/6acc01176e979983cdce5592` },
            { title: "Episod 54: 63 Building", description: "Protect the Boss Challenge at 63 Building, Yeouido.", url: `${STREAM_HOST}/dl/6acc01186e979983cdce5593` },
            { title: "Episod 55: Wootdali Culture Village, Part 1", description: "Running Man episode at Wootdali Culture Village, Pyeongtaek.", url: `${STREAM_HOST}/dl/6acc011d6e979983cdce5594` },
            { title: "Episod 56: Wootdali Culture Village, Part 2", description: "Continuing at Wootdali Culture Village.", url: `${STREAM_HOST}/dl/6acc01226e979983cdce5595` },
            { title: "Episod 57: Jeju-do, Part 1", description: "Special Race in Jeju Island.", url: `${STREAM_HOST}/dl/6acc01486e979983cdce5596` },
            { title: "Episod 58: Jeju-do, Part 2", description: "Continuing Special Race in Jeju Island.", url: `${STREAM_HOST}/dl/6acc01496e979983cdce5597` },
            { title: "Episod 59: Old Seoul Station", description: "Running Man episode at Old Seoul Station.", url: `${STREAM_HOST}/dl/6acc014d6e979983cdce5598` },
            { title: "Episod 60: D-Cube City", description: "Running Man episode at D-Cube City, Sindorim.", url: `${STREAM_HOST}/dl/6acc01526e979983cdce5599` },
            { title: "Episod 61: Beijing, China, Part 1", description: "Special Overseas episode in Beijing, China.", url: `${STREAM_HOST}/dl/6acc01546e979983cdce559a` },
            { title: "Episod 62: Beijing, China, Part 2", description: "Continuing Overseas episode in Beijing, China.", url: `${STREAM_HOST}/dl/6acc01556e979983cdce559b` },
            { title: "Episod 63: Goyang, Gyeonggi-do", description: "Running Man episode at Goyang.", url: `${STREAM_HOST}/dl/6acc01586e979983cdce559c` },
            { title: "Episod 64: Paju English Village", description: "Running Man episode at Paju English Village.", url: `${STREAM_HOST}/dl/6acc01586e979983cdce559f` },
            { title: "Episod 65: Baekje Military Museum", description: "Running Man episode at Baekje Military Museum, Nonsan.", url: `${STREAM_HOST}/dl/6acc01586e979983cdce559e` },
            { title: "Episod 66: Hangang Park", description: "Running Man episode at Hangang Park, Yeouido.", url: `${STREAM_HOST}/dl/6acc01586e979983cdce559d` },
            { title: "Episod 67: Gungpyeong Village", description: "Running Man episode at Gungpyeong Village, Hwaseong.", url: `${STREAM_HOST}/dl/6acc015d6e979983cdce55a0` },
            { title: "Episod 68: Canal Walk, Songdo", description: "Running Man episode at Canal Walk, Incheon.", url: `${STREAM_HOST}/dl/6acc015e6e979983cdce55a1` },
            { title: "Episod 69: Incheon Culture & Arts Center", description: "Running Man episode at Incheon Culture & Arts Center.", url: `${STREAM_HOST}/dl/6acc01896e979983cdce55a2` },
            { title: "Episod 70: KT Building, Bundang", description: "Guests: Son Ye-jin, Lee Min-ki.", url: `${STREAM_HOST}/dl/6acc01896e979983cdce55a3` },
            { title: "Episod 71: Gyeonghui Palace", description: "Running Man episode at Gyeonghui Palace, Seoul.", url: `${STREAM_HOST}/dl/6acc01896e979983cdce55a4` },
            { title: "Episod 72: Hongkong, China, Part 1", description: "Special Overseas episode in Hongkong.", url: `${STREAM_HOST}/dl/6acc018f6e979983cdce55a5` },
            { title: "Episod 73: Hongkong, China, Part 2", description: "Continuing Special Overseas episode in Hongkong.", url: `${STREAM_HOST}/dl/6acc01946e979983cdce55a6` },
            { title: "Episod 74: Running Man Survival", description: "Superpower Battle 1.", url: `${STREAM_HOST}/dl/6acc01956e979983cdce55a7` },
            { title: "Episod 75: Paris Park, Mokdong", description: "New Year Special Race.", url: `${STREAM_HOST}/dl/6acc01956e979983cdce55a8` },
            { title: "Episod 76: Yeosu City Hall", description: "Guest: Joo Sang-uk.", url: `${STREAM_HOST}/dl/6acc01956e979983cdce55a9` },
            { title: "Episod 77: Hahwa Island", description: "Running Man episode at Hahwa Island, Yeosu.", url: `${STREAM_HOST}/dl/6acc019b6e979983cdce55aa` },
            { title: "Episod 78: Lotte Mall, Gangseo-gu", description: "Running Man episode at Lotte Mall.", url: `${STREAM_HOST}/dl/6acc01c56e979983cdce55ab` },
            { title: "Episod 79: Club Harmony Cruise Ship", description: "Running Man episode on Club Harmony Cruise Ship, Busan.", url: `${STREAM_HOST}/dl/6acc01c56e979983cdce55ac` },
            { title: "Episod 80: Paradise Spa Dogo", description: "Running Man episode at Paradise Spa Dogo, Asan.", url: `${STREAM_HOST}/dl/6acc01c76e979983cdce55ad` },
            { title: "Episod 81: Songdo Convensia", description: "Gary Kang episode at Songdo Convensia.", url: `${STREAM_HOST}/dl/6acc01c76e979983cdce55ae` },
            { title: "Episod 82: Shinsegae Department Store", description: "Running Man episode at Centum City, Busan.", url: `${STREAM_HOST}/dl/6acc01ca6e979983cdce55af` },
            { title: "Episod 83: Nurimaru APEC House", description: "Running Man episode at Haeundae, Busan.", url: `${STREAM_HOST}/dl/6acc01cb6e979983cdce55b0` },
            { title: "Episod 84: Seodaemun Museum of Natural History", description: "Guest: Choi Seung-hyun (T.O.P BIGBANG).", url: `${STREAM_HOST}/dl/6acc01cb6e979983cdce55b1` },
            { title: "Episod 85: Cheil Industries Fashion Division Head Office", description: "Running Man vs Big Bang Battle.", url: `${STREAM_HOST}/dl/6acc01d06e979983cdce55b3` },
            { title: "Episod 86: SBS Broadcasting Center", description: "Guest: Ha Ji-Won.", url: `${STREAM_HOST}/dl/6acc01d06e979983cdce55b2` },
            { title: "Episod 87: Korea Job World", description: "Running Man episode at Korea Job World, Bundang.", url: `${STREAM_HOST}/dl/6acc01d66e979983cdce55b4` },
            { title: "Episod 88: The Shilla Jeju", description: "Running Man episode at Jeju-do.", url: `${STREAM_HOST}/dl/6acc01d66e979983cdce55b5` },
            { title: "Episod 89: Ilchul Land", description: "Running Man episode at Ilchul Land, Jeju-do.", url: `${STREAM_HOST}/dl/6acc01fd6e979983cdce55b6` },
            { title: "Episod 90: Cheorwon-gun, Gangwon-do", description: "Guest: Lee Deok-hwa.", url: `${STREAM_HOST}/dl/6acc01fd6e979983cdce55b7` },
            { title: "Episod 91: SUNY Korea, Songdo", description: "Yoo Jae-suk Yoomes Bond Returns episode.", url: `${STREAM_HOST}/dl/6acc00fe6e979983cdce55b8` },
            { title: "Episod 92: Somuui Island", description: "Running Man episode at Somuui Island, Incheon.", url: `${STREAM_HOST}/dl/6acc02036e979983cdce55b9` },
            { title: "Episod 93: Seoul Land", description: "Non-stop Voting Race.", url: `${STREAM_HOST}/dl/6acc02036e979983cdce55ba` },
            { title: "Episod 94: Mokdong Wedding Palace", description: "Guests: Haha, Kim Jong-kook, Bae Suzy.", url: `${STREAM_HOST}/dl/6acc02036e979983cdce55bb` },
            { title: "Episod 95: Pantech Building", description: "Running Man episode at Pantech Building, Mapo-gu.", url: `${STREAM_HOST}/dl/6acc02096e979983cdce55bd` },
            { title: "Episod 96: University of Incheon Songdo Campus", description: "Asian Dream Cup Special.", url: `${STREAM_HOST}/dl/6acc02096e979983cdce55bc` },
            { title: "Episod 97: POSCO Global R&D Center", description: "Asian Dream Cup Special Part 2.", url: `${STREAM_HOST}/dl/6acc020e6e979983cdce55be` },
            { title: "Episod 98: Tesco Home Plus Academy", description: "Zombie Race at Muui Island.", url: `${STREAM_HOST}/dl/6acc020e6e979983cdce55bf` },
            { title: "Episod 99: Xi Gallery, Mapo-gu", description: "Lee Kwang-soo Kingdom Race.", url: `${STREAM_HOST}/dl/6acc02396e979983cdce55c0` },
            { title: "Episod 100: Mecenatpolis", description: "Special 100th Episode War of the Gods.", url: `${STREAM_HOST}/dl/6acc023e6e979983cdce55c1` },
            { title: "Episod 101: Korea Institute of Science and Technology", description: "CSI vs Criminals Special Race at KIST.", url: `${STREAM_HOST}/dl/6acc68a46e979983cdce55dd` },
            { title: "Episod 102: SBS Tanhyeon-dong Production Center", description: "Drama Special Gold Turtle Race.", url: `${STREAM_HOST}/dl/6acc68a46e979983cdce55da` },
            { title: "Episod 103: S-Oil Building", description: "Shin Se Kyung, Yoo Joon Sang, and No Sa Yeon join the Running Man cast today.", url: `${STREAM_HOST}/dl/6acc68a46e979983cdce55dc` },
            { title: "Episod 104: Hanseong Baekje Museum", description: "Idol Olympics Special starring 7 K-pop idols.", url: `${STREAM_HOST}/dl/6acc68a46e979983cdce55d9` },
            { title: "Episod 105: Aqua Planet Jeju", description: "Money Backpack Race in Jeju Island.", url: `${STREAM_HOST}/dl/6acc68a46e979983cdce55d8` },
            { title: "Episod 106: Daum Communications Office, Jeju City", description: "Love Compatibility Race.", url: `${STREAM_HOST}/dl/6acc68a46e979983cdce55db` },
            { title: "Episod 107: Yonsei University International Campus", description: "Running Man Gold Statue Search.", url: `${STREAM_HOST}/dl/6acc68ad6e979983cdce55de` },
            { title: "Episod 108: NS Home Shopping Building", description: "All Star Battle: Park Tae-hwan and Son Yeon-jae.", url: `${STREAM_HOST}/dl/6acc68ad6e979983cdce55df` },
            { title: "Episod 109: Herb Island, Pocheon", description: "Olympic Stars Special Part 1.", url: `${STREAM_HOST}/dl/6acc68ad6e979983cdce55e0` },
            { title: "Episod 110: Daejin University", description: "We continue on from last week with Park Tae Hwan and Son Yeon Jae.", url: `${STREAM_HOST}/dl/6acc68ad6e979983cdce55e1` },
            { title: "Episod 111: National Maritime Museum", description: "Busan Special with Im Chang-jung, Lee Jong-won, Son Byung-ho.", url: `${STREAM_HOST}/dl/6acc68b36e979983cdce55e2` },
            { title: "Episod 112: Moorim P&P Paper Mill", description: "Paper Mill Target Race.", url: `${STREAM_HOST}/dl/6acc68b86e979983cdce55e3` },
            { title: "Episod 113: Samcheonggak", description: "Guest: Yoo Hai Jin. Absolute Taste Chuseok Special.", url: `${STREAM_HOST}/dl/6acc68b86e979983cdce55e5` },
            { title: "Episod 114: Culture Park, Yeonsu-gu", description: "X-Man Special Revenge Match.", url: `${STREAM_HOST}/dl/6acc68b86e979983cdce55e4` },
            { title: "Episod 115: Coast Guard Main Station", description: "Coast Guard Training Special with TVXQ.", url: `${STREAM_HOST}/dl/6acc68b96e979983cdce55e7` },
            { title: "Episod 116: Suncheon Open Set", description: "Guest: Ji Sung. The Great Seer Time Travel Race.", url: `${STREAM_HOST}/dl/6acc68b96e979983cdce55e6` },
            { title: "Episod 117: Asian Culture Complex", description: "Guests: Ji Sung, Song Ji-hyo, Bae Suzy. Riddle Race.", url: `${STREAM_HOST}/dl/6acc68e46e979983cdce55e8` },
            { title: "Episod 118: Jungnang Camp Ground", description: "Choi Min-soo Sniper Returns Race.", url: `${STREAM_HOST}/dl/6acc68e96e979983cdce55e9` },
            { title: "Episod 119: Gongrung Youth Baseball Park", description: "Superpower Baseball Special with Ryu Hyun-jin & Choo Shin-soo.", url: `${STREAM_HOST}/dl/6acc68e96e979983cdce55eb` },
            { title: "Episod 120: Poeun Art Hall", description: "Secret Agent Mission with Lee Seung-gi & Park Shin-hye.", url: `${STREAM_HOST}/dl/6acc68e96e979983cdce55ea` },
            { title: "Episod 121: SBS Prism Tower", description: "007 Water Virus Special with Lee Seung-gi.", url: `${STREAM_HOST}/dl/6acc68ef6e979983cdce55ed` },
            { title: "Episod 122: Rockcamp", description: "80s 90s Legendary Singers Special.", url: `${STREAM_HOST}/dl/6acc68ef6e979983cdce55ec` },
            { title: "Episod 123: Song Cham Bong Joseon Village", description: "Kim Soo-ro and Han Hyo-joo Kimchi Race.", url: `${STREAM_HOST}/dl/6acc68ef6e979983cdce55ee` },
            { title: "Episod 124: Jeonju University", description: "King of Kings Gold Race with Han Hyo-joo.", url: `${STREAM_HOST}/dl/6acc68f46e979983cdce55ef` },
            { title: "Episod 125: Busan Christmas Special", description: "Choi Ji-woo Christmas Special in Busan.", url: `${STREAM_HOST}/dl/6acc68f56e979983cdce55f0` },
            { title: "Episod 126: Choi Ji-woo vs Running Man", description: "Cheongju Spy Game featuring CNBLUE & Lee Ki-kwang.", url: `${STREAM_HOST}/dl/6acc68f56e979983cdce55f1` },
            { title: "Episod 127: Jangsado Sea Park", description: "Snake Year Special with Choi Ji-woo, Jung Yong-hwa, Lee Jong-hyun.", url: `${STREAM_HOST}/dl/6acc691f6e979983cdce55f2` },
            { title: "Episod 128: SBS Broadcasting Center", description: "Boy Scouts vs Girl Scouts Battle.", url: `${STREAM_HOST}/dl/6acc69256e979983cdce55f4` },
            { title: "Episod 129: National Institute of Biological Resources", description: "Idol Winter Olympics with SHINee, INFINITE, CNBLUE, MBLAQ.", url: `${STREAM_HOST}/dl/6acc69256e979983cdce55f3` },
            { title: "Episod 130: New Seoul City Hall", description: "No guests. 1938 to 2013, Running Men gets reincarnated.", url: `${STREAM_HOST}/dl/6acc692a6e979983cdce55f5` },
            { title: "Episod 131: Yongyu Train Depot", description: "Guests: Choo Sung-hoon, Lee Si-young Bounty Hunters, challenging to for ddakji.", url: `${STREAM_HOST}/dl/6acc692b6e979983cdce55f6` },
            { title: "Episod 132: Asiana Town", description: "Guests: Hwang Jung-min, Hyuna, Park Sung-woong. Actors vs Singers.", url: `${STREAM_HOST}/dl/6acc692f6e979983cdce55f7` },
            { title: "Episod 133: Macau", description: "Guests: Han Hye-jin, Lee Dong-wook. Asia Race Part I in Macau.", url: `${STREAM_HOST}/dl/6acc692f6e979983cdce55f8` },
            { title: "Episod 134: Keangnam Hanoi Landmark Tower", description: "Guests: Han Hye-jin, Lee Dong-wook. Asia Race Part II, continues in Vietnam.", url: `${STREAM_HOST}/dl/6acc69306e979983cdce55f9` },
            { title: "Episod 135: Kwanghee Fashion Mall", description: "Guests: Jackie Chan, Choi Si-won. Jackie Chan joins as a treasure hunter.", url: `${STREAM_HOST}/dl/6acc69356e979983cdce55fa` },
            { title: "Episod 136: Hoa Lu", description: "Guests: Han Hye-jin, Lee Dong-wook. Asia Race Part III in Vietnam.", url: `${STREAM_HOST}/dl/6acc69606e979983cdce55fb` },
            { title: "Episod 137: Jo in Joo Boxing Club", description: "Noh Sa-yeon and Uee join for a race between the three princesses and their On Dals.", url: `${STREAM_HOST}/dl/6acc69606e979983cdce55fd` },
            { title: "Episod 138: Haewon High School", description: "Guests: Kim Su-ro, Kim Woo-bin, Lee Jong-hyun, Lee Jong-suk, Min Hyo-rin.", url: `${STREAM_HOST}/dl/6acc69606e979983cdce55fc` },
            { title: "Episod 139: The MVL Hotel Kintex", description: "Guests: Go Ara, Lee Yeon-hee. That Winter, the Typhoon Blows mini-series.", url: `${STREAM_HOST}/dl/6acc69666e979983cdce55fe` },
            { title: "Episod 140: Ecoplex", description: "No guests. Running Men must find the vaccine for the Rage Virus outbreak.", url: `${STREAM_HOST}/dl/6acc69666e979983cdce55ff` },
            { title: "Episod 141: Animal Kingdom", description: "King of the Animals special at Everland.", url: `${STREAM_HOST}/dl/6acc696b6e979983cdce5600` },
            { title: "Episod 142: Gwangnaru Safety Experience Center", description: "Best Couple Race with Lee Bo-young & Lee Sang-yoon.", url: `${STREAM_HOST}/dl/6acc696b6e979983cdce5601` },
            { title: "Episod 143: Seoul City Hall", description: "Superpower Karaoke Race with Kim In-kwon, Lee Kyung-kyu.", url: `${STREAM_HOST}/dl/6acc696c6e979983cdce5602` },
            { title: "Episod 144: Namsan Elementary School", description: "Children's Day Special Legendary Ddakji Race.", url: `${STREAM_HOST}/dl/6acc696c6e979983cdce5603` },
            { title: "Episod 145: Gyeonggi English Village Paju Camp", description: "Guests: Jeon Hye-bin, Jeong Jinwoon, Kim Byung-man. Running Men vs Laws of the Jungle.", url: `${STREAM_HOST}/dl/6acc69716e979983cdce5604` },
            { title: "Episod 146: Wolseong Nuclear Energy Information Center", description: "Guests: Kim Sang-kyung, Uhm Jung-hwa. Betrayer Club Arrest Operation.", url: `${STREAM_HOST}/dl/6acc699c6e979983cdce5605` },
            { title: "Episod 147: Sogang University", description: "Guests: Kim Soo-hyun, Lee Hyun-woo. Flower Boy Athletic Tournament.", url: `${STREAM_HOST}/dl/6acc699c6e979983cdce5606` },
            { title: "Episod 148: Gapyeong Gymnasium", description: "Guests: Jeong Jun-ha, So Yi-hyun. Eating Board of Jumanji.", url: `${STREAM_HOST}/dl/6acc69a26e979983cdce5607` },
            { title: "Episod 149: National Folk Museum of Korea", description: "Guests: Kim Soo-mi, Kim Sook, Kwon Ri-se. The race is My love, Gumiho.", url: `${STREAM_HOST}/dl/6acc69a26e979983cdce5608` },
            { title: "Episod 150: Square1", description: "Guests: Choo Sung-hoon, Taecyeon, Chansung. Running Man Avengers Superhero Race.", url: `${STREAM_HOST}/dl/6acc69a36e979983cdce5609` },
            { title: "Episod 151: SBS Broadcasting Center", description: "Guests: Han Hyo-joo, Jung Woo-sung, Lee Jun-ho. King of the Killers.", url: `${STREAM_HOST}/dl/6acc69a86e979983cdce560b` },
            { title: "Episod 152: Baekje Cultural Complex", description: "Guests: Han Hyo-joo, Jung Woo-sung, Lee Jun-ho. Vacances Special.", url: `${STREAM_HOST}/dl/6acc69a86e979983cdce560a` },
            { title: "Episod 153: Korea Polar Research Institute", description: "Guests: Koo Ja-cheol, Park Ji-sung, Sulli. Return of the Captain.", url: `${STREAM_HOST}/dl/6acc69a86e979983cdce560c` },
            { title: "Episod 154: Hongkou Football Stadium", description: "Guests: Park Ji-sung, Patrice Evra, Sulli. Shanghai Dream Cup 2013.", url: `${STREAM_HOST}/dl/6acc69a86e979983cdce560d` },
            { title: "Episod 155: Incheon National University", description: "Guest: Bae Suzy. Destiny's Pairs high school ghost story.", url: `${STREAM_HOST}/dl/6acc69ad6e979983cdce560e` },
            { title: "Episod 156: Hangang Park", description: "Guests: 2NE1, Taeyang. Alien Invasion collect 21 liters of water.", url: `${STREAM_HOST}/dl/6acc69d46e979983cdce560f` },
            { title: "Episod 157: Tangeum Lake International Rowing Stadium", description: "Guests: Ahn Gil-kang, Jung Woong-in. I Hear Your Voice Courtroom Parody.", url: `${STREAM_HOST}/dl/6acc69d46e979983cdce5610` },
            { title: "Episod 158: Goyang Aqua Studio", description: "Guests: Son Hyun-joo, Jeon Mi-seon. Number Hide and Seek.", url: `${STREAM_HOST}/dl/6acc69d46e979983cdce5611` },
            { title: "Episod 159: Yangju, Gyeonggi-do", description: "Guests: John Park, Lim Kim, Sayuri. Strongest Couple Race.", url: `${STREAM_HOST}/dl/6acc69d96e979983cdce5612` },
            { title: "Episod 160: Daeijak Island", description: "Guests: Shinhwa. Ranking Organization vs Pirates.", url: `${STREAM_HOST}/dl/6acc69da6e979983cdce5613` },
            { title: "Episod 161: Seungbong Island", description: "Guests: Shinhwa. Curse of the Gold Pirate Battle.", url: `${STREAM_HOST}/dl/6acc69da6e979983cdce5614` },
            { title: "Episod 162: Old Cheongju Tobacco Factory", description: "Guests: 2PM, Apink, Beast, Girl's Day, Infinite, MBLAQ, Sistar. Idol King Race.", url: `${STREAM_HOST}/dl/6acc69df6e979983cdce5616` },
            { title: "Episod 163: Icheon Art Hall", description: "Guests: Big Bang: Daesung, G-Dragon, Seungri. Stealing Princess Ji-hyo's Heart.", url: `${STREAM_HOST}/dl/6acc69df6e979983cdce5615` },
            { title: "Episod 164: Great Inheritance", description: "Guests: Kim Hae-sook, Yoo Ah-in. Great Inheritance Madame Go family race.", url: `${STREAM_HOST}/dl/6acc69e46e979983cdce5617` },
            { title: "Episod 165: Wabu Middle School", description: "No guests. In Search for the Little Girl mysterious book.", url: `${STREAM_HOST}/dl/6acc69e56e979983cdce5618` },
            { title: "Episod 166: SBS Broadcasting Center II", description: "Guests: Choi Jin-hyuk, Kim Woo-bin, Park Shin-hye. The Heirs company shares.", url: `${STREAM_HOST}/dl/6acc6a106e979983cdce5619` },
            { title: "Episod 167: National Museum of Korean Contemporary History", description: "Guests: Chun Jung-myung, Kim Min-jung. Legend of the Troublemakers.", url: `${STREAM_HOST}/dl/6acc6a116e979983cdce561a` },
            { title: "Episod 168: Suwon World Cup Stadium Swimming Pool", description: "IU and Park Myung-soo wolf and sheep card game.", url: `${STREAM_HOST}/dl/6acc6a156e979983cdce561b` },
            { title: "Episod 169: Mayhills Resort", description: "Guests: Joo Sang-wook, Yang Dong-geun. Find the Key of Freedom.", url: `${STREAM_HOST}/dl/6acc6a156e979983cdce561c` },
            { title: "Episod 170: Samtan Art Mine", description: "Guests: Kim Yoo-jung, T.O.P, Yoon Je-moon. Fellowship of Running Men Oz.", url: `${STREAM_HOST}/dl/6acc6a166e979983cdce561d` },
            { title: "Episod 171: Lotte Outlets Buyeo Store", description: "Guests: Ryu Hyun-jin, EXO. Ryu Hyun-jin's Choice vs EXO.", url: `${STREAM_HOST}/dl/6acc6a1b6e979983cdce561e` },
            { title: "Episod 172: Korean Folk Village", description: "Guests: Ryu Hyun-jin, Bae Suzy. Autumn Overnight Secret Spy Race.", url: `${STREAM_HOST}/dl/6acc6a1b6e979983cdce561f` },
            { title: "Episod 173: Namyangju Little Baseball Park", description: "Guests: Ryu Hyun-jin, Suzy, Kim Hyun-soo. Superpower Baseball.", url: `${STREAM_HOST}/dl/6acc6a1b6e979983cdce5620` },
            { title: "Episod 174: 'R' Warehouse", description: "Guests: Han Hye-jin, Lee Seung-gi, Yoon Bo-ra. The Number 14375.", url: `${STREAM_HOST}/dl/6acc6a206e979983cdce5621` },
            { title: "Episod 175: POSCO Green Building", description: "Guests: Gong Yoo, Park Hee-soon. Suspect Target Race.", url: `${STREAM_HOST}/dl/6acc6a216e979983cdce5622` },
            { title: "Episod 176: SBS Broadcasting Center", description: "Guests: Chang Kiha, Jun Hyun-moo. Men's Popularity Race with Ji-hyo.", url: `${STREAM_HOST}/dl/6acc6a516e979983cdce5623` },
            { title: "Episod 177: Christmas Nightmare", description: "Gil (Leessang) Christmas Nightmare Special.", url: `${STREAM_HOST}/dl/6acc6a526e979983cdce5624` },
            { title: "Episod 178: Han River Crossing Battle", description: "Running Man members vs Production Team Han River Boat Race.", url: `${STREAM_HOST}/dl/6acc6a526e979983cdce5625` },
            { title: "Episod 179: La Cuisine: Part 1", description: "Guests: Lee Dong-wook, John Park, Sungkyu. Cooking Battle Part 1.", url: `${STREAM_HOST}/dl/6acc6a526e979983cdce5626` },
            { title: "Episod 180: La Cuisine: Part 2", description: "Cooking Battle Part 2 with top Korean chefs judging.", url: `${STREAM_HOST}/dl/6acc6a576e979983cdce5627` },
            { title: "Episod 181: Romeo and Juliet", description: "Guests: Lee Jong-suk, Park Bo-young, Lee Se-young. Secret Couple Race.", url: `${STREAM_HOST}/dl/6acc6a576e979983cdce5628` },
            { title: "Episod 182: SBS Tanhyeon-dong Production Center", description: "Guests: Yeo Jin-goo, Yim Si-wan, Dohee. Janggi Race designed by Hong Kong fan.", url: `${STREAM_HOST}/dl/6acc6a576e979983cdce5629` },
            { title: "Episod 183: SBS Broadcasting Center", description: "Guests: Jo Min-su, Moon So-ri, Uhm Jung-hwa. Destined Partner.", url: `${STREAM_HOST}/dl/6acc6a5c6e979983cdce562a` },
            { title: "Episod 184: Winter Olympics", description: "Guests: Park Seo-joon, Baro, Son Ho-jun, Seo In-guk. Winter Olympics Special.", url: `${STREAM_HOST}/dl/6acc6a5c6e979983cdce562b` },
            { title: "Episod 185: Gwacheon National Science Museum", description: "Guest: Kim Hyun-soo. My Love From a Running Star parody.", url: `${STREAM_HOST}/dl/6acc6a5d6e979983cdce562c` },
            { title: "Episod 186: The Shilla Duty Free Shop", description: "Guests: Shim Eun-kyung, CNBLUE. Faces of Seoul Cultural Representatives.", url: `${STREAM_HOST}/dl/6acc6a626e979983cdce562d` },
            { title: "Episod 187: Han River", description: "No guests. 2014 University Boat Race crossing the Han River.", url: `${STREAM_HOST}/dl/6acc6a896e979983cdce562e` },
            { title: "Episod 188: Australian Adventure I", description: "Guests: Kim Woo-bin, Rain. Australia Special Part 1 Shipwreck Treasure.", url: `${STREAM_HOST}/dl/6acc6a8f6e979983cdce562f` },
            { title: "Episod 189: Australian Adventure II", description: "Guests: Kim Woo-bin, Rain. Australia Special Part 2 Seaplanes & Parasails.", url: `${STREAM_HOST}/dl/6acc6a906e979983cdce5631` },
            { title: "Episod 190: Seoul Metropolitan Fire Academy", description: "Guests: Kang Ha-neul, Kim Ji-seok, Seungri. Entertainment vs Drama Rescue Team.", url: `${STREAM_HOST}/dl/6acc6a906e979983cdce5630` },
            { title: "Episod 191: Australian Adventure III", description: "Guests: Kim Woo-bin, Rain. Australia Special Part 3 1854 Gold Rush Sheriffs.", url: `${STREAM_HOST}/dl/6acc6a946e979983cdce5632` },
            { title: "Episod 192: Ttangkkeut Auto Camp I", description: "Cross Country Race. Team up with guests traveling across Korea for tents.", url: `${STREAM_HOST}/dl/6acc6a956e979983cdce5633` },
            { title: "Episod 193: Ttangkkeut Auto Camp II", description: "Mafia vs Civilian Part 1. High stakes psychological voting game.", url: `${STREAM_HOST}/dl/6acc6a956e979983cdce5634` },
            { title: "Episod 194: Ttangkkeut Auto Camp III", description: "Mafia vs Civilian Part 2. Final scramble to find the hidden Mafia.", url: `${STREAM_HOST}/dl/6acc6a9a6e979983cdce5635` },
            { title: "Episod 195: Seoul Energy Dream Center", description: "Guests: 2NE1, 2PM, Mystic89. MC Yoo Live Showdown Relay.", url: `${STREAM_HOST}/dl/6acc6a9a6e979983cdce5636` },
            { title: "Episod 196: Severance Hospital", description: "No guests. Time Travel returning to past iconic episodes.", url: `${STREAM_HOST}/dl/6acc6ac96e979983cdce5637` },
            { title: "Episod 197: Jamsil Students' Gymnasium", description: "National College Ddakji Tournament with Apink & university students.", url: `${STREAM_HOST}/dl/6acc6aca6e979983cdce5638` },
            { title: "Episod 198: Couple Race: Romancing the Stones", description: "Guests: Minah, Park Seo-joon, Ha Yeon-soo. Absolute Love Couple Race.", url: `${STREAM_HOST}/dl/6acc6acb6e979983cdce5639` },
            { title: "Episod 199: Asian Dream Cup 2014 Special", description: "Guests: Park Ji-sung, Cha Bum-kun, idol soccer stars. Training for Dream Cup.", url: `${STREAM_HOST}/dl/6acc6ace6e979983cdce563b` },
            { title: "Episod 200: Taman Safari Indonesia", description: "Guests: Park Ji-sung, Cha Bum-kun. Asian Dream Cup Penalty Race in Indonesia.", url: `${STREAM_HOST}/dl/6acc6ace6e979983cdce563a` },
            { title: "Episode 201: Ganghwado", url: `${STREAM_HOST}/dl/6acc76e46e979983cdce563d` },
            { title: "Episode 202: BlueOne Water Park (Bodeok-dong, Gyeongju, Gyeongsangbuk-do)", url: `${STREAM_HOST}/dl/6acc76e56e979983cdce5641` },
            { title: "Episode 203: Hwasan Elementary School", url: `${STREAM_HOST}/dl/6acc76e46e979983cdce563c` },
            { title: "Episode 204: Petite France", url: `${STREAM_HOST}/dl/6acc76e46e979983cdce5640` },
            { title: "Episode 205: The Best Part-Time Job", url: `${STREAM_HOST}/dl/6acc76e46e979983cdce563e` },
            { title: "Episode 206: Ranne Chef Academy", url: `${STREAM_HOST}/dl/6acc76e46e979983cdce563f` },
            { title: "Episode 207: Nongshim Theme Park", url: `${STREAM_HOST}/dl/6acc76ed6e979983cdce5643` },
            { title: "Episode 208: Hyundai Department Store", url: `${STREAM_HOST}/dl/6acc76ed6e979983cdce5642` },
            { title: "Episode 209: The Triangle Mystery", url: `${STREAM_HOST}/dl/6acc76ed6e979983cdce5644` },
            { title: "Episode 210: SBS Prism Tower", url: `${STREAM_HOST}/dl/6acc76ed6e979983cdce5645` },
            { title: "Episode 211: Incheon Children's Museum", url: `${STREAM_HOST}/dl/6acc76f36e979983cdce5646` },
            { title: "Episode 212: Leofoo Village Theme Park", url: `${STREAM_HOST}/dl/6acc76f86e979983cdce5647` },
            { title: "Episode 213: It's Okay, That's Chaebol", url: `${STREAM_HOST}/dl/6acc76f86e979983cdce5648` },
            { title: "Episode 214: R-POP Star Race Special", url: `${STREAM_HOST}/dl/6acc76f86e979983cdce5649` },
            { title: "Episode 215: October Bride", url: `${STREAM_HOST}/dl/6acc76f96e979983cdce564b` },
            { title: "Episode 216: Running Heroes", url: `${STREAM_HOST}/dl/6acc76f96e979983cdce564a` },
            { title: "Episode 217: The Death Bingo Race", url: `${STREAM_HOST}/dl/6acc77296e979983cdce564c` },
            { title: "Episode 218: Suwon Cultural Foundation SK Atrium", url: `${STREAM_HOST}/dl/6acc772b6e979983cdce564e` },
            { title: "Episode 219: The Return of the Queen", url: `${STREAM_HOST}/dl/6acc772b6e979983cdce564d` },
            { title: "Episode 220: Best Couple Humanity", url: `${STREAM_HOST}/dl/6acc772b6e979983cdce564f` },
            { title: "Episode 221: King of Events Race", url: `${STREAM_HOST}/dl/6acc772e6e979983cdce5650` },
            { title: "Episode 222: Running Wars", url: `${STREAM_HOST}/dl/6acc772e6e979983cdce5651` },
            { title: "Episode 223: Salarymen Super Race", url: `${STREAM_HOST}/dl/6acc77346e979983cdce5652` },
            { title: "Episode 224: Two-Faced Angels", url: `${STREAM_HOST}/dl/6acc77346e979983cdce5653` },
            { title: "Episode 225: National Museum of Korea", url: `${STREAM_HOST}/dl/6acc77346e979983cdce5654` },
            { title: "Episode 226: Take Care of Our Mother", url: `${STREAM_HOST}/dl/6acc77606e979983cdce5655` },
            { title: "Episode 227: The Return of the Monster", url: `${STREAM_HOST}/dl/6acc77666e979983cdce5656` },
            { title: "Episode 228: Weather Race", url: `${STREAM_HOST}/dl/6acc77676e979983cdce5657` },
            { title: "Episode 229: Making Couple Race", url: `${STREAM_HOST}/dl/6acc77676e979983cdce5659` },
            { title: "Episode 230: Flower Boys' Crush Report", url: `${STREAM_HOST}/dl/6acc77676e979983cdce5658` },
            { title: "Episode 231: Yoomes Bond: The Successor", url: `${STREAM_HOST}/dl/6acc776b6e979983cdce565a` },
            { title: "Episode 232: Best Friends Race - Gold or Friendship?", url: `${STREAM_HOST}/dl/6acc776c6e979983cdce565b` },
            { title: "Episode 233: SBS Open Hall", url: `${STREAM_HOST}/dl/6acc776c6e979983cdce565c` },
            { title: "Episode 234: 2015 New Year Cooking Battle Part 1", url: `${STREAM_HOST}/dl/6acc77716e979983cdce565d` },
            { title: "Episode 235: 2015 New Year Cooking Battle Part 2", url: `${STREAM_HOST}/dl/6acc77716e979983cdce565f` },
            { title: "Episode 236: The Real Man Competition", url: `${STREAM_HOST}/dl/6acc77716e979983cdce565e` },
            { title: "Episode 237: The Greatest Love Race", url: `${STREAM_HOST}/dl/6acc77a16e979983cdce5660` },
            { title: "Episode 238: Water Fairy Race", url: `${STREAM_HOST}/dl/6acc77a66e979983cdce5661` },
            { title: "Episode 239: The Dark Night Race", url: `${STREAM_HOST}/dl/6acc77a76e979983cdce5662` },
            { title: "Episode 240: Protect the 20 Year Old Big Nose Brother", url: `${STREAM_HOST}/dl/6acc77a86e979983cdce5663` },
            { title: "Episode 241: The Secret Alumni Race", url: `${STREAM_HOST}/dl/6acc77ac6e979983cdce5664` },
            { title: "Episode 242: Running Man Global Mission Tour", url: `${STREAM_HOST}/dl/6acc77ac6e979983cdce5666` },
            { title: "Episode 243: The Hottest Icon Race", url: `${STREAM_HOST}/dl/6acc77ac6e979983cdce5665` },
            { title: "Episode 244: M Palace Wedding Hall", url: `${STREAM_HOST}/dl/6acc77b06e979983cdce5667` },
            { title: "Episode 245: The Toy Race with Jinusean", url: `${STREAM_HOST}/dl/6acc77b16e979983cdce5669` },
            { title: "Episode 246: Kidnapped Actress-The Secret of a Fake Detective", url: `${STREAM_HOST}/dl/6acc77b16e979983cdce5668` },
            { title: "Episode 247: Happy Kwangsoo Day!", url: `${STREAM_HOST}/dl/6acc77e16e979983cdce566a` },
            { title: "Episode 248: The Polar Opposites Penalty Race", url: `${STREAM_HOST}/dl/6acc77e16e979983cdce566b` },
            { title: "Episode 249: Jjajang Road: The Blacklist Race", url: `${STREAM_HOST}/dl/6acc77e16e979983cdce566c` },
            { title: "Episode 250: Dashing Through Time", url: `${STREAM_HOST}/dl/6acc77e76e979983cdce566d` },
            { title: "Episode 251: Love and War", url: `${STREAM_HOST}/dl/6acc77ec6e979983cdce566e` },
            { title: "Episode 252: High School King", url: `${STREAM_HOST}/dl/6acc77ec6e979983cdce566f` },
            { title: "Episode 253: Love Vacation", url: `${STREAM_HOST}/dl/6acc77ec6e979983cdce5670` },
            { title: "Episode 254: Welcome to the Game World", url: `${STREAM_HOST}/dl/6acc77ec6e979983cdce5671` },
            { title: "Episode 255: Queen of Early Summer Race", url: `${STREAM_HOST}/dl/6acc77f16e979983cdce5672` },
            { title: "Episode 256: Come Over to My Place", url: `${STREAM_HOST}/dl/6acc77f26e979983cdce5673` },
            { title: "Episode 257: The Battle of Heroes Race", url: `${STREAM_HOST}/dl/6acc78196e979983cdce5674` },
            { title: "Episode 258: Find Your Identity: Police vs. Mafia", url: `${STREAM_HOST}/dl/6acc781a6e979983cdce5675` },
            { title: "Episode 259: The Actress Casting Call Competition", url: `${STREAM_HOST}/dl/6acc781f6e979983cdce5676` },
            { title: "Episode 260: The Million Seller Race (5th Anniversary Special Part 1)", url: `${STREAM_HOST}/dl/6acc781f6e979983cdce5677` },
            { title: "Episode 261: Please, Find Me! (5th Anniversary Special Part 2)", url: `${STREAM_HOST}/dl/6acc78246e979983cdce5678` },
            { title: "Episode 262: Cab Drivers' Favorite Restaurant Expedition!", url: `${STREAM_HOST}/dl/6acc78256e979983cdce5679` },
            { title: "Episode 263: Beautiful Youth Race", url: `${STREAM_HOST}/dl/6acc78296e979983cdce567a` },
            { title: "Episode 264: The Legendary Detectives Race", url: `${STREAM_HOST}/dl/6acc782a6e979983cdce567b` },
            { title: "Episode 265: Escape from the Desert Island", url: `${STREAM_HOST}/dl/6acc782a6e979983cdce567c` },
            { title: "Episode 266: Rest Stop Specialty Food Tour", url: `${STREAM_HOST}/dl/6acc78566e979983cdce567d` },
            { title: "Episode 267: Running Man Special: Consensus", url: `${STREAM_HOST}/dl/6acc78566e979983cdce567e` },
            { title: "Episode 268: The Legendary Couple Ring Race", url: `${STREAM_HOST}/dl/6acc785b6e979983cdce567f` },
            { title: "Episode 269: The Legacy", url: `${STREAM_HOST}/dl/6acc785b6e979983cdce5680` },
            { title: "Episode 270: The Mysterious Host", url: `${STREAM_HOST}/dl/6acc785e6e979983cdce5681` },
            { title: "Episode 271: 100 vs. 100 Name Tag Elimination Game: Part 1", url: `${STREAM_HOST}/dl/6acc78616e979983cdce5683` },
            { title: "Episode 272: 100 vs. 100 Name Tag Elimination Game: Part 2", url: `${STREAM_HOST}/dl/6acc78616e979983cdce5682` },
            { title: "Episode 273: The Laughter War Race", url: `${STREAM_HOST}/dl/6acc78686e979983cdce5685` },
            { title: "Episode 274: Chain Link Camping", url: `${STREAM_HOST}/dl/6acc78676e979983cdce5684` },
            { title: "Episode 275: The Rival Big Match", url: `${STREAM_HOST}/dl/6acc78696e979983cdce5686` },
            { title: "Episode 276: Lost in Seoul", url: `${STREAM_HOST}/dl/6acc78926e979983cdce5687` },
            { title: "Episode 277: The Zombie Virus Race", url: `${STREAM_HOST}/dl/6acc78966e979983cdce5688` },
            { title: "Episode 278: X-Man Collaboration Special: Part 1", url: `${STREAM_HOST}/dl/6acc78966e979983cdce5689` },
            { title: "Episode 279: X-Man Collaboration Special: Part 2 +2016 Luck Battle", url: `${STREAM_HOST}/dl/6acc78966e979983cdce568b` },
            { title: "Episode 280: SNS Reply Race", url: `${STREAM_HOST}/dl/6acc78966e979983cdce568a` },
            { title: "Episode 281: The House - The Heir Game", url: `${STREAM_HOST}/dl/6acc789c6e979983cdce568c` },
            { title: "Episode 282: A Tale of Running Man in Winter", url: `${STREAM_HOST}/dl/6acc78a26e979983cdce568d` },
            { title: "Episode 283: FC Running Man in Shanghai", url: `${STREAM_HOST}/dl/6acc78a26e979983cdce568e` },
            { title: "Episode 284: 10 Secret Society", url: `${STREAM_HOST}/dl/6acc78a26e979983cdce5690` },
            { title: "Episode 285: The 5th Strongest Running Man Competition", url: `${STREAM_HOST}/dl/6acc78a26e979983cdce568f` },
            { title: "Episode 286: Mystery Mountain Cabin & 7 Detectives", url: `${STREAM_HOST}/dl/6acc78d26e979983cdce5691` },
            { title: "Episode 287: 12 Years Older Intern", url: `${STREAM_HOST}/dl/6acc78d26e979983cdce5692` },
            { title: "Episode 288: Running Man Wish List Special 1 - 7 Spoons", url: `${STREAM_HOST}/dl/6acc78d36e979983cdce5693` },
            { title: "Episode 289: Running Man Free Tour in Dubai; Part 1", url: `${STREAM_HOST}/dl/6acc78d46e979983cdce5694` },
            { title: "Episode 290: Running Man Dubai Special - Sandglass Race; Part 2", url: `${STREAM_HOST}/dl/6acc78d46e979983cdce5695` },
            { title: "Episode 291: Running Man Q&A", url: `${STREAM_HOST}/dl/6acc78d96e979983cdce5697` },
            { title: "Episode 292: Running Man 1st Unlucky Hand Festival", url: `${STREAM_HOST}/dl/6acc78d96e979983cdce5696` },
            { title: "Episode 293: Majority Rule, Dangerous Unaminity Race", url: `${STREAM_HOST}/dl/6acc78de6e979983cdce5699` },
            { title: "Episode 294: Robot War: Running Man vs. Machine", url: `${STREAM_HOST}/dl/6acc78de6e979983cdce5698` },
            { title: "Episode 295: I Am Sorry, I Love You Special-Running Man A/S; Part 1", url: `${STREAM_HOST}/dl/6acc78e36e979983cdce569a` },
            { title: "Episode 296: I Am Sorry, I Love You Special - 7 Loves; Part 2", url: `${STREAM_HOST}/dl/6acc78e36e979983cdce569b` },
            { title: "Episode 297: After Sunset Race", url: `${STREAM_HOST}/dl/6acc790a6e979983cdce569c` },
            { title: "Episode 298: Finding No Man Race", url: `${STREAM_HOST}/dl/6acc790a6e979983cdce569d` },
            { title: "Episode 299: Center War", url: `${STREAM_HOST}/dl/6acc790f6e979983cdce569e` },
            { title: "Episode 300: 7 vs. 300: Part 1", url: `${STREAM_HOST}/dl/6acc79106e979983cdce569f` },
            { title: "Episode 301: 7 vs. 300: Part 2", url: `${STREAM_HOST}/dl/6acc79166e979983cdce56a0` },
            { title: "Episode 302: Dangerous Table", url: `${STREAM_HOST}/dl/6acc79166e979983cdce56a1` },
            { title: "Episode 303: Running Man Hunting", url: `${STREAM_HOST}/dl/6acc79176e979983cdce56a2` },
            { title: "Episode 304: Oh My Goddess", url: `${STREAM_HOST}/dl/6acc791b6e979983cdce56a3` },
            { title: "Episode 305: Running Man vs Avengers", url: `${STREAM_HOST}/dl/6acc791b6e979983cdce56a4` },
            { title: "Episode 306: Strange Rescue Team", url: `${STREAM_HOST}/dl/6acc791b6e979983cdce56a5` },
            { title: "Episode 307: Summer MT Special - 'Thumbs Up' Couple Race", url: `${STREAM_HOST}/dl/6acc79466e979983cdce56a6` },
            { title: "Episode 308: Special Agent H - The Next to Last Person", url: `${STREAM_HOST}/dl/6acc794b6e979983cdce56a7` },
            { title: "Episode 309: Kwang-soo Strikes Back", url: `${STREAM_HOST}/dl/6acc794c6e979983cdce56a8` },
            { title: "Episode 310: Representative Player Contest Race: Part 1", url: `${STREAM_HOST}/dl/6acc794c6e979983cdce56a9` },
            { title: "Episode 311: Representative Player Contest Race: Part 2 + Mystery Cube Adventure", url: `${STREAM_HOST}/dl/6acc79506e979983cdce56aa` },
            { title: "Episode 312: Monthly Running Man", url: `${STREAM_HOST}/dl/6acc79516e979983cdce56ab` },
            { title: "Episode 313: Running Woman", url: `${STREAM_HOST}/dl/6acc79516e979983cdce56ac` },
            { title: "Episode 314: Game Of Throne", url: `${STREAM_HOST}/dl/6acc79566e979983cdce56ad` },
            { title: "Episode 315: Running Map", url: `${STREAM_HOST}/dl/6acc79566e979983cdce56ae` },
            { title: "Episode 316: Train to Prison", url: `${STREAM_HOST}/dl/6acc79876e979983cdce56af` },
            { title: "Episode 317: Avengers 2: Lee Kyung-Kyu Strikes Back", url: `${STREAM_HOST}/dl/6acc79886e979983cdce56b0` },
            { title: "Episode 318: Running Man TV", url: `${STREAM_HOST}/dl/6acc79896e979983cdce56b1` },
            { title: "Episode 319: Running Man GO", url: `${STREAM_HOST}/dl/6acc79896e979983cdce56b2` },
            { title: "Episode 320: Hangul Proclamation Day Special Race", url: `${STREAM_HOST}/dl/6acc798d6e979983cdce56b3` },
            { title: "Episode 321: Can't Get Out MT Race", url: `${STREAM_HOST}/dl/6acc798d6e979983cdce56b4` },
            { title: "Episode 322: Running Man Autumn Sports Day", url: `${STREAM_HOST}/dl/6acc798d6e979983cdce56b5` },
            { title: "Episode 323: My Avatar Can", url: `${STREAM_HOST}/dl/6acc79926e979983cdce56b6` },
            { title: "Episode 324: Goodbye Gary", url: `${STREAM_HOST}/dl/6acc79936e979983cdce56b7` }
        ])
    },
    "running_man_2_catalog": {
        id: "running_man_2",
        catalogId: "running_man_2_catalog",
        name: "Runningman 325-345",
        poster: "https://i.postimg.cc/fRf1pNRR/6RM.jpg",
        background: "https://i.postimg.cc/fRf1pNRR/6RM.jpg",
        backgroundShape: "Landscape",
        description: "Koleksi Episod Running Man (Episod 325-345). Cast : Yoo Jae Suk, Ji Seok Jin, Kim Jong Kook, HaHa, Lee Kwang Soo & Song Ji Hyo.",
        episodes: createEpisodes([
            { title: "Running Man Ep 325: Deficiency Travel", url: `${STREAM_HOST}/dl/6acc7a676e979983cdce56b9` },
            { title: "Running Man Ep 326: Steamed Rice Stealer Race", url: `${STREAM_HOST}/dl/6acc7a676e979983cdce56b8` },
            { title: "Running Man Ep 327: Bromance War", url: `${STREAM_HOST}/dl/6acc7a676e979983cdce56bb` },
            { title: "Running Man Ep 328: Busan Vacation", url: `${STREAM_HOST}/dl/6acc7a676e979983cdce56ba` },
            { title: "Running Man Ep 329: United Or Divided; Part 1", url: `${STREAM_HOST}/dl/6acc7a676e979983cdce56bd` },
            { title: "Running Man Ep 330: Jeonju Tour; Part 2", url: `${STREAM_HOST}/dl/6acc7a676e979983cdce56bc` },
            { title: "Running Man Ep 331: Bad Santa Christmas Special", url: `${STREAM_HOST}/dl/6acc7a706e979983cdce56bf` },
            { title: "Running Man Ep 332: 2017 Running Man's New Ceremony", url: `${STREAM_HOST}/dl/6acc7a706e979983cdce56c0` },
            { title: "Running Man Ep 333: Member's Week 1 - Song Ji-hyo", url: `${STREAM_HOST}/dl/6acc7a6f6e979983cdce56be` },
            { title: "Running Man Ep 334: Member's Week 2 - Kim Jong-kook", url: `${STREAM_HOST}/dl/6acc7a706e979983cdce56c1` },
            { title: "Running Man Ep 335: Member's Week 3 - Ji Suk-jin", url: `${STREAM_HOST}/dl/6acc7a756e979983cdce56c2` },
            { title: "Running Man Ep 336: Member's Week 4", url: `${STREAM_HOST}/dl/6acc7a756e979983cdce56c3` },
            { title: "Running Man Ep 337: Member's Week 5 - HaHa", url: `${STREAM_HOST}/dl/6acc7a7a6e979983cdce56c6` },
            { title: "Running Man Ep 338: Break Week", url: `${STREAM_HOST}/dl/6acc7a7a6e979983cdce56c4` },
            { title: "Running Man Ep 339: Member's Week 6-Yoo Jae-Suk", url: `${STREAM_HOST}/dl/6acc7a7a6e979983cdce56c5` },
            { title: "Running Man Ep 340: Member's Week 7 - Lee Kwang-soo", url: `${STREAM_HOST}/dl/6acc7aa66e979983cdce56c7` },
            { title: "Running Man Ep 341: A Dangerous Deal - Running House", url: `${STREAM_HOST}/dl/6acc7aac6e979983cdce56c8` },
            { title: "Running Man Ep 342: Getting Item Race", url: `${STREAM_HOST}/dl/6acc7aac6e979983cdce56cb` },
            { title: "Running Man Ep 343: Gongju Tour - Couple Race", url: `${STREAM_HOST}/dl/6acc7aac6e979983cdce56c9` },
            { title: "Running Man Ep 344: The Secret of Runchelin", url: `${STREAM_HOST}/dl/6acc7aac6e979983cdce56ca` },
            { title: "Running Man Ep 345: King of the Booking Race", url: `${STREAM_HOST}/dl/6acc7aac6e979983cdce56cc` }
        ])
    },
    "running_man_3_catalog": {
        id: "running_man_3",
        catalogId: "running_man_3_catalog",
        name: "Runningman 346-559",
        poster: "https://i.postimg.cc/j5hJtC8L/RM-P-SMSC.jpg",
        background: "https://i.postimg.cc/Lsfmv8Xm/RM759.jpg",
        backgroundShape: "Landscape",
        description: "Koleksi Episod Running Man (Episod 346 - 559). Cast : Yoo Jae Suk, Ji Seok Jin, Kim Jong Kook, HaHa, Lee Kwang Soo, Song Ji Hyo, Yang Se Chan & Jeon So Min.",
        episodes: createEpisodes([
            { title: "Episode 346 : Global Project - Dangerous Goddess; Part I", url: `${STREAM_HOST}/dl/6acc7e9b6e979983cdce56d0` },
            { title: "Episode 347 : Global Project - Dangerous Goddess; Part II", url: `${STREAM_HOST}/dl/6acc7e9b6e979983cdce56d2` },
            { title: "Episode 348 : Global Project - Dangerous Bag; Part 3", url: `${STREAM_HOST}/dl/6acc7e9b6e979983cdce56d1` },
            { title: "Episode 349 : Global Project - Dangerous Visiting; Part 4", url: `${STREAM_HOST}/dl/6acc7e9b6e979983cdce56cd` },
            { title: "Episode 350 : Global Project - Dangerous Choice; Part 5", url: `${STREAM_HOST}/dl/6acc7e9b6e979983cdce56ce` },
            { title: "Episode 351 : Global Project - Dangerous Banquet; Part 3", url: `${STREAM_HOST}/dl/6acc7e9b6e979983cdce56cf` },
            { title: "Episode 352 : Global Project - Russia & Mongolia; Part 7", url: `${STREAM_HOST}/dl/6acc7ea36e979983cdce56d3` },
            { title: "Episode 353 : Global Project - Russia & Mongolia 2; Part 8", url: `${STREAM_HOST}/dl/6acc7ea36e979983cdce56d6` },
            { title: "Episode 354 : Global Project - Labyrinth of Fear Finale; Part 9", url: `${STREAM_HOST}/dl/6acc7ea36e979983cdce56d5` },
            { title: "Episode 355 : Somewhere 1%: #1 Tour in Tokyo; Part 1", url: `${STREAM_HOST}/dl/6acc7ea36e979983cdce56d4` },
            { title: "Episode 356 : Somewhere 1%: Complete Disagreement Race; Part 2", url: `${STREAM_HOST}/dl/6acc7ea96e979983cdce56d7` },
            { title: "Episode 357 : Somewhere 1%: No.1 Couple Race; Part 3", url: `${STREAM_HOST}/dl/6acc7ea96e979983cdce56d8` },
            { title: "Episode 358 : Somewhere 1%: Protecting I GO Sticker Race; Part 4", url: `${STREAM_HOST}/dl/6acc7eae6e979983cdce56da` },
            { title: "Episode 359 : Somewhere 1%: I GO, STOP Race; Part 5", url: `${STREAM_HOST}/dl/6acc7eae6e979983cdce56db` },
            { title: "Episode 360 : 7th Anniversary Special: Real Family Outing; Part 1", url: `${STREAM_HOST}/dl/6acc7eae6e979983cdce56d9` },
            { title: "Episode 361 : 7th Anniversary Special: Real Family Outing; Part 2", url: `${STREAM_HOST}/dl/6acc7eda6e979983cdce56dc` },
            { title: "Episode 362 : Summer Special: Finding the Boss; Part 1", url: `${STREAM_HOST}/dl/6acc7edf6e979983cdce56de` },
            { title: "Episode 363 : Summer Special: Finding Bad Girls; Part 2", url: `${STREAM_HOST}/dl/6acc7edf6e979983cdce56dd` },
            { title: "Episode 364 : Summer Special: Finding Ghosts; Part 3", url: `${STREAM_HOST}/dl/6acc7ee06e979983cdce56e0` },
            { title: "Episode 365 : Half-and-Half Tour: Half-and-Half Race; Part 1", url: `${STREAM_HOST}/dl/6acc7ee06e979983cdce56df` },
            { title: "Episode 366 : Half-and-Half Tour: Sensing Race; Part 2", url: `${STREAM_HOST}/dl/6acc7ee06e979983cdce56e1` },
            { title: "Episode 367 : Half-and-Half Tour: Public Enemy; Part 3", url: `${STREAM_HOST}/dl/6acc7ee56e979983cdce56e2` },
            { title: "Episode 368 : Half-and-Half Tour: Public Enemy 2; Part 4", url: `${STREAM_HOST}/dl/6acc7eea6e979983cdce56e3` },
            { title: "Episode 369 : Half-and-Half Tour Final: The Hell of Roulette; Part 5", url: `${STREAM_HOST}/dl/6acc7eea6e979983cdce56e4` },
            { title: "Episode 370 : Tiger Moth Tour; Part 1", url: `${STREAM_HOST}/dl/6acc7f166e979983cdce56e5` },
            { title: "Episode 371 : Tiger Moth Tour; Part 2", url: `${STREAM_HOST}/dl/6acc7f166e979983cdce56e6` },
            { title: "Episode 372 : Half-and-Half Tour Pass Race", url: `${STREAM_HOST}/dl/6acc7f166e979983cdce56e7` },
            { title: "Episode 373 : Do Whatever You Want", url: `${STREAM_HOST}/dl/6acc7f1c6e979983cdce56e8` },
            { title: "Episode 374 : City of Outlaws Race; Part 1", url: `${STREAM_HOST}/dl/6acc7f1c6e979983cdce56ea` },
            { title: "Episode 375 : City of Outlaws; Part 2 & Mystery Autumn Trip Race", url: `${STREAM_HOST}/dl/6acc7f1c6e979983cdce56e9` },
            { title: "Episode 376 : Running Man Dongye Olympic Race", url: `${STREAM_HOST}/dl/6acc7f226e979983cdce56eb` },
            { title: "Episode 377 : Return of the Heiress Race", url: `${STREAM_HOST}/dl/6acc7f226e979983cdce56ec` },
            { title: "Episode 378 : Tiger Butterfly Tour; Part 1", url: `${STREAM_HOST}/dl/6acc7f286e979983cdce56ee` },
            { title: "Episode 379 : Tiger Butterfly Tour; Part 2", url: `${STREAM_HOST}/dl/6acc7f286e979983cdce56ed` },
            { title: "Episode 380 : Different Dreams on the Money Race", url: `${STREAM_HOST}/dl/6acc7f526e979983cdce56ef` },
            { title: "Episode 381 : Bad Guys: War Against the Evildoer", url: `${STREAM_HOST}/dl/6acc7f536e979983cdce56f0` },
            { title: "Episode 382 : Christmas Miracle? Christmas Nightmare!", url: `${STREAM_HOST}/dl/6acc7f536e979983cdce56f1` },
            { title: "Episode 383 : Winter Kingdom Survival", url: `${STREAM_HOST}/dl/6acc7f596e979983cdce56f3` },
            { title: "Episode 384 : Mysterious Stone Pouch", url: `${STREAM_HOST}/dl/6acc7f596e979983cdce56f2` },
            { title: "Episode 385 : The New Year Star Wars", url: `${STREAM_HOST}/dl/6acc7f5e6e979983cdce56f4` },
            { title: "Episode 386 : Happiness with 10,000 Won Race (2)", url: `${STREAM_HOST}/dl/6acc7f5f6e979983cdce56f5` },
            { title: "Episode 387 : Together with God - Sin and Punishment", url: `${STREAM_HOST}/dl/6acc7f5f6e979983cdce56f6` },
            { title: "Episode 388 : Rule of Collection (1)", url: `${STREAM_HOST}/dl/6acc7f646e979983cdce56f7` },
            { title: "Episode 389 : Bingo to the Flowery Road (2)", url: `${STREAM_HOST}/dl/6acc7f646e979983cdce56f8` },
            { title: "Episode 390 : Global Random Tour: Part 1", url: `${STREAM_HOST}/dl/6acc7f646e979983cdce56f9` },
            { title: "Episode 391 : Global Random Tour: Part 2", url: `${STREAM_HOST}/dl/6acc7f646e979983cdce56fa` },
            { title: "Episode 392 : Global Random Tour: Part 3/Family Package Project: Part 1", url: `${STREAM_HOST}/dl/6acc7f936e979983cdce56fb` },
            { title: "Episode 393 : Family Package Project: Part 2 - The Curse of the Diamonds", url: `${STREAM_HOST}/dl/6acc7f936e979983cdce56fc` },
            { title: "Episode 394 : Family Package Part 3: The Lost Sticker?", url: `${STREAM_HOST}/dl/6acc7f946e979983cdce56fd` },
            { title: "Episode 395 : Family Package: Part 4 - Find the Coaches", url: `${STREAM_HOST}/dl/6acc7f986e979983cdce56fe` },
            { title: "Episode 396 : Family Package: Part 5 - Steel House; Get Out Race", url: `${STREAM_HOST}/dl/6acc7f996e979983cdce56ff` },
            { title: "Episode 397 : TV Rating Notice Race: Part 2", url: `${STREAM_HOST}/dl/6acc7f9d6e979983cdce5700` },
            { title: "Episode 398 : Running 365 Retreat", url: `${STREAM_HOST}/dl/6acc7f9e6e979983cdce5702` },
            { title: "Episode 399 : Running 365 Retreat: Part 2/Family Package Project: Part 6 - Secret Doors", url: `${STREAM_HOST}/dl/6acc7f9e6e979983cdce5701` },
            { title: "Episode 400 : Family Package Project: Part 7", url: `${STREAM_HOST}/dl/6acc7fa36e979983cdce5703` },
            { title: "Episode 401 : TV Rating Notice Race: Part 3 - Game of Thrones", url: `${STREAM_HOST}/dl/6acc7fa36e979983cdce5704` },
            { title: "Episode 402 : Zombie Couple Race", url: `${STREAM_HOST}/dl/6acc7fcf6e979983cdce5705` },
            { title: "Episode 403 : Isolated Race", url: `${STREAM_HOST}/dl/6acc7fcf6e979983cdce5706` },
            { title: "Episode 404 : Invigorating Race", url: `${STREAM_HOST}/dl/6acc7fcf6e979983cdce5707` },
            { title: "Episode 405 : Don't Trust Them", url: `${STREAM_HOST}/dl/6acc7fcf6e979983cdce5708` },
            { title: "Episode 406 : Family Package Project: Part 8 - A Sudden Journey", url: `${STREAM_HOST}/dl/6acc7fd56e979983cdce5709` },
            { title: "Episode 407 : Family Package Project: Part 9 - The Unfinished War", url: `${STREAM_HOST}/dl/6acc7fd56e979983cdce570a` },
            { title: "Episode 408 : Family Package Project: Part 10 - Grand Final", url: `${STREAM_HOST}/dl/6acc7fda6e979983cdce570b` },
            { title: "Episode 409 : Summer Waterpark Couple Race", url: `${STREAM_HOST}/dl/6acc7fdb6e979983cdce570c` },
            { title: "Episode 410 : Mission: Impossible", url: `${STREAM_HOST}/dl/6acc7fdb6e979983cdce570d` },
            { title: "Episode 411 : Catch the Petty Thief", url: `${STREAM_HOST}/dl/6acc800c6e979983cdce570e` },
            { title: "Episode 412 : Get Your Number Eights", url: `${STREAM_HOST}/dl/6acc800d6e979983cdce570f` },
            { title: "Episode 413 : Unlucky Vacation", url: `${STREAM_HOST}/dl/6acc80116e979983cdce5710` },
            { title: "Episode 414 : Out Dot Com", url: `${STREAM_HOST}/dl/6acc80116e979983cdce5711` },
            { title: "Episode 415 : Happy Death Day, Along With the Birthdays", url: `${STREAM_HOST}/dl/6acc80116e979983cdce5712` },
            { title: "Episode 416 : Truth or Dare/Eternal Love: Part 1", url: `${STREAM_HOST}/dl/6acc80116e979983cdce5713` },
            { title: "Episode 417 : Dangerous Choice 2: Eternal Love", url: `${STREAM_HOST}/dl/6acc80166e979983cdce5714` },
            { title: "Episode 418 : Dangerous Delivery: Briefcase Delivery", url: `${STREAM_HOST}/dl/6acc80176e979983cdce5715` },
            { title: "Episode 419 : Dangerous Delivery Part 2: The Secret of the Briefcase", url: `${STREAM_HOST}/dl/6acc801c6e979983cdce5716` },
            { title: "Episode 420 : 100 in a Day; Part 1", url: `${STREAM_HOST}/dl/6acc801c6e979983cdce5717` },
            { title: "Episode 421 : 100 in a Day; Part 2", url: `${STREAM_HOST}/dl/6acc80486e979983cdce5719` },
            { title: "Episode 422 : The Legendary Captain", url: `${STREAM_HOST}/dl/6acc80486e979983cdce5718` },
            { title: "Episode 423 : Game of Thrones", url: `${STREAM_HOST}/dl/6acc804d6e979983cdce571a` },
            { title: "Episode 424 : The Nightmare of Halloween", url: `${STREAM_HOST}/dl/6acc804d6e979983cdce5671b` },
            { title: "Episode 425 : Go, Determined Gourmet", url: `${STREAM_HOST}/dl/6acc804e6e979983cdce571c` },
            { title: "Episode 426 : How Well Do You Know Running Man Race?", url: `${STREAM_HOST}/dl/6acc804e6e979983cdce571d` },
            { title: "Episode 427 : Familiar Partner, Finding Thief Race", url: `${STREAM_HOST}/dl/6acc80536e979983cdce571f` },
            { title: "Episode 428 : Kimchi Special: 'Who Is Kimchi's Partner?' Race", url: `${STREAM_HOST}/dl/6acc80536e979983cdce571e` },
            { title: "Episode 429 : Year End Special, Losers Bracket Race", url: `${STREAM_HOST}/dl/6acc80586e979983cdce5720` },
            { title: "Episode 430 : Year End Special Part 2: Once Again Even If You Hate It", url: `${STREAM_HOST}/dl/6acc80586e979983cdce5721` },
            { title: "Episode 431 : Christmas Special: The Miracle of Christmas", url: `${STREAM_HOST}/dl/6acc80586e979983cdce5722` },
            { title: "Episode 432 : Christmas Special - Flirting Santa Claus", url: `${STREAM_HOST}/dl/6acc80846e979983cdce5724` },
            { title: "Episode 433 : RPG: Running Man Playing Game", url: `${STREAM_HOST}/dl/6acc80846e979983cdce5723` },
            { title: "Episode 434 : RPG: The Secret of The Clans", url: `${STREAM_HOST}/dl/6acc80896e979983cdce5726` },
            { title: "Episode 435 : RPG: Catch Me If You Can", url: `${STREAM_HOST}/dl/6acc80896e979983cdce5725` },
            { title: "Episode 436 : RPG: The Last War", url: `${STREAM_HOST}/dl/6acc808a6e979983cdce5727` },
            { title: "Episode 437 : New Year's Special: I Am the King", url: `${STREAM_HOST}/dl/6acc808f6e979983cdce5729` },
            { title: "Episode 438 : The Ace vs The Commander", url: `${STREAM_HOST}/dl/6acc808f6e979983cdce5728` },
            { title: "Episode 439 : Survive To The End", url: `${STREAM_HOST}/dl/6acc80946e979983cdce572a` },
            { title: "Episode 440 : The Secret of 100", url: `${STREAM_HOST}/dl/6acc80946e979983cdce572b` },
            { title: "Episode 441 : The Revenge of the Bee", url: `${STREAM_HOST}/dl/6acc80946e979983cdce572c` },
            { title: "Episode 442 : Running Man College", url: `${STREAM_HOST}/dl/6acc80c66e979983cdce572d` },
            { title: "Episode 443 : Unboxing: The Secret of the Boxes", url: `${STREAM_HOST}/dl/6acc80c66e979983cdce572e` },
            { title: "Episode 444 : Case Number 444: The Invisible Danger", url: `${STREAM_HOST}/dl/6acc80c66e979983cdce572f` },
            { title: "Episode 445 : The Counterattack of Singles: Part 1", url: `${STREAM_HOST}/dl/6acc80c66e979983cdce5730` },
            { title: "Episode 446 : The Counterattack of Singles: Part 2/So Min's Secret Personal Life: Part 1", url: `${STREAM_HOST}/dl/6acc80c86e979983cdce5731` },
            { title: "Episode 447 : One Fine Spring Day", url: `${STREAM_HOST}/dl/6acc80cb6e979983cdce5732` },
            { title: "Episode 448 : Search Running Man", url: `${STREAM_HOST}/dl/6acc80cc6e979983cdce5733` },
            { title: "Episode 449 : Return of Yoomes Bond: A Man of 100,000 Dollars", url: `${STREAM_HOST}/dl/6acc80d06e979983cdce5734` },
            { title: "Episode 450 : Your Name", url: `${STREAM_HOST}/dl/6acc80d06e979983cdce5735` },
            { title: "Episode 451 : Deep-rooted Secret", url: `${STREAM_HOST}/dl/6acc80fc6e979983cdce5736` },
            { title: "Episode 452 : Demon's Whispers", url: `${STREAM_HOST}/dl/6acc80fc6e979983cdce5737` },
            { title: "Episode 453 : 9 Years of Running Man Episode 2: We're Supposed to Be a Family", url: `${STREAM_HOST}/dl/6acc81036e979983cdce5739` },
            { title: "Episode 454 : The Devil Wears Running Shirts", url: `${STREAM_HOST}/dl/6acc81036e979983cdce5738` },
            { title: "Episode 455 : Nine Years of Running Man Part 4: There Was a Miracle", url: `${STREAM_HOST}/dl/6acc81046e979983cdce573a` },
            { title: "Episode 456 : Lyrics Writing Race", url: `${STREAM_HOST}/dl/6acc81086e979983cdce573b` },
            { title: "Episode 457 : Invigorating Food of Alley Restaurant Race", url: `${STREAM_HOST}/dl/6acc81086e979983cdce573c` },
            { title: "Episode 458 : On Our Way to Escort You", url: `${STREAM_HOST}/dl/6acc81086e979983cdce573d` },
            { title: "Episode 459 : Running Project: My Partner is Far Away", url: `${STREAM_HOST}/dl/6acc810e6e979983cdce573e` },
            { title: "Episode 460 : Five Exits: Escape to Live", url: `${STREAM_HOST}/dl/6acc81386e979983cdce573f` },
            { title: "Episode 461 : Episode #1.461", url: `${STREAM_HOST}/dl/6acc81386e979983cdce5740` },
            { title: "Episode 462 : Why Can't You Eat Race", url: `${STREAM_HOST}/dl/6acc813d6e979983cdce5741` },
            { title: "Episode 463 : War of the Deities: Hades' Revenge", url: `${STREAM_HOST}/dl/6acc813e6e979983cdce5742` },
            { title: "Episode 464 : Find the Father", url: `${STREAM_HOST}/dl/6acc81436e979983cdce5743` },
            { title: "Episode 465 : Deity of Games: Don't Trust Anyone", url: `${STREAM_HOST}/dl/6acc81436e979983cdce5744` },
            { title: "Episode 466 : War of Lights: Black and White", url: `${STREAM_HOST}/dl/6acc81436e979983cdce5745` },
            { title: "Episode 467 : Running 9 Project: Running Man 9-Year Anniversary Fan Meeting", url: `${STREAM_HOST}/dl/6acc81486e979983cdce5746` },
            { title: "Episode 468 : Running 9 Project: Spy Game", url: `${STREAM_HOST}/dl/6acc81496e979983cdce5747` },
            { title: "Episode 469 : Running Man 9-Year Anniversary Fan Meeting: The Grand Finale", url: `${STREAM_HOST}/dl/6acc814d6e979983cdce5748` },
            { title: "Episode 470 : What Happened at Their Holiday Spot", url: `${STREAM_HOST}/dl/6acc814d6e979983cdce5749` },
            { title: "Episode 471 : Secret Code: Fall Ambush", url: `${STREAM_HOST}/dl/6acc81756e979983cdce574a` },
            { title: "Episode 472 : What Happened in Anyang", url: `${STREAM_HOST}/dl/6acc81756e979983cdce574b` },
            { title: "Episode 473 : Joker's House", url: `${STREAM_HOST}/dl/6acc817a6e979983cdce574c` },
            { title: "Episode 474 : Betray for the Gold Bars", url: `${STREAM_HOST}/dl/6acc817b6e979983cdce574d` },
            { title: "Episode 475 : Michelin Gourmet Eaters", url: `${STREAM_HOST}/dl/6acc817b6e979983cdce574e` },
            { title: "Episode 476 : Mysterious Animal Farm", url: `${STREAM_HOST}/dl/6acc817f6e979983cdce574f` },
            { title: "Episode 477 : Ghost Story at TV Station: Legendary Proposal Part 1", url: `${STREAM_HOST}/dl/6acc81806e979983cdce5750` },
            { title: "Episode 478 : Ghost Story at TV Station: Legendary Proposal Part 2", url: `${STREAM_HOST}/dl/6acc81806e979983cdce5751` },
            { title: "Episode 479 : Along with Distrust", url: `${STREAM_HOST}/dl/6acc81866e979983cdce5752` },
            { title: "Episode 480 : Run to You: Project to Attract Investments", url: `${STREAM_HOST}/dl/6acc81866e979983cdce5753` },
            { title: "Episode 481 : To Incheon: Catch Me", url: `${STREAM_HOST}/dl/6acc81b06e979983cdce5754` },
            { title: "Episode 482 : Episode #1.482", url: `${STREAM_HOST}/dl/6acc81b56e979983cdce5755` },
            { title: "Episode 483 : Ggannes Film Festival: The Uninvited One", url: `${STREAM_HOST}/dl/6acc81b56e979983cdce5757` },
            { title: "Episode 484 : The Uninvited One", url: `${STREAM_HOST}/dl/6acc81b56e979983cdce5756` },
            { title: "Episode 485 : We Won't Harm You", url: `${STREAM_HOST}/dl/6acc81b56e979983cdce5758` },
            { title: "Episode 486 : Running Martial Arts School: Trade the Cards", url: `${STREAM_HOST}/dl/6acc81bb6e979983cdce5759` },
            { title: "Episode 487 : The Rat Holds the Briefcase with Money", url: `${STREAM_HOST}/dl/6acc81bb6e979983cdce575a` },
            { title: "Episode 488 : Running Man: Tear of Yondu", url: `${STREAM_HOST}/dl/6acc81c06e979983cdce575b` },
            { title: "Episode 489 : Outgoing Race", url: `${STREAM_HOST}/dl/6acc81c16e979983cdce575c` },
            { title: "Episode 490 : RM Countdown", url: `${STREAM_HOST}/dl/6acc81c56e979983cdce575d` },
            { title: "Episode 491 : Decide! Bag, Part 1", url: `${STREAM_HOST}/dl/6acc81f26e979983cdce575e` },
            { title: "Episode 492 : Decide! Bag, Part 2", url: `${STREAM_HOST}/dl/6acc81f36e979983cdce575f` },
            { title: "Episode 493 : Fate Betting Race: Throw Double or Nothing", url: `${STREAM_HOST}/dl/6acc81f76e979983cdce5760` },
            { title: "Episode 494 : Do Whatever You Want! Running MT", url: `${STREAM_HOST}/dl/6acc81f76e979983cdce5761` },
            { title: "Episode 495 : Protect Your Mom: Another Rice Cake to the Ugly Child", url: `${STREAM_HOST}/dl/6acc81f76e979983cdce5762` },
            { title: "Episode 496 : Idol versus Running Man, Center's Dignity", url: `${STREAM_HOST}/dl/6acc81f86e979983cdce5763` },
            { title: "Episode 497 : Race Nobody Can Tell: Hey, You Can Find Out Too!", url: `${STREAM_HOST}/dl/6acc81fc6e979983cdce5764` },
            { title: "Episode 498 : I Saw the Angels and Devils: The Devils' Advocates", url: `${STREAM_HOST}/dl/6acc81fc6e979983cdce5765` },
            { title: "Episode 499 : Seniority Race: Running Man Class", url: `${STREAM_HOST}/dl/6acc82026e979983cdce5766` },
            { title: "Episode 500 : Greedy Camp Race", url: `${STREAM_HOST}/dl/6acc82026e979983cdce5767` },
            { title: "Episode 501 : The 1st Running Man Quiz Strongest Person War", url: `${STREAM_HOST}/dl/6acc82026e979983cdce5768` },
            { title: "Episode 502 : Tiger's Birthday Party", url: `${STREAM_HOST}/dl/6acc822d6e979983cdce5769` },
            { title: "Episode 503 : Festival Money Securing Race: A World of the Festival", url: `${STREAM_HOST}/dl/6acc82fc6e979983cdce578e` },
            { title: "Episode 504 : Crossroads of Choice: Too Much Dilemma", url: `${STREAM_HOST}/dl/6acc822e6e979983cdce576a` },
            { title: "Episode 505 : Eliminating Trespassers: Secret of the Old Village", url: `${STREAM_HOST}/dl/6acc822f6e979983cdce576b` },
            { title: "Episode 506 : Captains of Running Man", url: `${STREAM_HOST}/dl/6acc82336e979983cdce576d` },
            { title: "Episode 507 : Concealed Broker Race: Convenience Store Hot Items", url: `${STREAM_HOST}/dl/6acc82336e979983cdce576c` },
            { title: "Episode 508 : Running Man Loyalty Race: Sharing Playbook", url: `${STREAM_HOST}/dl/6acc82386e979983cdce576e` },
            { title: "Episode 509 : The Superpowers School Race: The Superpowers War: Endgame", url: `${STREAM_HOST}/dl/6acc82386e979983cdce576f` },
            { title: "Episode 510 : Find the Secret of Reincarnation: Reincarnation Camp 2020", url: `${STREAM_HOST}/dl/6acc823d6e979983cdce5770` },
            { title: "Episode 511 : 10th Anniversary Live Broadcast: Provocation by Running Man Thief", url: `${STREAM_HOST}/dl/6acc823d6e979983cdce5771` },
            { title: "Episode 512 : The 1st Tazza Hip Chairman Election: Battle of the Workers", url: `${STREAM_HOST}/dl/6acc826b6e979983cdce5772` },
            { title: "Episode 513 : Capitalistic Race with Partners: Don't Worry Be Happy", url: `${STREAM_HOST}/dl/6acc826b6e979983cdce5773` },
            { title: "Episode 514 : Find My Family Race: Little Sister Is Cannot Stop", url: `${STREAM_HOST}/dl/6acc82716e979983cdce5774` },
            { title: "Episode 515 : 2 Person Prison Break Race, My Unfamiliar Partner", url: `${STREAM_HOST}/dl/6acc82716e979983cdce5775` },
            { title: "Episode 516 : Operation: Clear Out the Criminals, Domestic Investigation", url: `${STREAM_HOST}/dl/6acc82766e979983cdce5776` },
            { title: "Episode 517 : Link Average Race, Cut Off to Survive", url: `${STREAM_HOST}/dl/6acc82766e979983cdce5778` },
            { title: "Episode 518 : Brahms Music School Race: Do you like 1 person?", url: `${STREAM_HOST}/dl/6acc82766e979983cdce5777` },
            { title: "Episode 519 : Running Man Thief Race 2, The Copycat Criminals", url: `${STREAM_HOST}/dl/6acc82766e979983cdce5779` },
            { title: "Episode 520 : 8 People, 8 Colors Preference Race, Lucky Hobbies", url: `${STREAM_HOST}/dl/6acc827b6e979983cdce577a` },
            { title: "Episode 521 : Fashion Choice Race, All or Nothing", url: `${STREAM_HOST}/dl/6acc827b6e979983cdce577b` },
            { title: "Episode 522 : America vs Asia, The Trade King", url: `${STREAM_HOST}/dl/6acc82ac6e979983cdce577c` },
            { title: "Episode 523 : Chuseok Family Race, The Yoo Family's Inheritance War", url: `${STREAM_HOST}/dl/6acc82b26e979983cdce577d` },
            { title: "Episode 524 : Back to the Basics Race, Precious Sisters", url: `${STREAM_HOST}/dl/6acc82b36e979983cdce577e` },
            { title: "Episode 525 : BLACKPINK in Running Man, Save Us From Probability", url: `${STREAM_HOST}/dl/6acc82b36e979983cdce577f` },
            { title: "Episode 526 : Robber versus Robber: Faceless King of Tomb Robbery", url: `${STREAM_HOST}/dl/6acc82b36e979983cdce5780` },
            { title: "Episode 527 : Jeju Island Special Part 1: Wind, Women, Rocks, and Bomb", url: `${STREAM_HOST}/dl/6acc82b86e979983cdce5782` },
            { title: "Episode 528 : Jeju Island Special Part 2: Loser-Pays-All Group Tour", url: `${STREAM_HOST}/dl/6acc82b86e979983cdce5781` },
            { title: "Episode 529 : Journal of Old Restaurant", url: `${STREAM_HOST}/dl/6acc82b86e979983cdce5783` },
            { title: "Episode 530 : Penthouse Special Part 1: Top Club vs Bottom Club", url: `${STREAM_HOST}/dl/6acc82be6e979983cdce5784` },
            { title: "Episode 531 : Penthouse Special Part 2: Tenant War", url: `${STREAM_HOST}/dl/6acc82ec6e979983cdce5785` },
            { title: "Episode 532 : Best Friend Special Friendship Race: The 1st Friendship Awards", url: `${STREAM_HOST}/dl/6acc82ee6e979983cdce5787` },
            { title: "Episode 533 : Sweet Home 5pm, Saturday night", url: `${STREAM_HOST}/dl/6acc82ee6e979983cdce5786` },
            { title: "Episode 534 : Ryu Hyun-Jin X Kim Kwang-Hyun: Sparkling Stove League", url: `${STREAM_HOST}/dl/6acc82f16e979983cdce5788` },
            { title: "Episode 535 : New Year Blues Race: 2020 Year-end Closing", url: `${STREAM_HOST}/dl/6acc82f16e979983cdce5789` },
            { title: "Episode 536 : 2021 Hoodwinker Association New Year's Party", url: `${STREAM_HOST}/dl/6acc82f16e979983cdce578a` },
            { title: "Episode 537 : Production Objective Race: Running Man Rewritten, Part 1", url: `${STREAM_HOST}/dl/6acc82f36e979983cdce578b` },
            { title: "Episode 538 : Production Objective Race: Running Man Rewritten, Part 2", url: `${STREAM_HOST}/dl/6acc82fc6e979983cdce578c` },
            { title: "Episode 539 : Activity Cost Shooter Race: Burning 18 Again", url: `${STREAM_HOST}/dl/6acc82fc6e979983cdce578d` },
            { title: "Episode 540 : The Charismatic Sisters, The Ugly Siblings", url: `${STREAM_HOST}/dl/6acc82fc6e979983cdce578f` },
            { title: "Episode 541 : 2021 New Year Driving Out Bad Luck Race: Take My Bad Luck Away", url: `${STREAM_HOST}/dl/6acc832d6e979983cdce5790` },
            { title: "Episode 542 : 2021 Running Man Neighborhood Athletic Meet with The Penthouse", url: `${STREAM_HOST}/dl/6acc832e6e979983cdce5791` },
            { title: "Episode 543 : Running Man Investment Contest: Genius Investors", url: `${STREAM_HOST}/dl/6acc832e6e979983cdce5792` },
            { title: "Episode 544 : Running Man Investment Contest Genius Investors Part 2", url: `${STREAM_HOST}/dl/6acc83306e979983cdce5793` },
            { title: "Episode 545 : On the Way to Find Gold", url: `${STREAM_HOST}/dl/6acc83336e979983cdce5795` },
            { title: "Episode 546 : Records of the Running Dynasty", url: `${STREAM_HOST}/dl/6acc83336e979983cdce5794` },
            { title: "Episode 547 : Dignity of Grand Award", url: `${STREAM_HOST}/dl/6acc83346e979983cdce5797` },
            { title: "Episode 548 : Stars' Contract War", url: `${STREAM_HOST}/dl/6acc83346e979983cdce5796` },
            { title: "Episode 549 : Idol Star Project: Brave Idol's Day", url: `${STREAM_HOST}/dl/6acc83396e979983cdce5798` },
            { title: "Episode 550 : 10 Minutes vs. 1 Hour: Sweet Savage's Off Work Road", url: `${STREAM_HOST}/dl/6acc83396e979983cdce5799` },
            { title: "Episode 551 : I Want to Find the Partner Entertainer", url: `${STREAM_HOST}/dl/6acc83646e979983cdce579a` },
            { title: "Episode 552 : Students Who Entered University in 1991 Are Back!", url: `${STREAM_HOST}/dl/6acc83656e979983cdce579b` },
            { title: "Episode 553 : The Entering Class of 1991 Is Back!", url: `${STREAM_HOST}/dl/6acc83696e979983cdce579c` },
            { title: "Episode 554 : Credit Card Payment Race, When You Go to the TV Station", url: `${STREAM_HOST}/dl/6acc836b6e979983cdce579d` },
            { title: "Episode 555 : Smart Escape Race, Empty Head Land", url: `${STREAM_HOST}/dl/6acc836f6e979983cdce579e` },
            { title: "Episode 556 : We Will Find Spring For You", url: `${STREAM_HOST}/dl/6acc83706e979983cdce579f` },
            { title: "Episode 557 : Going Home Race, Read the Room", url: `${STREAM_HOST}/dl/6acc83706e979983cdce57a0` },
            { title: "Episode 558 : Three Meals for Jae Suk", url: `${STREAM_HOST}/dl/6acc83746e979983cdce57a1` },
            { title: "Episode 559 : Goodbye, Our Special Brother", url: `${STREAM_HOST}/dl/6acc83756e979983cdce57a2` }
        ])
    },
    "running_man_4_catalog": {
        id: "running_man_4",
        catalogId: "running_man_4_catalog",
        name: "Runningman 560-679",
        poster: "https://i.postimg.cc/sXPb5CGW/RM7.png",
        background: "https://i.postimg.cc/RFB4Yx6t/RM-no-Kwangsoo.jpg",
        backgroundShape: "Landscape",
        description: "Koleksi Episod Running Man (Episod 560 - 679). Cast : Yoo Jae Suk, Ji Seok Jin, Kim Jong Kook, HaHa, Song Ji Hyo, Yang Se Chan & Jeon So Min.",
        episodes: createEpisodes([
            { title: "Episode 560 : The 1st Game Lover Get-together", url: `${STREAM_HOST}/dl/6acc88716e979983cdce57a8` },
            { title: "Episode 561 : Delightful Men and Women's Vacation", url: `${STREAM_HOST}/dl/6acc88716e979983cdce57a7` },
            { title: "Episode 562 : Talk Nightmare: The Day for Chattering", url: `${STREAM_HOST}/dl/6acc88716e979983cdce57a4` },
            { title: "Episode 563 : The Strange Family Photo Race", url: `${STREAM_HOST}/dl/6acc88716e979983cdce57a6` },
            { title: "Episode 564 : Make Your Wish Come True and Pay The Price Later", url: `${STREAM_HOST}/dl/6acc88716e979983cdce57a5` },
            { title: "Episode 565 : Theft of Comedian Association Membership Fee", url: `${STREAM_HOST}/dl/6acc88716e979983cdce57a3` },
            { title: "Episode 566 : Make Your Own Fate, Protect Money For Your Parents", url: `${STREAM_HOST}/dl/6acc88796e979983cdce57a9` },
            { title: "Episode 567 : Team Selection Race, Young Ji versus Young Ji", url: `${STREAM_HOST}/dl/6acc887b6e979983cdce57ab` },
            { title: "Episode 568 : Find the most expensive doll, Scary Doll Detective", url: `${STREAM_HOST}/dl/6acc887b6e979983cdce57aa` },
            { title: "Episode 569 : Couple Race, You Raise a Man Up", url: `${STREAM_HOST}/dl/6acc887b6e979983cdce57ac` },
            { title: "Episode 570 : Catch the Mafia, Running Man in Chaos", url: `${STREAM_HOST}/dl/6acc887e6e979983cdce57ad` },
            { title: "Episode 571 : Gym Revival Project, Trainer Jong Kook and National Team", url: `${STREAM_HOST}/dl/6acc887e6e979983cdce57ae` },
            { title: "Episode 572 : Female Volleyball Team, Fierce Transfer Contract", url: `${STREAM_HOST}/dl/6acc88846e979983cdce57af` },
            { title: "Episode 573 : Fierce Transfer Race 2: Negotiation of Long Legs", url: `${STREAM_HOST}/dl/6acc88846e979983cdce57b0` },
            { title: "Episode 574 : To Become Italian Gentlemen, Elegant Road of Western Dishes", url: `${STREAM_HOST}/dl/6acc88846e979983cdce57b1` },
            { title: "Episode 575 : Squid Game", url: `${STREAM_HOST}/dl/6acc88846e979983cdce57b2` },
            { title: "Episode 576 : The Choice of Destiny, Golden Ratio Race", url: `${STREAM_HOST}/dl/6acc88b46e979983cdce57b4` },
            { title: "Episode 577 : The Rehabilitation Project, Icon of Misfortune", url: `${STREAM_HOST}/dl/6acc88b46e979983cdce57b3` },
            { title: "Episode 578 : The Race to Get To Know Each Other, My Money and My Alpine Club", url: `${STREAM_HOST}/dl/6acc88b46e979983cdce57b5` },
            { title: "Episode 579 : Street Human Fighter", url: `${STREAM_HOST}/dl/6acc88b46e979983cdce57b6` },
            { title: "Episode 580 : Running Man vs Production Team, 2021 Running Man Penalty Negotiation", url: `${STREAM_HOST}/dl/6acc88ba6e979983cdce57b7` },
            { title: "Episode 581 : Welcome The New Millennium: End of Century", url: `${STREAM_HOST}/dl/6acc88ba6e979983cdce57b8` },
            { title: "Episode 582 : The Variety Show Family, Yang Se Chan the Good Son", url: `${STREAM_HOST}/dl/6acc88bf6e979983cdce57b9` },
            { title: "Episode 583 : Suk Jin's Cells", url: `${STREAM_HOST}/dl/6acc88bf6e979983cdce57ba` },
            { title: "Episode 584 : 2021 Clever Year-end Party", url: `${STREAM_HOST}/dl/6acc88bf6e979983cdce57bb` },
            { title: "Episode 585 : Running Man Year-End Special", url: `${STREAM_HOST}/dl/6acc88ec6e979983cdce57bd` },
            { title: "Episode 586 : Renyin Year: Duplicate Loan Race", url: `${STREAM_HOST}/dl/6acc88ec6e979983cdce57bc` },
            { title: "Episode 587 : The Seniority War of the Youngest Members", url: `${STREAM_HOST}/dl/6acc88ed6e979983cdce57be` },
            { title: "Episode 588 : Height Point Race Pt.1", url: `${STREAM_HOST}/dl/6acc88f16e979983cdce57bf` },
            { title: "Episode 589 : Height Point Pt.2/Renyin Year's Tangun Myth Pt.1", url: `${STREAM_HOST}/dl/6acc88f36e979983cdce57c0` },
            { title: "Episode 590 : Renyin Year's Tangun Myth Pt.2", url: `${STREAM_HOST}/dl/6acc88f66e979983cdce57c1` },
            { title: "Episode 591 : Seri and Birdie Buddy", url: `${STREAM_HOST}/dl/6acc88f86e979983cdce57c2` },
            { title: "Episode 592 : The Tazza Association: People Who Read the Minds of Scammers", url: `${STREAM_HOST}/dl/6acc88fb6e979983cdce57c3` },
            { title: "Episode 593 : Casual Ji", url: `${STREAM_HOST}/dl/6acc88fc6e979983cdce57c4` },
            { title: "Episode 594 : Running Man General Election Race", url: `${STREAM_HOST}/dl/6acc88fd6e979983cdce57c5` },
            { title: "Episode 595 : This is the First Time in My Life as a Team Leader", url: `${STREAM_HOST}/dl/6acc89296e979983cdce57c7` },
            { title: "Episode 596 : This is the First Time in My Life as a Team Leader/BTOB Without BTOB Special", url: `${STREAM_HOST}/dl/6acc89296e979983cdce57c6` },
            { title: "Episode 597 : Not Spring, Candy, or Penalty", url: `${STREAM_HOST}/dl/6acc892f6e979983cdce57c8` },
            { title: "Episode 598 : Captain Ji's Imagination Comes True", url: `${STREAM_HOST}/dl/6acc892f6e979983cdce57c9` },
            { title: "Episode 599 : How Much Do You Want to Spend?", url: `${STREAM_HOST}/dl/6acc89306e979983cdce57ca` },
            { title: "Episode 600 : Along With You", url: `${STREAM_HOST}/dl/6acc89356e979983cdce57cb` },
            { title: "Episode 601 : The Decisive Punch", url: `${STREAM_HOST}/dl/6acc89356e979983cdce57cc` },
            { title: "Episode 602 : Scoundrels Come Slowly", url: `${STREAM_HOST}/dl/6acc893a6e979983cdce57cd` },
            { title: "Episode 603 : 1st 1/N Game", url: `${STREAM_HOST}/dl/6acc893a6e979983cdce57ce` },
            { title: "Episode 604 : Instruction for Using Black and White Rose", url: `${STREAM_HOST}/dl/6acc893a6e979983cdce57cf` },
            { title: "Episode 605 : 2022: Truth or Guilt", url: `${STREAM_HOST}/dl/6acc893b6e979983cdce57d0` },
            { title: "Episode 606 : Masters of Investment: Go to NY Part I", url: `${STREAM_HOST}/dl/6acc896b6e979983cdce57d2` },
            { title: "Episode 607 : Masters of Investment: Go to NY Part II", url: `${STREAM_HOST}/dl/6acc896b6e979983cdce57d1` },
            { title: "Episode 608 : I Got Off Work First", url: `${STREAM_HOST}/dl/6acc896c6e979983cdce57d3` },
            { title: "Episode 609 : The 1st Running Man Proxy Vacance", url: `${STREAM_HOST}/dl/6acc89716e979983cdce57d4` },
            { title: "Episode 610 : Home Jong-kook", url: `${STREAM_HOST}/dl/6acc89716e979983cdce57d5` },
            { title: "Episode 611 : The Rice Spoon War", url: `${STREAM_HOST}/dl/6acc89766e979983cdce57d6` },
            { title: "Episode 612 : 2nd Witty Sharing Life", url: `${STREAM_HOST}/dl/6acc89766e979983cdce57d7` },
            { title: "Episode 613 : Running Biography", url: `${STREAM_HOST}/dl/6acc89766e979983cdce57d8` },
            { title: "Episode 614 : One After Another Running Man", url: `${STREAM_HOST}/dl/6acc89776e979983cdce57d9` },
            { title: "Episode 615 : One After Another Running Man/Three Three Five Five Race", url: `${STREAM_HOST}/dl/6acc89a66e979983cdce57da` },
            { title: "Episode 616 : Three Three Five Five Race. Part 2", url: `${STREAM_HOST}/dl/6acc89a66e979983cdce57db` },
            { title: "Episode 617 : Huge Investments", url: `${STREAM_HOST}/dl/6acc89a66e979983cdce57dc` },
            { title: "Episode 618 : War of Coins", url: `${STREAM_HOST}/dl/6acc89ab6e979983cdce57dd` },
            { title: "Episode 619 : Running Man Runs Around", url: `${STREAM_HOST}/dl/6acc89ab6e979983cdce57de` },
            { title: "Episode 620 : My Way with 'Strong' Momentum", url: `${STREAM_HOST}/dl/6acc89ab6e979983cdce57df` },
            { title: "Episode 621 : He Said He Wants to Go to Gangwon-do. Part 1", url: `${STREAM_HOST}/dl/6acc89b16e979983cdce57e0` },
            { title: "Episode 622 : He Said He Wants to Go to Gangwon-do. Part 2/Anyway, The Penalty is...", url: `${STREAM_HOST}/dl/6acc89b16e979983cdce57e1` },
            { title: "Episode 623 : Go! Stop!", url: `${STREAM_HOST}/dl/6acc89b66e979983cdce57e2` },
            { title: "Episode 624 : Go! Stop!/Expert Run, Have I Eaten The Rice?", url: `${STREAM_HOST}/dl/6acc89b66e979983cdce57e3` },
            { title: "Episode 625 : Take a Tour Around At a Well-known Neighborhood", url: `${STREAM_HOST}/dl/6acc89e26e979983cdce57e4` },
            { title: "Episode 626 : Show Me The Fight Money", url: `${STREAM_HOST}/dl/6acc89e36e979983cdce57e5` },
            { title: "Episode 627 : Suk Jin VS Seok Jin", url: `${STREAM_HOST}/dl/6acc89e36e979983cdce57e6` },
            { title: "Episode 628 : I'm Finding Autumn", url: `${STREAM_HOST}/dl/6acc89e76e979983cdce57e7` },
            { title: "Episode 629 : Combat: Transfer Bombs", url: `${STREAM_HOST}/dl/6acc89e76e979983cdce57e8` },
            { title: "Episode 630 : One Dollar Lawyer", url: `${STREAM_HOST}/dl/6acc89e96e979983cdce57e9` },
            { title: "Episode 631 : Or First World Cup Win?", url: `${STREAM_HOST}/dl/6acc89ed6e979983cdce57ea` },
            { title: "Episode 632 : Or First World Cup Win?/The Lucky Number Race", url: `${STREAM_HOST}/dl/6acc89f26e979983cdce57eb` },
            { title: "Episode 633 : What's The End of The Year Party", url: `${STREAM_HOST}/dl/6acc89f26e979983cdce57ec` },
            { title: "Episode 634 : Yoosanta and The Sixth Rudolph", url: `${STREAM_HOST}/dl/6acc89f36e979983cdce57ed` },
            { title: "Episode 635 : Running Man Outing", url: `${STREAM_HOST}/dl/6acc8a1e6e979983cdce57ee` },
            { title: "Episode 636 : Running Man Outing II", url: `${STREAM_HOST}/dl/6acc8a236e979983cdce57ef` },
            { title: "Episode 637 : Sparkling Salary Race", url: `${STREAM_HOST}/dl/6acc8a236e979983cdce57f0` },
            { title: "Episode 638 : That is a Tattered Conglomerate Family", url: `${STREAM_HOST}/dl/6acc8a296e979983cdce57f1` },
            { title: "Episode 639 : Liverless Rabbit", url: `${STREAM_HOST}/dl/6acc8a296e979983cdce57f2` },
            { title: "Episode 640 : The Colourful Martial Arts Master/The Golden MT Time I", url: `${STREAM_HOST}/dl/6acc8a296e979983cdce57f3` },
            { title: "Episode 641 : The Golden MT Time II", url: `${STREAM_HOST}/dl/6acc8a2f6e979983cdce57f4` },
            { title: "Episode 642 : Winter Festival", url: `${STREAM_HOST}/dl/6acc8a2f6e979983cdce57f5` },
            { title: "Episode 643 : Butler's Days I", url: `${STREAM_HOST}/dl/6acc8a2f6e979983cdce57f6` },
            { title: "Episode 644 : Butler's Days II/Suk-jin's Treat", url: `${STREAM_HOST}/dl/6acc8a356e979983cdce57f7` },
            { title: "Episode 645 : Crash Course in Bad Hand", url: `${STREAM_HOST}/dl/6acc8a5f6e979983cdce57f8` },
            { title: "Episode 646 : Dongducheon Class", url: `${STREAM_HOST}/dl/6acc8a5f6e979983cdce57f9` },
            { title: "Episode 647 : Just right! Now Suitable for Camping. Part 1", url: `${STREAM_HOST}/dl/6acc8a616e979983cdce57fa` },
            { title: "Episode 648 : Just right! Now Suitable for Camping. Part 2", url: `${STREAM_HOST}/dl/6acc8a616e979983cdce57fb` },
            { title: "Episode 649 : Do You Know the Flower Scholar?", url: `${STREAM_HOST}/dl/6acc8a666e979983cdce57fc` },
            { title: "Episode 650 : Running Man in the Philippines", url: `${STREAM_HOST}/dl/6acc8a666e979983cdce57fd` },
            { title: "Episode 651 : No Coin No Gain", url: `${STREAM_HOST}/dl/6acc8a666e979983cdce57fe` },
            { title: "Episode 652 : Running Tour Project", url: `${STREAM_HOST}/dl/6acc8a6b6e979983cdce57ff` },
            { title: "Episode 653 : Age Notice Picture Exhibition. Part 1", url: `${STREAM_HOST}/dl/6acc8a6c6e979983cdce5800` },
            { title: "Episode 654 : Age Notice Picture Exhibition. Part 2", url: `${STREAM_HOST}/dl/6acc8a706e979983cdce5801` },
            { title: "Episode 655 : 2023 Choice of So-min", url: `${STREAM_HOST}/dl/6acc8a706e979983cdce5802` },
            { title: "Episode 656 : You're My Fool", url: `${STREAM_HOST}/dl/6acc8a9b6e979983cdce5803` },
            { title: "Episode 657 : Ji-hyo's Detox Tour", url: `${STREAM_HOST}/dl/6acc8aa06e979983cdce5804` },
            { title: "Episode 658 : I'm Single's Inferno", url: `${STREAM_HOST}/dl/6acc8aa06e979983cdce5805` },
            { title: "Episode 659 : I'm Single's Inferno/The Lucky 29th", url: `${STREAM_HOST}/dl/6acc8aa06e979983cdce5806` },
            { title: "Episode 660 : Heating with Noodles", url: `${STREAM_HOST}/dl/6acc8aa56e979983cdce5807` },
            { title: "Episode 661 : Forget-About-Age Party", url: `${STREAM_HOST}/dl/6acc8aa56e979983cdce5808` },
            { title: "Episode 662 : Running Scout", url: `${STREAM_HOST}/dl/6acc8aa66e979983cdce5809` },
            { title: "Episode 663 : Along with Veterans Joseon Dynasty Edition", url: `${STREAM_HOST}/dl/6acc8aaa6e979983cdce580a` },
            { title: "Episode 664 : Yoo Jae-suk's Cultural Heritage Inspection Diary", url: `${STREAM_HOST}/dl/6acc8aab6e979983cdce580b` },
            { title: "Episode 665 : Summer Vacation: Running Man Outing. Part 1", url: `${STREAM_HOST}/dl/6acc8aab6e979983cdce580c` },
            { title: "Episode 666 : Summer Vacation: Running Man Outing. Part 2", url: `${STREAM_HOST}/dl/6acc8ad76e979983cdce580d` },
            { title: "Episode 667 : Summer Vacation in Fishing Village: Running Man Outing. Part 1", url: `${STREAM_HOST}/dl/6acc8adc6e979983cdce580e` },
            { title: "Episode 668 : Summer Vacation in Fishing Village: Running Man Outing. Part 2", url: `${STREAM_HOST}/dl/6acc8adc6e979983cdce580f` },
            { title: "Episode 669 : Midsummer Nights Detective", url: `${STREAM_HOST}/dl/6acc8ade6e979983cdce5810` },
            { title: "Episode 670 : Midsummer Nights Detective", url: `${STREAM_HOST}/dl/6acc8ae26e979983cdce5811` },
            { title: "Episode 671 : Vtopia That Eats Up the Ground", url: `${STREAM_HOST}/dl/6acc8ae26e979983cdce5812` },
            { title: "Episode 672 : Money Road in Daehangno", url: `${STREAM_HOST}/dl/6acc8ae86e979983cdce5813` },
            { title: "Episode 673 : Amnesia Couple Battle", url: `${STREAM_HOST}/dl/6acc8ae96e979983cdce5814` },
            { title: "Episode 674 : \"Yoo\" are my Leader", url: `${STREAM_HOST}/dl/6acc8ae96e979983cdce5815` },
            { title: "Episode 675 : The Escape of the Ten", url: `${STREAM_HOST}/dl/6acc8b136e979983cdce5816` },
            { title: "Episode 676 : Few Heaven", url: `${STREAM_HOST}/dl/6acc8b136e979983cdce5817` },
            { title: "Episode 677 : Autumn Food Party", url: `${STREAM_HOST}/dl/6acc8b1a6e979983cdce5818` },
            { title: "Episode 678 : The Dream of a Million Dollars", url: `${STREAM_HOST}/dl/6acc8b1a6e979983cdce5819` },
            { title: "Episode 679 : Goodbye So-Min", url: `${STREAM_HOST}/dl/6acc8b1b6e979983cdce581a` }
        ])
    },
    "running_man_5_catalog": {
        id: "running_man_5",
        catalogId: "running_man_5_catalog",
        name: "Runningman 680-732",
        poster: "https://i.postimg.cc/q7cWfdBT/RM-SCP.webp",
        background: "https://i.postimg.cc/tTjpcGZ4/RM-sechan.jpg",
        backgroundShape: "Landscape",
        description: "Koleksi Episod Running Man (Episod 680 - 732). Cast : Yoo Jae Suk, Ji Seok Jin, Kim Jong Kook, HaHa, Song Ji Hyo & Yang Se Chan.",
        episodes: createEpisodes([
            { title: "Episode 680 : Do You Want to Win the Championship?", url: `${STREAM_HOST}/dl/6acc8c8c6e979983cdce581c` },
            { title: "Episode 681 : Singapore Exclusive Package", url: `${STREAM_HOST}/dl/6acc8c8c6e979983cdce581d` },
            { title: "Episode 682 : Tazza: Veteran's Wonderland", url: `${STREAM_HOST}/dl/6acc8c8c6e979983cdce581b` },
            { title: "Episode 683 : Tazza: Veteran's Wonderland/Travel to Suk-jin in Advance", url: `${STREAM_HOST}/dl/6acc8c8c6e979983cdce5820` },
            { title: "Episode 684 : Attack and Defense Come, Attack and Defense Stay: Clear War", url: `${STREAM_HOST}/dl/6acc8c8c6e979983cdce581f` },
            { title: "Episode 685 : Will I Give You a Gift at Christmas? (Christmas Special)", url: `${STREAM_HOST}/dl/6acc8c8c6e979983cdce581e` },
            { title: "Episode 686 : Running Villa in Crisis (New Year Special)", url: `${STREAM_HOST}/dl/6acc8f246e979983cdce5823` },
            { title: "Episode 687 : 2nd Winter Festival (Winter Special)", url: `${STREAM_HOST}/dl/6acc8f246e979983cdce5825` },
            { title: "Episode 688 : Will You be Satisfied with Me?", url: `${STREAM_HOST}/dl/6acc8f246e979983cdce5821` },
            { title: "Episode 689 : Ji Seok-jin Oh~swa Healthy Oh~swa", url: `${STREAM_HOST}/dl/6acc8f246e979983cdce5826` },
            { title: "Episode 690 : Wonderful Value! for Money", url: `${STREAM_HOST}/dl/6acc8f276e979983cdce5828` },
            { title: "Episode 691 : It Is the Ji's Family Who Repays the Favor (Lunar New Year Special)", url: `${STREAM_HOST}/dl/6acc8f276e979983cdce5827` },
            { title: "Episode 692 : The Legendary Gold Bar", url: `${STREAM_HOST}/dl/6acc8f2c6e979983cdce582a` },
            { title: "Episode 693 : I will Win in My Next Life. Part 1", url: `${STREAM_HOST}/dl/6acc8f2c6e979983cdce5829` },
            { title: "Episode 694 : I will Win in My Next Life. Part 2/Towards the tower", url: `${STREAM_HOST}/dl/6acc8f2c6e979983cdce582b` },
            { title: "Episode 695 : Top Teacher Yoo Jae-suk's Empty Head Historical Visit", url: `${STREAM_HOST}/dl/6acc8f2c6e979983cdce582c` },
            { title: "Episode 696 : Running Old Shops Marble", url: `${STREAM_HOST}/dl/6acc8f316e979983cdce582d` },
            { title: "Episode 697 : 1st Futsal Running Cup", url: `${STREAM_HOST}/dl/6acc8f376e979983cdce582e` },
            { title: "Episode 698 : The Hips are full", url: `${STREAM_HOST}/dl/6acc8f376e979983cdce582f` },
            { title: "Episode 699 : Spring has come to TV Rating Notice", url: `${STREAM_HOST}/dl/6acc8f376e979983cdce5830` },
            { title: "Episode 700 : Sweet and Sweet 7 Million Dollars (700th Episode special)", url: `${STREAM_HOST}/dl/6acc8f376e979983cdce5831` },
            { title: "Episode 701 : 2nd Futsal Running Cup", url: `${STREAM_HOST}/dl/6acc8f636e979983cdce5832` },
            { title: "Episode 702 : Half of the Future", url: `${STREAM_HOST}/dl/6acc8f636e979983cdce5833` },
            { title: "Episode 703 : Returning Go Stop", url: `${STREAM_HOST}/dl/6acc8f686e979983cdce5834` },
            { title: "Episode 704 : More Wonderful Value! for Money Part.2", url: `${STREAM_HOST}/dl/6acc8f686e979983cdce5835` },
            { title: "Episode 705 : I Have to Come in First Place", url: `${STREAM_HOST}/dl/6acc8f696e979983cdce5836` },
            { title: "Episode 706 : Oh My Gosh Kang Hoon (Kang Hoon's birthday special)", url: `${STREAM_HOST}/dl/6acc8f6e6e979983cdce5837` },
            { title: "Episode 707 : Between Partner and Fake Partner", url: `${STREAM_HOST}/dl/6acc8f6e6e979983cdce5838` },
            { title: "Episode 708 : 3rd Hwang Hee-chan Cup Futsal Running Cup", url: `${STREAM_HOST}/dl/6acc8f6e6e979983cdce5839` },
            { title: "Episode 709 : 3rd Hwang Hee-chan Cup Futsal Running Cup II / Joint Escape Area Race", url: `${STREAM_HOST}/dl/6acc8f746e979983cdce583a` },
            { title: "Episode 710 : Summer Meal Break Initiated", url: `${STREAM_HOST}/dl/6acc8f9f6e979983cdce583c` },
            { title: "Episode 711 : The Unknown Choice", url: `${STREAM_HOST}/dl/6acc8f9f6e979983cdce583b` },
            { title: "Episode 712 : Good and Bad Partner", url: `${STREAM_HOST}/dl/6acc8f9f6e979983cdce583d` },
            { title: "Episode 713 : Temperature Differences in the Middle of Summer (14th Anniversary SBS Running Man Special)", url: `${STREAM_HOST}/dl/6acc8fa56e979983cdce583e` },
            { title: "Episode 714 : 2024 Burning Runningpic (2024 Paris Olympics Special)", url: `${STREAM_HOST}/dl/6acc8faa6e979983cdce583f` },
            { title: "Episode 715 : The Desperate Villagecance", url: `${STREAM_HOST}/dl/6acc8faa6e979983cdce5840` },
            { title: "Episode 716 : National Runningpic", url: `${STREAM_HOST}/dl/6acc8fab6e979983cdce5841` },
            { title: "Episode 717 : Happy Dice Day (Yoo Jae-suk, Haha, and Song Ji-hyo's birthday special)", url: `${STREAM_HOST}/dl/6acc8fab6e979983cdce5842` },
            { title: "Episode 718 : Soo Yoo-ri Catch Lucky", url: `${STREAM_HOST}/dl/6acc8fab6e979983cdce5843` },
            { title: "Episode 719 : The Unlucky Family Appears", url: `${STREAM_HOST}/dl/6acc8fe06e979983cdce5844` },
            { title: "Episode 720 : The Perfect Code", url: `${STREAM_HOST}/dl/6acc90566e979983cdce5845` },
            { title: "Episode 721 : Check your luck! - MT with Mr. Tong", url: `${STREAM_HOST}/dl/6acc90566e979983cdce5849` },
            { title: "Episode 722 : Alley Leader for Each Other", url: `${STREAM_HOST}/dl/6acc90566e979983cdce5848` },
            { title: "Episode 723 : Indomitable maintainer", url: `${STREAM_HOST}/dl/6acc90566e979983cdce584a` },
            { title: "Episode 724 : Hierarchical Clan", url: `${STREAM_HOST}/dl/6acc90566e979983cdce5847` },
            { title: "Episode 725 : Only Money For Me", url: `${STREAM_HOST}/dl/6acc90566e979983cdce5846` },
            { title: "Episode 726 : Look at The Way You Believe Me", url: `${STREAM_HOST}/dl/6acc905e6e979983cdce584b` },
            { title: "Episode 727 : The Monitor Election that Overestimates One's Ability feat. Autumn Picnic", url: `${STREAM_HOST}/dl/6acc905e6e979983cdce584c` },
            { title: "Episode 728 : Decision to Trust", url: `${STREAM_HOST}/dl/6acc905f6e979983cdce584e` },
            { title: "Episode 729 : Such an Intimate Overseas Traveling", url: `${STREAM_HOST}/dl/6acc905e6e979983cdce584d` },
            { title: "Episode 730 : Choose your Odd/Even Choice Wisely", url: `${STREAM_HOST}/dl/6acc90646e979983cdce584f` },
            { title: "Episode 731 : The Invitation doesn't go as Planned", url: `${STREAM_HOST}/dl/6acc90656e979983cdce5850` },
            { title: "Episode 732 : Cool Running Year-End Party", url: `${STREAM_HOST}/dl/6acc90696e979983cdce5851` }  
        ])
    },
    "running_man_6_catalog": {
        id: "running_man_6",
        catalogId: "running_man_6_catalog",
        name: "Runningman 733-now",
        poster: "https://i.postimg.cc/XJgy4X2X/RM-N-P.webp",
        background: "https://i.postimg.cc/7L7qXZ65/RM822.jpg",
        backgroundShape: "Landscape",
        description: "Koleksi Episod Running Man (Episod 733 - now). Cast : Yoo Jae Suk, Ji Seok Jin, Kim Jong Kook, HaHa, Song Ji Hyo, Yang Se Chan & Ji Ye Eun.",
        episodes: createEpisodes([
            { title: "Episode 733 : The Cool Running Year-End Party. Part 2", url: `${STREAM_HOST}/dl/6acc92146e979983cdce5852` },
            { title: "Episode 734 : Resolve to Part Ways with 2024", url: `${STREAM_HOST}/dl/6acc92146e979983cdce5855` },
            { title: "Episode 735 : The Lucky 2025", url: `${STREAM_HOST}/dl/6acc92146e979983cdce5853` },
            { title: "Episode 736 : Team Kill Not Sorry", url: `${STREAM_HOST}/dl/6acc92146e979983cdce5856` },
            { title: "Episode 737 : The Blessed Gods Ratio Part.3", url: `${STREAM_HOST}/dl/6acc92146e979983cdce5854` },
            { title: "Episode 738 : The Person Who Laughs in Paradise", url: `${STREAM_HOST}/dl/6acc92146e979983cdce5857` },
            { title: "Episode 739 : The Chaotic Life of Slaves", url: `${STREAM_HOST}/dl/6acc921c6e979983cdce5858` },
            { title: "Episode 740 : The Don't Go Family", url: `${STREAM_HOST}/dl/6acc921c6e979983cdce5859` },
            { title: "Episode 741 : SOS. The Cleanup Code: Heroes on Call", url: `${STREAM_HOST}/dl/6acc921e6e979983cdce585a` },
            { title: "Episode 742 : Love Consumption", url: `${STREAM_HOST}/dl/6acc921e6e979983cdce585b` },
            { title: "Episode 743 : 2025 Running Backup Championship", url: `${STREAM_HOST}/dl/6acc92216e979983cdce585c` },
            { title: "Episode 744 : Going Up the TV Rating Notice", url: `${STREAM_HOST}/dl/6acc93796e979983cdce5862` },
            { title: "Episode 745 : Recharge After Work", url: `${STREAM_HOST}/dl/6acc93796e979983cdce5861` },
            { title: "Episode 746 : How Did a Imogi Becomes a Dragon", url: `${STREAM_HOST}/dl/6acc93796e979983cdce585f` },
            { title: "Episode 747 : He Said We're New Family", url: `${STREAM_HOST}/dl/6acc93796e979983cdce585e` },
            { title: "Episode 748 : Determination to Drive", url: `${STREAM_HOST}/dl/6acc93796e979983cdce5860` },
            { title: "Episode 749 : Merchant Chronicles: You Have to Earn to Live", url: `${STREAM_HOST}/dl/6acc93796e979983cdce585d` },
            { title: "Episode 750 : A Good Day for being Solo", url: `${STREAM_HOST}/dl/6acc93826e979983cdce5863` },
            { title: "Episode 751 : The More You Shoot, the More You Succeed", url: `${STREAM_HOST}/dl/6acc93826e979983cdce5865` },
            { title: "Episode 752 : Territorial Expansion of Killers", url: `${STREAM_HOST}/dl/6acc93826e979983cdce5867` },
            { title: "Episode 753 : The Eye-Catching Running Family", url: `${STREAM_HOST}/dl/6acc93826e979983cdce5864` },
            { title: "Episode 754 : Let's Vote Spring", url: `${STREAM_HOST}/dl/6acc93826e979983cdce5866` },
            { title: "Episode 755 : Road Trips as Drawn", url: `${STREAM_HOST}/dl/6acc93826e979983cdce5868` },
            { title: "Episode 756 : Veterans In the City", url: `${STREAM_HOST}/dl/6acc938c6e979983cdce586a` },
            { title: "Episode 757 : The Empty Head Avengers Last Competition", url: `${STREAM_HOST}/dl/6acc938c6e979983cdce5869` },
            { title: "Episode 758 : The Miracle Breakfast", url: `${STREAM_HOST}/dl/6acc938c6e979983cdce586b` },
            { title: "Episode 759 : Creepy Vacation Thriller", url: `${STREAM_HOST}/dl/6acc938c6e979983cdce586c` },
            { title: "Episode 760 : Back to 2010", url: `${STREAM_HOST}/dl/6acc938c6e979983cdce586d` },
            { title: "Episode 761 : The Splitting Gamblers", url: `${STREAM_HOST}/dl/6acc938c6e979983cdce586e` },
            { title: "Episode 762 : Happy Ye-eun Day", url: `${STREAM_HOST}/dl/6acc93926e979983cdce586f` },
            { title: "Episode 763 : The Weak Loyalty Roulette Battle", url: `${STREAM_HOST}/dl/6acc93926e979983cdce5870` },
            { title: "Episode 764 : 2025 Daytime Goblin Room Tour", url: `${STREAM_HOST}/dl/6acc93926e979983cdce5871` },
            { title: "Episode 765 : Between Flops and Masterpieces", url: `${STREAM_HOST}/dl/6acc93926e979983cdce5872` },
            { title: "Episode 766 : Running Sports University Prize Victory", url: `${STREAM_HOST}/dl/6acc93926e979983cdce5873` },
            { title: "Episode 767 : More spend, more luck! The Lucky Date Strikes", url: `${STREAM_HOST}/dl/6acc93926e979983cdce5874` },
            { title: "Episode 768 : The Time Prize and Penalty Fighter Attack", url: `${STREAM_HOST}/dl/6acc93fa6e979983cdce5875` },
            { title: "Episode 769 : Go Straight as You Answer", url: `${STREAM_HOST}/dl/6acc93fa6e979983cdce5876` },
            { title: "Episode 770 : Holding Back Laughter, Congratulatory Delegation", url: `${STREAM_HOST}/dl/6acc93fa6e979983cdce5877` },
            { title: "Episode 771 : Sir, That Salary Goes to The CEO", url: `${STREAM_HOST}/dl/6acc93fa6e979983cdce5878` },
            { title: "Episode 772 : The King's Crops", url: `${STREAM_HOST}/dl/6acc93fa6e979983cdce5879` },
            { title: "Episode 773 : A World Where Only the Average Survives", url: `${STREAM_HOST}/dl/6acc93fa6e979983cdce587a` },
            { title: "Episode 774 : Finders Keepers, Gold Hunters", url: `${STREAM_HOST}/dl/6acc94386e979983cdce587b` },
            { title: "Episode 775 : Time-lapse Photography Crew", url: `${STREAM_HOST}/dl/6acc94386e979983cdce587c` },
            { title: "Episode 776 : Running Man Weekly Keywords", url: `${STREAM_HOST}/dl/6acc94386e979983cdce587d` },
            { title: "Episode 777 : When we gather, it's all good! Autumn Literary Club", url: `${STREAM_HOST}/dl/6acc94386e979983cdce587e` },
            { title: "Episode 778 : Dynamite Abandonment", url: `${STREAM_HOST}/dl/6acc94386e979983cdce587f` },
            { title: "Episode 779 : Isn't this the real deal?", url: `${STREAM_HOST}/dl/6acc94386e979983cdce5880` },
            { title: "Episode 780 : Isn't this the real deal 2", url: `${STREAM_HOST}/dl/6acc94386e979983cdce5881` },
            { title: "Episode 781 : The Problematic New Members", url: `${STREAM_HOST}/dl/6acc94386e979983cdce5882` },
            { title: "Episode 782 : May it reach you as a Christmas gift", url: `${STREAM_HOST}/dl/6acc94386e979983cdce5883` },
            { title: "Episode 783 : The Year-End Clear out Settlement", url: `${STREAM_HOST}/dl/6acc94386e979983cdce5884` },
            { title: "Episode 784 : Follow the Horse, Complete the Bingo", url: `${STREAM_HOST}/dl/6acc94816e979983cdce5885` },
            { title: "Episode 785 : Gold Bag Chasers: Gold Me More", url: `${STREAM_HOST}/dl/6acc94816e979983cdce5886` },
            { title: "Episode 786 : The Lucky 2026 OT Day", url: `${STREAM_HOST}/dl/6acc94816e979983cdce5887` },
            { title: "Episode 787 : Starting Today, I'm A Nine-Tailed Fox But", url: `${STREAM_HOST}/dl/6acc94816e979983cdce5888` },
            { title: "Episode 788 : TV Rating Notice Survival", url: `${STREAM_HOST}/dl/6acc94816e979983cdce5889` },
            { title: "Episode 789 : The Game of Two", url: `${STREAM_HOST}/dl/6acc94816e979983cdce588a` },
            { title: "Episode 790 : I'm the Main Character Until Lunar New Year", url: `${STREAM_HOST}/dl/6acc94816e979983cdce588b` },
            { title: "Episode 791 : The Great Jee-tsby", url: `${STREAM_HOST}/dl/6acc94816e979983cdce588c` },
            { title: "Episode 792 : Card Shark Association: Return of the 2026 Gamblers", url: `${STREAM_HOST}/dl/6acc94816e979983cdce588d` },
            { title: "Episode 793 : Run and Fun Company: Spin the Roomlette", url: `${STREAM_HOST}/dl/6acc94816e979983cdce588e` },
            { title: "Episode 794 : Recharging Your Energy is All About Speed in Spring", url: `${STREAM_HOST}/dl/6acc94816e979983cdce588f` },
            { title: "Episode 795 : Detective Agency: Find the Genuine Piece", url: `${STREAM_HOST}/dl/6acc94816e979983cdce5890` },
            { title: "Episode 796 : You'd Probably Want a Bite", url: `${STREAM_HOST}/dl/6acc94816e979983cdce5891` },
            { title: "Episode 797 : War of the Bosses: Ladder of Destiny", url: `${STREAM_HOST}/dl/6acc94816e979983cdce5892` },
            { title: "Episode 798 : The Art of Betting: The Birth of a Gambler", url: `${STREAM_HOST}/dl/6acc94816e979983cdce5893` },
            { title: "Episode 799 : Running Days: Codename R", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce5894` },
            { title: "Episode 800 : Infinite Accumulation with Destiny Race", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce5895` },
            { title: "Episode 801 : Be Different to Walk the Flower Path", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce5896` },
            { title: "Episode 802 : Gold Thief: Break the Vault", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce5897` },
            { title: "Episode 803 : Secret Payment", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce5898` },
            { title: "Episode 804 : Why is Running Man Like That?", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce5899` },
            { title: "Episode 805 : I Will Prove It With My Face", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce589a` },
            { title: "Episode 806 : Solo Money Up", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce589b` },
            { title: "Episode 807 : A Quick Visit to Your Place", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce589c` },
            { title: "Episode 808 : Running Man Summer Vacation", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce589d` },
            { title: "Episode 809 : The Invaluable New World", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce589e` },
            { title: "Episode 810 : A Great Luck Comes to Me", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce589f` },
            { title: "Episode 811 : Holding the Nostalgic Memory's Edge", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce58a0` },
            { title: "Episode 812 : Yaho Off to Work", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce58a1` },
            { title: "Episode 813 : Goal: The Favorite Employee", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce58a2` },
            { title: "Episode 814 : Undercover Chaebol vs. Detectives", url: `${STREAM_HOST}/dl/6acc94f46e979983cdce58a3` },
            { title: "Episode 815 : Let's All Walk Around Jongno", url: `${STREAM_HOST}/dl/6acc94f96e979983cdce58a4` },
            { title: "Episode 816 : Scratch-vacation in the Sweltering Heat", url: `${STREAM_HOST}/dl/6acc94f96e979983cdce58a5` },
            { title: "Episode 817 : Stay Strong Chief Kang!", url: `${STREAM_HOST}/dl/6acc94fa6e979983cdce58a6` },
            { title: "Episode 818 : Take It or Leave It?", url: `${STREAM_HOST}/dl/6acc94fa6e979983cdce58a7` },
            { title: "Episode 819 : Irrefutable Artificial Intelligence 'Pick'", url: `${STREAM_HOST}/dl/6acc94fe6e979983cdce58a8` },
            { title: "Episode 820 : Episode #1.820", url: `${STREAM_HOST}/dl/6acc95266e979983cdce58a9` },
            { title: "Episode 821 : Episode #1.821", url: `${STREAM_HOST}/dl/6acc95316e979983cdce58aa` },
            { title: "Episode 822 : Episode #1.822", url: `${STREAM_HOST}/dl/6acc95336e979983cdce58ab` },
            { title: "Episode 823", url: `${STREAM_HOST}/dl/6ae8c57f6e979983cdce68a2` },
            { title: "Episode 824", url: `${STREAM_HOST}/dl/6ae8c57b6e979983cdce68a1` },
            { title: "Episode 825", url: `${STREAM_HOST}/dl/6ae8c5776e979983cdce68a0` },

        ])
    },
    "sembang_seram_catalog": {
        id: "sembang_seram_catalog",
        isMulti: true,
        items: [
            { id: "sembang_seram_1", name: "Amal Amani - Doktor Ditemani Lembaga Jururawat", poster: "https://i.postimg.cc/QtRdXBnV/SS-AMAL.jpg", url: `${STREAM_HOST}/dl/6adf5a056e979983cdce632c` },
            { id: "sembang_seram_2", name: "Ayda Jebat - Dirasuk Semangat Jawa", poster: "https://i.postimg.cc/NMy0q8Dn/SS-AYDA.jpg", url: `${STREAM_HOST}/dl/6adf5a056e979983cdce6329` },
            { id: "sembang_seram_3", name: "Dazrin - Pengalaman Cemas Ke Alam Bunian", poster: "https://i.postimg.cc/85qz1FnP/SS-DAZRIN.jpg", url: `${STREAM_HOST}/dl/6adf5a056e979983cdce632a` },
            { id: "sembang_seram_4", name: "Siti Khadijah Halim - Gangguan Misteri Akibat Sebatang Kayu Bernyawa", poster: "https://i.postimg.cc/kMb5TcBB/SS-SITI.jpg", url: `${STREAM_HOST}/dl/6adf90a06e979983cdce6357` },            
            { id: "sembang_seram_5", name: "Norreen Iman Part 1 - Pekak Akibat Buatan Hantu", poster: "https://i.postimg.cc/J0Z4t19X/SS-NOREEN-1.jpg", url: `${STREAM_HOST}/dl/6adf5a106e979983cdce6330` },
            { id: "sembang_seram_6", name: "Norreen Iman Part 2 - Kena Kacau Kat Set", poster: "https://i.postimg.cc/nrBcMH69/SS-NOREEN-2.jpg", url: `${STREAM_HOST}/dl/6adf5a106e979983cdce6331` },
            { id: "sembang_seram_7", name: "Jihaa Sham Part 4 - Kembali Menghantui Studio", poster: "https://i.postimg.cc/7P2LKVfg/SS-Jiha-Sham-4.jpg", url: `${STREAM_HOST}/dl/6adf5a0d6e979983cdce632e` },
            { id: "sembang_seram_8", name: "Dedek & Pak Azad Terjah Banglo Tengku Kudin", poster: "https://i.postimg.cc/gJf2YwBH/SS-AZAD-2.jpg", url: `${STREAM_HOST}/dl/6adf5a056e979983cdce632b` },
            { id: "sembang_seram_9", name: "Harris Annuar Part 3 - Nak Bunuh Diri Akibat Was-Was", poster: "https://i.postimg.cc/nz6hHswm/SS-HARIS.jpg", url: `${STREAM_HOST}/dl/6adf5a056e979983cdce632d` },
            { id: "sembang_seram_10", name: "Liyana Jasmay Part 2 - Semalaman Diganggu Pocong", poster: "https://i.postimg.cc/ZR15T9D5/SS-LIYANA-2.jpg", url: `${STREAM_HOST}/dl/6adf5a0d6e979983cdce632f` },
            { id: "sembang_seram_11", name: "Ustaz Zulkarnain - Diganggu Mayat Hidup", poster: "https://i.postimg.cc/sXtgVB0S/SS-US-ZULKARNAI.jpg", url: `${STREAM_HOST}/dl/6adf5ac86e979983cdce6334` },
            { id: "sembang_seram_12", name: "Yasin Sulaiman - Pahit Sengsara Kehidupan Di Neraka Dunia", poster: "https://i.postimg.cc/W3Q12Dfm/SS-YASIN.jpg", url: `${STREAM_HOST}/dl/6adf5ac86e979983cdce6332` },
            { id: "sembang_seram_13", name: "Sophia Albarakbah - Didatangi Budak Tanpa Wajah Di Mimaland", poster: "https://i.postimg.cc/Y9JCp4yw/SS-SOPHIA.jpg", url: `${STREAM_HOST}/dl/6adf5ac86e979983cdce6333` },
            { id: "sembang_seram_14", name: "Riz Amin - Termakan Mee Bunian Ada Lembaga Wanita", poster: "https://i.postimg.cc/ydw8VJrK/SS-RIZ.jpg", url: `${STREAM_HOST}/dl/6adf5ac86e979983cdce6335` },
            { id: "sembang_seram_15", name: "Pak Azad - Bini Dirasuk Menari Mak Yong", poster: "https://i.postimg.cc/mkC2hb0z/SS-AZAD-1.jpg", url: `${STREAM_HOST}/dl/6adf5ac86e979983cdce6336` },
            { id: "sembang_seram_16", name: "Mimi Lana - Dihantui Pocong Jelmaan Syafiq Kyle", poster: "https://i.postimg.cc/rmvw8dYr/SS-MIMI.jpg", url: `${STREAM_HOST}/dl/6adf62d66e979983cdce6337` },
            { id: "sembang_seram_17", name: "Dr Dhia - Bertentang Mata Dengan Jin Hitam Besar Bermata Merah", poster: "https://i.postimg.cc/xCkdDGgC/SS-DHIA.jpg", url: `${STREAM_HOST}/dl/6adf644d6e979983cdce6338` },
            { id: "sembang_seram_18", name: "Afdlin Shauki - Misteri 5 Bomoh", poster: "https://i.postimg.cc/MThpWcrc/SS-AFDLIN.jpg", url: `${STREAM_HOST}/dl/6adf644d6e979983cdce633a` },
            { id: "sembang_seram_19", name: "Amin & Fira - Peguam Bongkar Dunia Hitam Peguam", poster: "https://i.postimg.cc/6qn5T9DS/SS-LAWYER.jpg", url: `${STREAM_HOST}/dl/6adf644d6e979983cdce633d` },
            { id: "sembang_seram_20", name: "Aghniny Haque - Bila Jin Berkuasa Kita Lah Khadamnya", poster: "https://i.postimg.cc/hvTPhSkW/SS-AGHNINY.jpg", url: `${STREAM_HOST}/dl/6adf644d6e979983cdce6339` },
            { id: "sembang_seram_21", name: "Faridzuan - Perawat Susuk Terkejut Masih Ramai Amalkan Ilmu Susuk", poster: "https://i.postimg.cc/vBpZQ1Sb/SS-FARIDZUAN.jpg", url: `${STREAM_HOST}/dl/6adf64566e979983cdce633e` },
            { id: "sembang_seram_22", name: "Fitri - Bahana Santau Kaca Hanya Dengan Tiupan Angin", poster: "https://i.postimg.cc/rsxFz8vn/SS-FITRI.jpg", url: `${STREAM_HOST}/dl/6adf64566e979983cdce6340` },
            { id: "sembang_seram_23", name: "Hakim Abang Bomba - Misteri Panggilan Palsu Dari Tanah Perkuburan", poster: "https://i.postimg.cc/6qn5T9DD/SS-BOMBA.jpg", url: `${STREAM_HOST}/dl/6adf64566e979983cdce633f` },
            { id: "sembang_seram_24", name: "Hannah Delisha & Kakcik Wujud Part 1", poster: "https://i.postimg.cc/vTfHDQp7/SS-HANNAH-1.jpg", url: `${STREAM_HOST}/dl/6adf64566e979983cdce6341` },
            { id: "sembang_seram_25", name: "Eyra Hazali - Anak Kelahiran Istimewa Berkaitan Bunian", poster: "https://i.postimg.cc/ZnpK0T1L/SS-EYRA.jpg", url: `${STREAM_HOST}/dl/6adf644d6e979983cdce633b` },
            { id: "sembang_seram_26", name: "Bell Ngasri - Diganggu Hantu Nenek Kebayan Ala Siccin", poster: "https://i.postimg.cc/hvTPhSHN/SS-BELL.jpg", url: `${STREAM_HOST}/dl/6adf644d6e979983cdce633c` },
            { id: "sembang_seram_27", name: "Ikmal Amry - Kemalangan Misteri Diganggu Lembaga Wanita Bunian", poster: "https://i.postimg.cc/FFLKTZ7c/SS-IKMAL.jpg", url: `${STREAM_HOST}/dl/6adf654c6e979983cdce6343` },
            { id: "sembang_seram_28", name: "Mr Adem Part 4 - Pernah Ditanam Hidup-Hidup Dalam Keranda", poster: "https://i.postimg.cc/4493W5m4/SS-ADEM.jpg", url: `${STREAM_HOST}/dl/6adf654c6e979983cdce6345` },
            { id: "sembang_seram_29", name: "Puan Elee Forensic Cleaning - Diganggu Pontianak", poster: "https://i.postimg.cc/mD0gbc6W/SS-ELEE.jpg", url: `${STREAM_HOST}/dl/6adf654c6e979983cdce6342` },
            { id: "sembang_seram_30", name: "Hannah Delisha & Kakcik Wujud Part 2 - Buka Dybbuk Box", poster: "https://i.postimg.cc/tJWC7XLF/SS-HANNAH-2.jpg", url: `${STREAM_HOST}/dl/6adf654c6e979983cdce6344` },
            { id: "sembang_seram_31", name: "Zahiril Adzim Juvana - Pernah Nak Kena Rodok Dengan Pahat", poster: "https://i.postimg.cc/66vQM0yn/SS-ZAHIRIL.jpg", url: `${STREAM_HOST}/dl/6adf65546e979983cdce6348` },
            { id: "sembang_seram_32", name: "Solo Ambush - Dipanggil Penunggu Dayang Bunting Terjun Ke Tasik", poster: "https://i.postimg.cc/7P2LKVfH/SS-SOLO.jpg", url: `${STREAM_HOST}/dl/6adf65546e979983cdce6349` },
            { id: "sembang_seram_34", name: "Kak Jem Mastika Part 6 - Sukma Terkunci Minyak Penyantau", poster: "https://i.postimg.cc/HxJLD0zF/SS-KAK-6.jpg", url: `${STREAM_HOST}/dl/6adf654c6e979983cdce6347` },
            { id: "sembang_seram_35", name: "Abang Rahman Part 2 - Jenazah Tinggal Kulit Dan Rangka", poster: "https://i.postimg.cc/QtBMGgSZ/SS-KAK-2.jpg", url: `${STREAM_HOST}/dl/6adf8ea06e979983cdce634a` },
            { id: "sembang_seram_36", name: "Kak Jem Mastika Part 1 - Mati Hidup Kembali Didatangi Malaikat", poster: "https://i.postimg.cc/wvtB85Fp/SS-KAK-1.jpg", url: `${STREAM_HOST}/dl/6adf8ea06e979983cdce634b` },
            { id: "sembang_seram_37", name: "Abang Rahman Part 1 - Misteri Pekerjaan Trauma Cleaner", poster: "https://i.postimg.cc/k4kgnVhJ/SS-ARAHMAN-1.jpg", url: `${STREAM_HOST}/dl/6adf8ea06e979983cdce634c` },
            { id: "sembang_seram_38", name: "Kak Jem Part 7 - Misteri Saka Keturunan Ganjil", poster: "https://i.postimg.cc/TwyPMj0S/SS-KAK-7.jpg", url: `${STREAM_HOST}/dl/6adf8ea16e979983cdce634d` },
            { id: "sembang_seram_39", name: "Kak Jem Mastika Part 2 - Sumpahan Perjanjian Minyak Dagu", poster: "https://i.postimg.cc/QtBMGgSZ/SS-KAK-2.jpg", url: `${STREAM_HOST}/dl/6adf8ea16e979983cdce634f` },
            { id: "sembang_seram_40", name: "Disebalik Kejadian Jihaa Sham Dirasuk", poster: "https://i.postimg.cc/0jD2r8LZ/SS-JIHA-DISEBALIK.jpg", url: `${STREAM_HOST}/dl/6adf8ea16e979983cdce634e` },
            { id: "sembang_seram_41", name: "Kak Jem Mastika Part 5 Edisi Raya - Dia Terapung Hanya Berkepala", poster: "https://i.postimg.cc/XJZvSKLT/SS-KAK-5.jpg", url: `${STREAM_HOST}/dl/6adf8ffb6e979983cdce6351` },
            { id: "sembang_seram_42", name: "Nasir Abbas - Pengutip Mayat Ilmu Kebal Warisan Panglima", poster: "https://i.postimg.cc/66vQM0yp/SS-NASIR.jpg", url: `${STREAM_HOST}/dl/6adf8ffb6e979983cdce6354` },
            { id: "sembang_seram_43", name: "Kak Jem Mastika Part 4 - Jenazah Hidup Bangkit Menuntut Sesuatu", poster: "https://i.postimg.cc/50Htd5pc/SS-KAK-4.jpg", url: `${STREAM_HOST}/dl/6adf8ffb6e979983cdce6353` },
            { id: "sembang_seram_44", name: "Kak Jem Mastika Part 3 - Misteri Bulu Perindu", poster: "https://i.postimg.cc/W3D4LmSP/SS-KAK-3.jpg", url: `${STREAM_HOST}/dl/6adf8ffb6e979983cdce6355` },
            { id: "sembang_seram_45", name: "Pak Munawer Part 1 - Episode Terseram Sepanjang Zaman", poster: "https://i.postimg.cc/pT9dbQkd/SS-PAK-1.jpg", url: `${STREAM_HOST}/dl/6adf8ffb6e979983cdce6350` },
            { id: "sembang_seram_46", name: "Mawi - Detik Terakhir Roh Terpisah Meninggalkan Jasad", poster: "https://i.postimg.cc/dQy05BL3/SS-MAWI.jpg", url: `${STREAM_HOST}/dl/6adf8ffb6e979983cdce6352` },
            { id: "sembang_seram_47", name: "Pak Munawer Part 2 - Bongkar Misteri Di Sebalik Ilmu Hitam Nasi Kangkang", poster: "https://i.postimg.cc/637QJVz5/SS-PAK-2.jpg", url: `${STREAM_HOST}/dl/6adf90046e979983cdce6356` },
            { id: "sembang_seram_48", name: "Zai Dokter Mayat Part 3 - Tengkorak Mayat Korban Spirit Of The Coin", poster: "https://i.postimg.cc/CMqKcNzd/SS-ZAI-P3.jpg", url: `${STREAM_HOST}/dl/6adf90a06e979983cdce635a` },
            { id: "sembang_seram_49", name: "Ustaz Kazim Elias - Terseksa Akibat Disihir Hari Hari Didatangi Makhluk", poster: "https://i.postimg.cc/9X7fLprD/SS-USTAZ-KAZIM.jpg", url: `${STREAM_HOST}/dl/6adf90a06e979983cdce6358` },
            { id: "sembang_seram_50", name: "Rahim Sepahtu - Diganggu Hantu Laut Hampir Lemas Akibat Sampan Karam", poster: "https://i.postimg.cc/1Xw549LH/SS-RAHIM.jpg", url: `${STREAM_HOST}/dl/6adf90a06e979983cdce6359` },
            { id: "sembang_seram_51", name: "Pak Munawer Part 4 - Kalung Misteri Berantaikan 100 Tulang Tengkuk", poster: "https://i.postimg.cc/TwyPMjQG/SS-PAK-4.jpg", url: `${STREAM_HOST}/dl/6adf90d46e979983cdce635b` }
        ]
    },
    "kisah_sahabat_catalog": {
        id: "kisah_sahabat",
        catalogId: "kisah_sahabat_catalog",
        name: "Kisah Para Sahabat Nabi",
        poster: "https://i.postimg.cc/KjHf4vvH/Kisah-Sahabat.jpg",
        posterShape: "poster",
        description: "Koleksi Kisah Para Sahabat Nabi Muhammad SAW Oleh Ustaz Wadi Annuar.",
        episodes: createEpisodes([
            { title: "Nyawa Sebanyak Helaian Rambutnya Untuk Syahid (Bahagian 1)", url: "https://files.catbox.moe/wcvfir.mp4" },
            { title: "Nyawa Sebanyak Helaian Rambutnya Untuk Syahid (Bahagian 2)", url: "https://files.catbox.moe/zcfs7v.mp4" },
            { title: "Penjaga Rahsia Rasulullah (Bahagian 1)", url: "https://files.catbox.moe/zfu53u.mp4" },
            { title: "Penjaga Rahsia Rasulullah (Bahagian 2)", url: "https://files.catbox.moe/sf21kq.mp4" },
            { title: "Pernah Dihalal Darah Akhirnya Menjadi Pejuang Islam (Bahagian 1)", url: "https://files.catbox.moe/1mt5rk.mp4" },
            { title: "Pernah Dihalal Darah Akhirnya Menjadi Pejuang Islam (Bahagian 2)", url: "https://files.catbox.moe/25jmvh.mp4" },
            { title: "Saidina Anas, Pembantu Rasulullah (Bahagian 1)", url: "https://files.catbox.moe/4wkmwq.mp4" },
            { title: "Saidina Anas, Pembantu Rasulullah (Bahagian 2)", url: "https://files.catbox.moe/bedd23.mp4" },
            { title: "Sehinggakan Rasulullah ﷺ Menggelarkannya Kebajikan (Bahagian 1)", url: "https://files.catbox.moe/sannr9.mp4" },
            { title: "Sehinggakan Rasulullah ﷺ Menggelarkannya Kebajikan (Bahagian 2)", url: "https://files.catbox.moe/nripoi.mp4" },
            { title: "Seribu Dinar Habis Di Sedekah Sebelum Sampai Ke Rumah (Bahagian 1)", url: "https://files.catbox.moe/1nn3qk.mp4" },
            { title: "Seribu Dinar Habis Di Sedekah Sebelum Sampai Ke Rumah (Bahagian 2)", url: "https://files.catbox.moe/7logen.mp4" },
            { title: "Beliau Khalifah Pertama Islam Andai Tiada Abu Bakar (Bahagian 1)", url: "https://files.catbox.moe/tk0k2f.mp4" },
            { title: "Beliau Khalifah Pertama Islam Andai Tiada Abu Bakar (Bahagian 2)", url: "https://files.catbox.moe/c1hj32.mp4" },
            { title: "Dulu Seorang Raja Yang Pernah Ditawan Tentera Islam (Bahagian 1)", url: "https://files.catbox.moe/bog9y2.mp4" },
            { title: "Dulu Seorang Raja Yang Pernah Ditawan Tentera Islam (Bahagian 2)", url: "https://files.catbox.moe/cptiao.mp4" },
            { title: "JANGAN Lantik Beliau Panglima Perang.. Terlalu BERANI! (Bahagian 1)", url: "https://files.catbox.moe/8w4fx1.mp4" },
            { title: "JANGAN Lantik Beliau Panglima Perang.. Terlalu BERANI! (Bahagian 2)", url: "https://files.catbox.moe/d38404.mp4" },
            { title: "Membunuh 100 Musyrikin Dalam Pertarungan 1 Lawan 1 (Bahagian 1)", url: "https://files.catbox.moe/beiqu0.mp4" },
            { title: "Membunuh 100 Musyrikin Dalam Pertarungan 1 Lawan 1 (Bahagian 2)", url: "https://files.catbox.moe/g3sk9m.mp4" },
            { title: "Seorang Yang Buta Tetapi Merupakan Pemegang Panji Perang", url: "https://files.catbox.moe/hwp5xc.mp4" },
            { title: "Andai Iman Ini Di Bintang Suraya, Nescaya Dicapai Pemuda Ini", url: "https://files.catbox.moe/d7f7gs.mp4" },
            { title: "Ayah & Anak Syahid Di Medan Yang Sama", url: "https://files.catbox.moe/sdzl00.mp4" },
            { title: "Beliau Adalah Panglima Pertama Misi Ketenteraan", url: "https://files.catbox.moe/m0zape.mp4" },
            { title: "Dialah Yang Pertama Memberi Salam Kepada Rasulullah ﷺ", url: "https://files.catbox.moe/ekaiht.mp4" },
            { title: "Meminta Simpan Jenazah Di Pintu Gerbang Utama Konstantinopel", url: "https://files.catbox.moe/ewxgop.mp4" },
            { title: "Si Pembunuh Tertunduk Malu Di Hadapan Rasulullah ﷺ", url: "https://files.catbox.moe/i9sqq7.mp4" },
            { title: "Mempunyai Suara Bacaan Al-Quran Yang Merdu", url: "https://files.catbox.moe/gze5xs.mp4" }
        ])
    },
    "siri_ustazwadi_catalog": {
        id: "siri_ustazwadi_catalog",
        isMulti: true,
        items: [
         { id: "siri_ustazwadi_kisah_nabi_daud_as", name: "Kisah Nabi Daud AS", poster: "https://i.postimg.cc/gkZg0Kgb/Nabi-Daud.jpg", url: `${STREAM_HOST}/dl/6ae212a66e979983cdce6455` },
         { id: "siri_ustazwadi_rasulullah_saw_bertemu_para_nabi", name: "Rasulullah SAW Bertemu Para Nabi", poster: "https://i.postimg.cc/9QHJwqkc/Rasullah-Para-Nabi.jpg", url: `${STREAM_HOST}/dl/6ae211d06e979983cdce6448` },
         { id: "siri_ustazwadi_kaum_luth_moden", name: "Kaum Luth Moden", poster: "https://i.postimg.cc/VLCKNFK8/Luth-Moden.jpg", url: `${STREAM_HOST}/dl/6ae211da6e979983cdce644f` },
         { id: "siri_ustazwadi_kisah_maryam_mengandungkan_nabi_isa_as", name: "Kisah Maryam Mengandungkan Nabi Isa AS", poster: "https://i.postimg.cc/pLMq5nSr/Kisah-Maryam.jpg", url: `${STREAM_HOST}/dl/6ae211da6e979983cdce6451` },
         { id: "siri_ustazwadi_rupa_paras_rasulullah_saw", name: "Rupa Paras Rasulullah SAW", poster: "https://i.postimg.cc/X7Csvgs0/Rupa-Rasulullah.jpg", url: `${STREAM_HOST}/dl/6ae211d86e979983cdce644e` },
         { id: "siri_ustazwadi_kaum_sodom_yang_diazab", name: "Kaum Sodom Yang Diazab", poster: "https://i.postimg.cc/cLGXt8zH/Sodom.jpg", url: `${STREAM_HOST}/dl/6ae211da6e979983cdce6450` },
         { id: "siri_ustazwadi_zulkarnain_raja_yang_digeruni_yajuj_majuj", name: "Zulkarnain - Raja Yang Digeruni Ya'juj & Ma'juj", poster: "https://i.postimg.cc/02wVNCV6/Raja-Yang-Digeruni.jpg", url: `${STREAM_HOST}/dl/6ae211d06e979983cdce644c` },
         { id: "siri_ustazwadi_kenapa_abu_thalib_tidak_mampu_mengucap_syahadah_saat_sakaratul_maut", name: "Kenapa_Abu_Thalib_Tidak_Mampu_Mengucap_Syahadah_Saat_Sakaratul_Maut", poster: "https://i.postimg.cc/gkZg0Kgp/Abu-Thalib.jpg", url: `${STREAM_HOST}/dl/6ae211d06e979983cdce6449` },
         { id: "siri_ustazwadi_kenapa_dengan_kaum_nabi_luth", name: "Kenapa Dengan Kaum Nabi Luth", poster: "https://i.postimg.cc/VLCKNFKd/Nabi-Luth.jpg", url: `${STREAM_HOST}/dl/6ae211d06e979983cdce644a` },
         { id: "siri_ustazwadi_kisah_nabi_zulkarnain_dengan_yajuj_majuj", name: "Kisah Nabi Zulkarnain Dengan Ya'juj & Ma'juj", poster: "https://i.postimg.cc/gkZg0Kgj/Ya-juj-Ma-juj.jpg", url: `${STREAM_HOST}/dl/6ae212a66e979983cdce6457` },
         { id: "siri_ustazwadi_kisah_nabi_yusuf", name: "Kisah Nabi Yusuf AS", poster: "https://i.postimg.cc/wBWDQYnH/Whats-App-Image-2026-10-30-at-10-19-01-AM.jpg", url: `${STREAM_HOST}/dl/6ae3fafd6e979983cdce665d` },
         { id: "siri_ustazwadi_kelebihan_nabi_idris", name: "Kelebihan Nabi Idris AS", poster: "https://i.postimg.cc/pd0KJM3H/Whats-App-Image-2026-10-30-at-10-19-01-AM-(1).jpg", url: `${STREAM_HOST}/dl/6ae3fafd6e979983cdce665c` },

        ]
    },
    "sirah_nabi_catalog": {
        id: "sirah_nabi",
        catalogId: "sirah_nabi_catalog",
        name: "Kisah Perjalanan Hidup Nabi Muhammad SAW",
        poster: "https://i.postimg.cc/D0JLz54z/Sirah-UAS.jpg",
        posterShape: "poster",
        description: "Kisah Perjalanan Hidup Nabi Muhammad SAW Oleh Ustaz Azlan Shah.",
        episodes: createEpisodes([
            { title: "Ep 1 - Penerokaan Kota Mekah Sirah Impak Sosial Kisah Kehidupan Nabi", url: `${STREAM_HOST}/dl/6ad8b1db6e979983cdce60de` },
            { title: "Ep 2 - Reformasi Ekonomi Masyarakat Kota Mekah Sirah Impak Sosial", url: `${STREAM_HOST}/dl/6ad8b1db6e979983cdce60dc` },
            { title: "Ep 3 - Kisah Ghulam dan Keimanan Ashabul Ukhdud Sirah Impak Sosial", url: `${STREAM_HOST}/dl/6ad8a48f6e979983cdce60d4` },
            { title: "Ep 4 - Kejatuhan Tentera Bergajah Abrahah Sirah Impak Sosial", url: `${STREAM_HOST}/dl/6ad8a4996e979983cdce60d9` },
            { title: "Ep 5 - Kelahiran Nabi Muhammad SAW", url: `${STREAM_HOST}/dl/6ad8a48f6e979983cdce60d1` },
            { title: "Ep 6 - Rezeki Halimah As Sa'diah mengambil Nabi Muhammad SAW", url: `${STREAM_HOST}/dl/6ad8a4996e979983cdce60d8` },
            { title: "Ep 7 - Zaman Kanak-kanak Nabi Muhammad SAW (Penyusuan)", url: `${STREAM_HOST}/dl/6ad8a4976e979983cdce60d7` },
            { title: "Ep 8 - Zaman Kanak-kanak Nabi Muhammad SAW (Bermain)", url: `${STREAM_HOST}/dl/6ad8a48f6e979983cdce60d2` },
            { title: "Ep 9 - Nabi Muhammad SAW, anak yatim membesar dalam kesusahan", url: `${STREAM_HOST}/dl/6ad8a48f6e979983cdce60d5` },
            { title: "Ep 10 - Nabi Muhammad SAW ke Syam Bersama Abu Talib & Perlindungan", url: `${STREAM_HOST}/dl/6ad8a48f6e979983cdce60d3` },
            { title: "Ep 11 - Modul Kepimpinan Para Nabi", url: `${STREAM_HOST}/dl/6ad8a3d66e979983cdce60cb` },
            { title: "Ep 12 - Perperangan Al Fijar & Perjanjian Al Fudhul Sirah Nabi Muhammad", url: `${STREAM_HOST}/dl/6ad8a3df6e979983cdce60ce` },
            { title: "Ep 13 - Perkenalan dan perkahwinan dengan Khadijah RA Sirah Nabi Muhammad", url: `${STREAM_HOST}/dl/6ad8a3d66e979983cdce60cc` },
            { title: "Ep 14 - Kerosakan Masyarakat Jahiliyah & Kisah Zaid bin Haarithah", url: `${STREAM_HOST}/dl/6ad8a3d66e979983cdce60c8` },
            { title: "Ep 15 - Mencari Kebenaran sebelum Kenabian, Kisah Zaid bin Amr bin", url: `${STREAM_HOST}/dl/6ad8b1db6e979983cdce60db` },
            { title: "Ep 16 - Pembinaan Semula Kaabah & Sejarah Hajar Al-Aswad", url: `${STREAM_HOST}/dl/6ad8a3da6e979983cdce60cd` },
            { title: "Ep 17 - Keadaan Dunia Sebelum Nabi Menerima Wahyu", url: `${STREAM_HOST}/dl/6ad8a3d66e979983cdce60ca` },
            { title: "Ep 18 - Permulaan Turun Wahyu Pertama", url: `${STREAM_HOST}/dl/6ad8a3df6e979983cdce60cf` },
            { title: "Ep 19 - Impak Wahyu Pertama & Dakapan Khadijah RA", url: `${STREAM_HOST}/dl/6ad8a3d66e979983cdce60c9` },
            { title: "Ep 20 - Wahyu terputus & surah-surah terawal", url: `${STREAM_HOST}/dl/6ad8a3d66e979983cdce60c7` },
            { title: "Ep 21 - 10 Muslim & ibadah terawal", url: `${STREAM_HOST}/dl/6ad8b1db6e979983cdce60dd` },
            { title: "Ep 22 - Legasi Perjuangan Nabi Ibrahim AS dan Muhammad SAW", url: `${STREAM_HOST}/dl/6ad8b1db6e979983cdce60df` },
            { title: "Ep 23 - Strategi Dakwah Tertutup & Penubuhan Markas", url: `${STREAM_HOST}/dl/6ad8b1e36e979983cdce60e0` },
            { title: "Ep 24 - Strategi Dakwah Terbuka & Kecaman Pertama", url: `${STREAM_HOST}/dl/6ad8b1e36e979983cdce60e1` },
            { title: "Ep 25 - Tekanan Emosi & Larangan Membaca Al-Quran", url: `${STREAM_HOST}/dl/6ad8b1e36e979983cdce60e2` },
            { title: "Ep 26 - Kempen Serangan Peribadi & Ejekkan", url: `${STREAM_HOST}/dl/6ad8b1e36e979983cdce60e3` },
            { title: "Ep 27 - Penyiksaan Fizikal & Mental Terhadap Golongan Lemah", url: `${STREAM_HOST}/dl/6ad8b1e96e979983cdce60e4` },
            { title: "Ep 28 - Dakwah Tauhid & Keadilan Sosial", url: `${STREAM_HOST}/dl/6ad8b1e96e979983cdce60e5` },
            { title: "Ep 29 - Quraish dapatkan bantuan Yahudi & Hijrah Pertama ke Afrika", url: `${STREAM_HOST}/dl/6ad8b1ee6e979983cdce60e6` },
            { title: "Ep 30 - Peristiwa Quraish Sujud & Hijrah Kedua ke Afrika", url: `${STREAM_HOST}/dl/6ad8b1ee6e979983cdce60e7` },
            { title: "Ep 31 - Kisah Pemelukan Islam Hamzah RA & Omar al Khattab RA", url: `${STREAM_HOST}/dl/6ad8b1ee6e979983cdce60e8` },
            { title: "Ep 32 - Sekatan Ekonomi & Derita Boikot", url: `${STREAM_HOST}/dl/6ad8b21a6e979983cdce60e9` },
            { title: "Ep 33 - Rundingan Terakhir & Kematian Abu Talib", url: `${STREAM_HOST}/dl/6ad8b21f6e979983cdce60ea` },
            { title: "Ep 34 - Kewafatan Isteri Tercinta Khadijah RadhiaAllahu ‘anha", url: `${STREAM_HOST}/dl/6ad8b21f6e979983cdce60eb` },
            { title: "Ep 35 - Tragedi Taif Hari Terburuk Kehidupan Nabi Muhammad SAW", url: `${STREAM_HOST}/dl/6ad8b21f6e979983cdce60ec` },
            { title: "Ep 36 - Doa Mengharungi Keresahan & Kesedihan Mendalam", url: `${STREAM_HOST}/dl/6ad8b2206e979983cdce60ed` },
            { title: "Ep 37 - Jin Masuk Islam, Non-Muslim Lindungi Nabi SAW", url: `${STREAM_HOST}/dl/6ad8b2206e979983cdce60ee` },
            { title: "Ep 38 - Perjalanan Teragung Isra’ wal Mikraj", url: `${STREAM_HOST}/dl/6ad8b22b6e979983cdce60ef` },
            { title: "Ep 39 - Nabi SAW Melihat Azab Pelaku Dosa-Dosa Besar", url: `${STREAM_HOST}/dl/6ad8b22d6e979983cdce60f0` },
            { title: "Ep 40 - Impak Piala Dunia, Nabi SAW Melihat Keindahan Syurga", url: `${STREAM_HOST}/dl/6ad8b22d6e979983cdce60f1` },
            { title: "Ep 41 - Bertemu Allah SWT & Anugerah Teragung", url: `${STREAM_HOST}/dl/6ad8b22d6e979983cdce60f2` },
            { title: "Ep 42 - Solat Teras Keseimbangan Hidup", url: `${STREAM_HOST}/dl/6ad8b2566e979983cdce60f3` },
            { title: "Ep 43 - Perjalanan Langit Didustakan oleh Penduduk Bumi", url: `${STREAM_HOST}/dl/6ad8b25c6e979983cdce60f4` },
            { title: "Ep 44 - Mencari Pangkalan Dakwah Baru", url: `${STREAM_HOST}/dl/6ad8b25c6e979983cdce60f5` },
            { title: "Ep 45 - Enam Anak Muda Perintis Kota Nabi SAW", url: `${STREAM_HOST}/dl/6ad8a48f6e979983cdce60d6` },
            { title: "Ep 46 - Duta Dakwah & Guru Pertama ke Yathrib", url: `${STREAM_HOST}/dl/6ad8b25c6e979983cdce60f6` }
        ])
    },
    "ustaz_azlan_catalog": {
        id: "ustaz_azlan_catalog",
        isMulti: true,
        items: [
            { id: "uas_prolog_kehidupan_nabi_muhammad_saw", name: "Prolog - Kehidupan Nabi Muhammad SAW", poster: "https://i.postimg.cc/DZ7439XT/1.jpg", url: `${STREAM_HOST}/dl/6ad8a3df6e979983cdce60d0` },
            { id: "uas_prolog_2_cahaya_wahyu_reformasi_kehidupan", name: "Prolog 2 - Cahaya Wahyu & Reformasi Kehidupan", poster: "https://i.postimg.cc/50fQWhCM/2.jpg", url: `${STREAM_HOST}/dl/6ad8b25c6e979983cdce60f7` },
            { id: "uas_zaid_ibn_amr_perjalanan_mencari_kebenaran_wahyu", name: "Zaid Ibn Amr Perjalanan Mencari Kebenaran & Wahyu", poster: "https://i.postimg.cc/HxT81qy1/3.jpg", url: `${STREAM_HOST}/dl/6ad8a1ff6e979983cdce60bd` },
            { id: "uas_tsumamah_ibn_uthal_ra_kisah_akhlak_quran_menawan_hati", name: "Tsumamah ibn Uthal RA Kisah Akhlak Quran Menawan Hati", poster: "https://i.postimg.cc/G2bTnWyw/4.jpg", url: `${STREAM_HOST}/dl/6ad8a1ff6e979983cdce60be` },
            { id: "uas_singa_allah_rasulnya_kisah_hamzah_bin_abdul_muttalib_ra", name: "Singa Allah & RasulNya Kisah Hamzah bin Abdul Muttalib RA", poster: "https://i.postimg.cc/XJnB6Rym/5.jpg", url: `${STREAM_HOST}/dl/6ad8a1ff6e979983cdce60bf` },
            { id: "uas_ikhlas_mencari_kebenaran_kisah_perit_salman_al_farisi_ra", name: "Ikhlas Mencari Kebenaran Kisah perit Salman Al Farisi RA", poster: "https://i.postimg.cc/J05qWfxT/10.jpg", url: `${STREAM_HOST}/dl/6ad8a1ff6e979983cdce60c0` },
            { id: "uas_ummu_salamah_ra_kisah_pengorbanan_kebijaksanaan_isteri_rasulullah", name: "Ummu Salamah RA Kisah Pengorbanan & Kebijaksanaan Isteri Rasulullah", poster: "https://i.postimg.cc/PfSpBfQh/12.jpg", url: `${STREAM_HOST}/dl/6ad8a1ff6e979983cdce60c1` },
            { id: "uas_zaynab_bint_jahsh_ra_isteri_nabi_dengan_tangan_paling_panjang", name: "Zaynab bint Jahsh RA Isteri Nabi dengan Tangan Paling Panjang", poster: "https://i.postimg.cc/9McwH6qk/6.jpg", url: `${STREAM_HOST}/dl/6ad8a2006e979983cdce60c2` },
            { id: "uas_maulidur_rasul_saw_cinta_tanah_air_perpaduan", name: "Maulidur Rasul SAW Cinta Tanah Air & Perpaduan", poster: "https://i.postimg.cc/SsmYbBzg/9.jpg", url: `${STREAM_HOST}/dl/6ad8a2026e979983cdce60c3` },
            { id: "uas_adab_cerminan_hati", name: "Adab Cerminan Hati", poster: "https://i.postimg.cc/j5RnYpJZ/8.jpg", url: `${STREAM_HOST}/dl/6ad8a2076e979983cdce60c4` },
            { id: "uas_persahabatan_nabi_muhammad_saw_malaikat_jibril_as", name: "Persahabatan Nabi Muhammad SAW & Malaikat Jibril AS", poster: "https://i.postimg.cc/63B4xkGm/7.jpg", url: `${STREAM_HOST}/dl/6ad8a2076e979983cdce60c5` },
            { id: "uas_refleksi_sirah_maulidur_rasul", name: "Refleksi Sirah Maulidur Rasul", poster: "https://i.postimg.cc/wvh5hCSn/11.jpg", url: `${STREAM_HOST}/dl/6ad8a2086e979983cdce60c6` }
        ]
    },
    "ustaz_amin_catalog": {
        id: "ustaz_amin_catalog",
        isMulti: true,
        items: [
            { id: "ua_kajian", name: "Ilmu Orang Melayu - Sambung Besi Dengan Tanah Liat", poster: "https://i.postimg.cc/3wL2FQVL/Whats-App-Image-2026-10-30-at-10-19-04-AM.jpg", url: `${STREAM_HOST}/dl/6ae3ee136e979983cdce6640` },
            { id: "ua_besi_dari_langit", name: "Besi Dari Langit", poster: "https://i.postimg.cc/CKvbspXJ/Whats-App-Image-2026-10-30-at-10-19-04-AM-(1).jpg", url: `${STREAM_HOST}/dl/6ae3ee136e979983cdce663e` },
            { id: "ua_peta_lama", name: "Peta Lama Tanah Melayu", poster: "https://i.postimg.cc/XvNw5YHR/Whats-App-Image-2026-10-30-at-10-19-04-AM-(2).jpg", url: `${STREAM_HOST}/dl/6ae3ee136e979983cdce6643` },
            { id: "ua_fakta_sains", name: "Mengapa Angkasa Gelap - Kehebatan Cap Jari", poster: "https://i.postimg.cc/1zRpF3CL/Whats-App-Image-2026-10-30-at-10-19-05-AM.jpg", url: `${STREAM_HOST}/dl/6ae3ee136e979983cdce6641` },
            { id: "ua_bisikan_syaitan", name: "Bisikan Syaitan Yang Ada Pada Manusia", poster: "https://i.postimg.cc/Ls4zP8Cw/Whats-App-Image-2026-10-30-at-10-19-05-AM-(1).jpg", url: `${STREAM_HOST}/dl/6ae3ee136e979983cdce663f` },
            { id: "ua_eropah_kaya_sebab_mereka_merampas", name: "Eropah Kaya - Rampas Emas dari Sumatera", poster: "https://i.postimg.cc/SKQW9xTP/Whats-App-Image-2026-10-30-at-10-19-05-AM-(2).jpg", url: `${STREAM_HOST}/dl/6ae3ee136e979983cdce6642` },
            { id: "ua_makhluk_aneh_di_tanah_melayu", name: "Makhluk Aneh Di Tanah Melayu - Duyung Itu Wujud", poster: "https://i.postimg.cc/TP2rb374/Whats-App-Image-2026-10-30-at-10-19-06-AM.jpg", url: `${STREAM_HOST}/dl/6ae3ee1b6e979983cdce6644` },
            { id: "ua_akhirnya_terbongkar_agenda", name: "Akhirnya Terbongkar Agenda Mereka", poster: "https://i.postimg.cc/Gp3kDm7S/Whats-App-Image-2026-10-30-at-10-19-06-AM-(1).jpg", url: `${STREAM_HOST}/dl/6ae3ee1b6e979983cdce6645` },
            { id: "ua_rahsia_ilmu_orang_melayu_sambung", name: "Ilmu Orang Melayu - Sambung Besi Dengan Tanah Liat", poster: "https://i.postimg.cc/vm8WnZqP/Whats-App-Image-2026-10-30-at-10-19-06-AM-(2).jpg", url: `${STREAM_HOST}/dl/6ae3ee1b6e979983cdce6646` },
            { id: "ua_dna_orang_melayu_yang_dirahsiakan", name: "DNA Orang Melayu Yang Dirahsiakan", poster: "https://i.postimg.cc/3wrgGxSt/Whats-App-Image-2026-10-30-at-10-19-06-AM-(3).jpg", url: `${STREAM_HOST}/dl/6ae3ee1b6e979983cdce6647` },
            { id: "ua_tembok_pemisah_yakjuj_makjuj", name: "Tembok Pemisah Yakjuj Makjuj", poster: "https://i.postimg.cc/ZqYrN57L/Whats-App-Image-2026-10-30-at-10-19-07-AM.jpg", url: `${STREAM_HOST}/dl/6ae3efc16e979983cdce664b` },
            { id: "ua_jika_pintu_ini_dibuka", name: "Yahudi Takut Kalau Pintu Ini Terbuka", poster: "https://i.postimg.cc/jjqzfSgX/Whats-App-Image-2026-10-30-at-10-19-07-AM-(1).jpg", url: `${STREAM_HOST}/dl/6ae3efc16e979983cdce664d` },
            { id: "ua_kenapa_barat_sukar_terima_perubatan", name: "Kenapa Barat Sukar Terima Perubatan Melayu", poster: "https://i.postimg.cc/0N5pSyWc/Whats-App-Image-2026-10-30-at-10-19-07-AM-(2).jpg", url: `${STREAM_HOST}/dl/6ae3efc16e979983cdce664c` },
            { id: "ua_yakjuj_makjuj_terperangkap", name: "Ya'juj Ma'juj Terperangkap Di Sebalik Gunung Ini", poster: "https://i.postimg.cc/q7B8Kvbx/Whats-App-Image-2026-10-30-at-10-19-08-AM.jpg", url: `${STREAM_HOST}/dl/6ae3efc16e979983cdce664a` },

        ]
    },
    "ustaz_auni_catalog": {
        id: "ustaz_auni_catalog",
        isMulti: true,
        items: [
            { id: "uam_nabi_hud_as", name: "Nabi Hud AS", poster: "https://i.postimg.cc/QtXLgbRc/NABI-HUD.jpg", url: `${STREAM_HOST}/dl/6adb792b6e979983cdce6182` },
            { id: "uam_tragedi_qabil_habil", name: "Tragedi Qabil & Habil", poster: "https://i.postimg.cc/j5sV6XGN/QABIL-amp-HABIL.jpg", url: `${STREAM_HOST}/dl/6adb792b6e979983cdce6181` },
            { id: "uam_mengapa_musa_disebut_banyak_kali_di_dalam_al_quran", name: "Mengapa Musa Disebut Banyak Kali Di Dalam Al-Quran", poster: "https://i.postimg.cc/Y985dFHs/NABI-MUSA-DISEBUT.jpg", url: `${STREAM_HOST}/dl/6adb792b6e979983cdce6186` },
            { id: "uam_ashabul_rass_ashabul_sabt", name: "Ashabul Rass & Ashabul Sabt", poster: "https://i.postimg.cc/SQnrj9Pj/A-RASS-amp-A-SABT.jpg", url: `${STREAM_HOST}/dl/6adb792b6e979983cdce6184` },
            { id: "uam_nabi_adam_as", name: "Nabi Adam AS", poster: "https://i.postimg.cc/rw3ZFJVM/NABI-ADAM-AS.jpg", url: `${STREAM_HOST}/dl/6adb79366e979983cdce618a` },
            { id: "uam_abrahah_tentera_bergajah", name: "Abrahah & Tentera Bergajah", poster: "https://i.postimg.cc/d1nb5CY4/ABRAHAH-amp-TAHUN-GAJAH.jpg", url: `${STREAM_HOST}/dl/6adb85a06e979983cdce6194` },
            { id: "uam_haikal_sulaiman", name: "Haikal Sulaiman", poster: "https://i.postimg.cc/wvmpjM8P/HAIKAL-SULAIMAN.jpg", url: `${STREAM_HOST}/dl/6adb792b6e979983cdce6185` },
            { id: "uam_kisah_nabi_idris_akhnukh", name: "Kisah Nabi Idris (Akhnukh)", poster: "https://i.postimg.cc/cLSMDbLw/NABI-IDRIS-AS.jpg", url: `${STREAM_HOST}/dl/6adb792b6e979983cdce6183` },
            { id: "uam_khidir_nabi_musa", name: "Khidir & Nabi Musa", poster: "https://i.postimg.cc/Bv5zYF3n/NABI-KHIDIR-AS.jpg", url: `${STREAM_HOST}/dl/6adb79346e979983cdce6187` },
            { id: "uam_petempur_terbilang_zubair_bin_al_awwam", name: "Petempur Terbilang - Zubair Bin Al Awwam", poster: "https://i.postimg.cc/6q3DgQ6B/ZUBAIR-AL-AWWAM.jpg", url: `${STREAM_HOST}/dl/6adb79346e979983cdce6189` },
            { id: "uam_iktibar_al_kahfi", name: "Iktibar Al Kahfi", poster: "https://i.postimg.cc/Gt2ZVp3r/IKTIBAR-AL-KAHFI.jpg", url: `${STREAM_HOST}/dl/6adb79346e979983cdce6188` },
            { id: "uam_sejarah_peperangan_islam", name: "Sejarah Peperangan Islam", poster: "https://i.postimg.cc/jq3VNyvd/SEJARAH-PEPERANGAN-ISLAM.jpg", url: `${STREAM_HOST}/dl/6adb79c36e979983cdce6190` },
            { id: "uam_turunnya_nabi_isa_as_20", name: "Turun'nya Nabi Isa AS 2.0", poster: "https://i.postimg.cc/C51WXKM1/TURUNNYA-NABI-ISA-V2.jpg", url: `${STREAM_HOST}/dl/6adb79c36e979983cdce618c` },
            { id: "uam_matahari_di_tangan_nabi_allah_yusyak", name: "Matahari Di Tangan Nabi Allah Yusyak", poster: "https://i.postimg.cc/tCfNh4Lz/NABI-YUSYA-039-AS.jpg", url: `${STREAM_HOST}/dl/6adb79c36e979983cdce618f` },
            { id: "uam_keluarga_besar_rasulullah_saw", name: "Keluarga Besar Rasulullah SAW", poster: "https://i.postimg.cc/zD2mWTp8/KELUARGA-BESAR-RASULULLAH.jpg", url: `${STREAM_HOST}/dl/6adb79c36e979983cdce618b` },
            { id: "uam_kisah_akhnas_nabi_nabi", name: "Kisah Akhnas & Nabi-Nabi", poster: "https://i.postimg.cc/8kX8WLws/KISAH-AKHNAS-amp-NABI-NABI.jpg", url: `${STREAM_HOST}/dl/6adb79c36e979983cdce618e` },
            { id: "uam_sejarah_nabi_nuh_as", name: "Sejarah Nabi Nuh AS", poster: "https://i.postimg.cc/D0wPcJfK/NABI-NUH-AS.jpg", url: `${STREAM_HOST}/dl/6adb79c36e979983cdce618d` },
            { id: "uam_nabi_sulaiman_ratu_balqis_v2", name: "Nabi Sulaiman & Ratu Balqis V2", poster: "https://i.postimg.cc/HnhfgCjX/NABI-SULAIMAN-amp-RATU-BALQIS.jpg", url: `${STREAM_HOST}/dl/6adb79ce6e979983cdce6192` },
            { id: "uam_kisah_nabi_musa_dan_bani_israel", name: "KISAH NABI MUSA DAN BANI ISRAEL", poster: "https://i.postimg.cc/d3xzYKD2/NABI-MUSA-amp-BANI-ISRAEL.jpg", url: `${STREAM_HOST}/dl/6adb79cb6e979983cdce6191` },
            { id: "uam_kisah_nabi_habakuk_yang_ramai_tidak_tahu", name: "Kisah Nabi Habakuk Yang Ramai Tidak Tahu", poster: "https://i.postimg.cc/SNzMb7vR/HABAKUK.jpg", url: `${STREAM_HOST}/dl/6adb79ce6e979983cdce6193` },
            { id: "uam_keturunan", name: "Kaitan Keturunan Firaun", poster: "https://i.postimg.cc/R0PwLx25/Whats-App-Image-2026-10-30-at-10-19-02-AM-(1).jpg", url: `${STREAM_HOST}/dl/6ae3f0af6e979983cdce6651` },
            { id: "uam_bayangan_seksaan_manusia", name: "Bayangan Seksaan Manusia Yang Nabi Telah Lihat", poster: "https://i.postimg.cc/W490wcxR/Whats-App-Image-2026-10-30-at-10-19-02-AM-(2).jpg", url: `${STREAM_HOST}/dl/6ae3f0af6e979983cdce664f` },
            { id: "uam_alam_jin", name: "Alam Jin", poster: "https://i.postimg.cc/nLdqGfgy/Whats-App-Image-2026-10-30-at-10-19-02-AM-(3).jpg", url: `${STREAM_HOST}/dl/6ae3f0af6e979983cdce664e` },
            { id: "uam_siapakah_zulkarnain", name: "Siapakah Zulkarnain", poster: "https://i.postimg.cc/HLSb91Rf/Whats-App-Image-2026-10-30-at-10-19-03-AM.jpg", url: `${STREAM_HOST}/dl/6ae3f0af6e979983cdce6653` },
            { id: "uam_kisah_nabi_khidir_nabi_musa", name: "Kisah Nabi Khidir & Nabi Musa", poster: "https://i.postimg.cc/hGCV1R6N/Whats-App-Image-2026-10-30-at-10-19-03-AM-(1).jpg", url: `${STREAM_HOST}/dl/6ae3f0b76e979983cdce6654` },
            { id: "uam_sejarah_rasul", name: "Sejarah Rasul", poster: "https://i.postimg.cc/438pQRqq/Whats-App-Image-2026-10-30-at-10-19-03-AM-(2).jpg", url: `${STREAM_HOST}/dl/6ae3f0af6e979983cdce6650` },
            { id: "uam_keberkatan_masa_dicabut", name: "Keberkatan Masa Dicabut", poster: "https://i.postimg.cc/Lsyj3Fw0/Whats-App-Image-2026-10-30-at-10-19-03-AM-(3).jpg", url: `${STREAM_HOST}/dl/6ae3f0af6e979983cdce6652` }
        ]
    },
    "tur_movies_catalog": {
        id: "tur_movies_catalog",
        isMulti: true,
        items: [
            { id: "tur_movies_siccin_2014", name: "Siccin 1", poster: "https://i.postimg.cc/tRrpQtkM/siccin1.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6d286e979983cdce62ea` },
            { id: "tur_movies_siccin_2_2015", name: "Siccin 2", poster: "https://i.postimg.cc/Pf6TszyS/siccin2.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6d286e979983cdce62eb` },
            { id: "tur_movies_siccin_3_2016", name: "Siccin 3", poster: "https://i.postimg.cc/Pf6Tszyy/siccin3.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6d2d6e979983cdce62ef` },
            { id: "tur_movies_siccin_4_2017", name: "Siccin 4", poster: "https://i.postimg.cc/7PBw8M9n/siccin4.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6d286e979983cdce62ec` },           
            { id: "tur_movies_siccin_5_2018", name: "Siccin 5", poster: "https://i.postimg.cc/Y2XMKfRf/siccin5.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6d326e979983cdce62f2` },
            { id: "tur_movies_siccin_6_2019", name: "Siccin 6", poster: "https://i.postimg.cc/kMjq3Fsw/siccin6.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6d286e979983cdce62ed` },
            { id: "tur_movies_siccin_7_2024", name: "Siccin 7", poster: "https://i.postimg.cc/MZsq2b5d/siccin7.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6d326e979983cdce62f0` },
            { id: "tur_movies_siccin_8_2025", name: "Siccin 8", poster: "https://i.postimg.cc/76091VLd/siccin-8.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6d2d6e979983cdce62ee` },
         ]
    },
    "eng_movies_catalog": {
        id: "eng_movies_catalog",
        isMulti: true,
        items: [
            { id: "eng_movies_mary_poppins_1964", name: "Mary Poppins", poster: "https://i.postimg.cc/BZV33cnZ/May-Poppins-DP.jpg", background: "https://i.postimg.cc/ZYMmmF55/Mary-Poppins-1964-WP.jpg", url: `${STREAM_HOST}/dl/6ae682517d36129c99d600c2` },
            { id: "eng_movies_mary_poppins_returns_2018", name: "Mary Poppins Returns", poster: "https://i.postimg.cc/MZFwwbpx/Mary-poppins-2018-DP.jpg", background: "https://i.postimg.cc/h45nnbtK/Marry-Poppins-WP.jpg", url: `${STREAM_HOST}/dl/6ae682637d36129c99d600c3` },
            { id: "eng_movies_the_secret_garden_1993", name: "The Secret Garden (1993)", poster: "https://i.postimg.cc/zDcNNSGY/The-Secret-Garden-1993-DP.jpg", background: "https://i.postimg.cc/66mKKLpX/The-Secret-Garden-1993-WP.jpg", url: `${STREAM_HOST}/dl/6ae682797d36129c99d600c4` },
            { id: "eng_movies_the_secret_garden_2020", name: "The Secret Garden (2020)", poster: "https://i.postimg.cc/bYBPPHwc/The-Secret-Garden-2020-DP.jpg", background: "https://i.postimg.cc/h45nnbPk/The-Secret-Garden-2020-WP.jpg", url: `${STREAM_HOST}/dl/6ae682a37d36129c99d600c6` },
            { id: "eng_movies_paddington_2014", name: "Paddington", poster: "https://i.postimg.cc/1RjSSc57/Paddington-2014-DP.jpg", background: "https://i.postimg.cc/SR3bGqv7/Paddington-2014-WP.jpg", url: `${STREAM_HOST}/dl/6ae682c57d36129c99d600c8` },
            { id: "eng_movies_paddington_2_2017", name: "Paddington 2", poster: "https://i.postimg.cc/SR3bGqvf/Paddington-2017-DP.jpg", background: "https://i.postimg.cc/Xqm6g3z9/Paddington-2017-WP.webp", url: `${STREAM_HOST}/dl/6ae682b67d36129c99d600c7` },
            { id: "eng_movies_a_series_of_unfortunate_events_2004", name: "A Series of Unfortunate Events", poster: "https://i.postimg.cc/rs329cPG/A-Series-of-Unfortunate-Events-2004-DP.jpg", background: "https://i.postimg.cc/tJwGzyMV/A-Series-of-Unfortunate-Events-2004-WP.jpg", url: `${STREAM_HOST}/dl/6ae682d87d36129c99d600c9` },
            { id: "eng_movies_bedknobs_and_broomsticks_1971", name: "Bedknobs and Broomsticks", poster: "https://i.postimg.cc/6qKGDtGb/Bedknobs-and-Broomsticks-(1971)-DP.jpg", background: "https://i.postimg.cc/SR4zwkzT/Bedknobs-and-Broomsticks-(1971)-WP.jpg", url: `${STREAM_HOST}/dl/6ae682e57d36129c99d600ca` },
            { id: "eng_movies_how_the_grinch_stole_christmas_2000", name: "How the Grinch Stole Christmas", poster: "https://i.postimg.cc/nzbgJJWH/How-the-Grinch-Stole-Christmas-DP.jpg" , background : "https://i.postimg.cc/V6qTshys/How-the-Grinch-Stole-Christmas-WP.webp", url: `${STREAM_HOST}/dl/6ae735326e979983cdce67fa` },
            { id: "eng_movies_lilo_and_stitch3", name: "Lilo and Stitch 2025", poster: "https://i.postimg.cc/Zn2zLZMq/Lilo-Stitch-DP-2025.jpg" , background : "https://i.postimg.cc/Y2zRZgQX/Lilo-and-Stitch-2025-WP.webp", url: `${STREAM_HOST}/dl/6ae6543c3a36aa61a17a7a9e` },
            { id: "eng_movies_aladdin2", name: "Aladdin 2019", poster: "https://i.postimg.cc/sxqCJyNx/Aladdin-2019-DP.jpg" , background : "https://i.postimg.cc/G3xKVYvz/Aladdin-2019-WP.jpg", url: `${STREAM_HOST}/dl/6ae65a0f57a1c542c414ba84` },
            { id: "eng_movies_the_little_mermaid4", name: "The Little Mermaid 2023", poster: "https://i.postimg.cc/8cjVWstT/The-Little-Mermaid-2023-DP.jpg" , background : "https://i.postimg.cc/kMvsz8Wc/The-Little-Mermaid-2023-WP.jpg", url: `${STREAM_HOST}/dl/6ae532336e979983cdce66b6` },
            { id: "eng_movies_cinderella4", name: "Cinderella 2021", poster: "https://i.postimg.cc/j2LrNCvG/Cinderella-2021-DP.webp" , background : "https://i.postimg.cc/J75xvJbV/Cinderella-2021-WP.png", url: `${STREAM_HOST}/dl/6ae65d91f19a3ee0ff532002` },
            { id: "eng_movies_moana3", name: "Moana 2026", poster: "https://i.postimg.cc/zBdrVTw6/Moana-2026-DP.jpg" , background : "https://i.postimg.cc/d369CPqv/Moana-2026-WP.webp", url: `${STREAM_HOST}/dl/6ae65e31f19a3ee0ff532003` },
            { id: "eng_movies_how_to_train_your_dragon4", name: "How to Train Your Dragon 2025", poster: "https://i.postimg.cc/0jnCSR9B/How-to-Train-Your-Dragon-2025-DP.jpg" , background : "https://i.postimg.cc/fyCvdnws/How-to-Train-Your-Dragon-2025-WP.jpg", url: `${STREAM_HOST}/dl/6ae66159dce7f9a73628491a` },
            { id: "eng_movies_the_addams_family1", name: "The Addams Family 1991", poster: "https://i.postimg.cc/0jFTMsBz/The-Addams-Family-1-DP.jpg" , background : "https://i.postimg.cc/026hGz1G/Addams-Family-WP.jpg", url: `${STREAM_HOST}/dl/6ae532f56e979983cdce66d8` },
            { id: "eng_movies_the_addams_family2", name: "The Addams Family 1993", poster: "https://i.postimg.cc/JnTLGj3t/The-Addams-Family-1993-DP.jpg" , background : "https://i.postimg.cc/L6qGkJFz/Addams-Family-Values-WP.jpg", url: `${STREAM_HOST}/dl/6ae53c646e979983cdce674f` },
            { id: "eng_movies_back_to_the_future1", name: "Back to the Future 1985", poster: "https://i.postimg.cc/PqZtS6Gz/Back-To-The-Future-1-DP.jpg" , background : "https://i.postimg.cc/xCs2cLGy/Back-To-The-Future-WP.png", url: `${STREAM_HOST}/dl/6ae532eb6e979983cdce66d4` },
            { id: "eng_movies_back_to_the_future2", name: "Back to the Future 1989", poster: "https://i.postimg.cc/0Qtsb7GG/Back-To-The-Future-2-DP.jpg" , background : "https://i.postimg.cc/4yRH8KFJ/Back-To-The-Future-2-WP.jpg", url: `${STREAM_HOST}/dl/6ae532ef6e979983cdce66d5` },
            { id: "eng_movies_back_to_the_future3", name: "Back to the Future 1990", poster: "https://i.postimg.cc/ZRfSC6Pr/Back-To-The-Future-3-DP.jpg" , background : "https://i.postimg.cc/prM5091V/Back-To-The-Future-3-WP.jpg", url: `${STREAM_HOST}/dl/6ae532f06e979983cdce66d6` },
            { id: "eng_movies_nanny_mcphee", name: "Nanny McPhee 2005", poster: "https://i.postimg.cc/bJYPymnz/Nanny-Mc-Phee-1-DP.webp" , background : "https://i.postimg.cc/wTJ0TLdG/Nanny-Mc-Phee-1-WP.jpg", url: `${STREAM_HOST}/dl/6ae5b40c6e979983cdce6751` },
            { id: "eng_movies_nanny_mcphee", name: "Nanny McPhee Return 2010", poster: "https://i.postimg.cc/V6swfKtJ/Nanny-Mc-Phee-2005-DP.jpg" , background : "https://i.postimg.cc/5NvnNLVM/Nanny-Mcphee-Bigbang-WP.jpg", url: `${STREAM_HOST}/dl/6ae5b41d6e979983cdce6752` },
            { id: "eng_movies_miss_peregrines", name: "Miss Peregrines Home for Peculiar Children", poster: "https://i.postimg.cc/1tRSmvF4/Mis-Peregrines-DP.jpg" , background : "", url: `${STREAM_HOST}/dl/6ae5bc916e979983cdce6753` },
            { id: "eng_movies_peter_pan", name: "Peter Pan 2003", poster: "https://i.postimg.cc/mDZ4Lm9F/Peter-Pan-2003-DP.jpg" , background : "https://i.postimg.cc/Hk5PrYSX/Peter-Pan-WP.jpg", url: `${STREAM_HOST}/dl/6ae5be40b2b3067cc7949e1f` },
            { id: "eng_movies_red_riding_hood", name: "Red Riding Hood 2011", poster: "https://i.postimg.cc/4ymTtnwj/Red-Riding-Hood-2011-DP.jpg" , background : "https://i.postimg.cc/xTrBR0jS/Red-Riding-Hood-2011-WP.jpg", url: `${STREAM_HOST}/dl/6ae5323c6e979983cdce66b9` },
            { id: "eng_movies_13_ghost", name: "13 Ghosts", poster: "https://i.postimg.cc/Kz92Rt7j/13-Ghosts-DP.jpg" , background : "https://i.postimg.cc/4d9B799V/13-Ghosts-WP.jpg", url: `${STREAM_HOST}/dl/6ae533376e979983cdce66e5` },
            { id: "eng_movies_barsisa", name: "Movie Inspired By The Tale Of Barsisa The Monk", poster: "https://i.postimg.cc/KcNPfLLb/Barsisa.webp" , url: `${STREAM_HOST}/dl/6ae4053f6e979983cdce6661` },
            { id: "eng_movies_the_haunting_1963", name: "The Haunting 1963", poster: "https://i.postimg.cc/4yvcqw6K/The-Haunting-1963.jpg", url: `${STREAM_HOST}/dl/6ae27b9d061e57f7e995fdef` },
            { id: "eng_movies_the_haunting_1999", name: "The Haunting 1999", poster: "https://i.postimg.cc/Kj7TwQPj/The-Haunting-1999.jpg", url: `${STREAM_HOST}/dl/6ae27bee061e57f7e995fdf0` },           
            { id: "eng_movies_insidious_2010", name: "Insidious", poster: "https://i.postimg.cc/hPfgSz3F/Insidious-1.jpg", description: "", url: `${STREAM_HOST}/dl/6ade94066e979983cdce630d` },
            { id: "eng_movies_insidious_2_2013", name: "Insidious 2", poster: "https://i.postimg.cc/rFKc80ZB/Insidious-2.jpg", description: "", url: `${STREAM_HOST}/dl/6ade93f76e979983cdce630a` },
            { id: "eng_movies_insidious_chapter_3_2015", name: "Insidious Chapter 3", poster: "https://i.postimg.cc/fTJZwtgs/Insidious-3.jpg", description: "", url: `${STREAM_HOST}/dl/6ade93fd6e979983cdce630b` },
            { id: "eng_movies_insidious_chapter_4_2018", name: "Insidious Chapter 4", poster: "https://i.postimg.cc/X7p3VG1h/Insidious-4.jpg", description: "", url: `${STREAM_HOST}/dl/6ade94026e979983cdce630c` },
            { id: "eng_movies_insidious_the_red_door_2023", name: "Insidious The Red Door", poster: "https://i.postimg.cc/65yw92b1/Insidious-5.png", description: "", url: `${STREAM_HOST}/dl/6ade940a6e979983cdce630e` },
            { id: "eng_movies_insidious_out_of_the_further_2026", name: "Insidious Out Of The Further", poster: "https://i.postimg.cc/YqhkpGDJ/Insidious-6.jpg", description: "", url: `${STREAM_HOST}/dl/6ade940e6e979983cdce630f` },
            { id: "eng_movies_harry_potter_and_the_sorcerers_stone_2001", name: "Harry Potter and the Sorcerers Stone", poster: "https://i.postimg.cc/jdmTCxGd/HP-Sorcerer.jpg", description: "", url: `${STREAM_HOST}/dl/6ade74f16e979983cdce62fd` },
            { id: "eng_movies_harry_potter_and_the_chamber_of_secrets_2002", name: "Harry Potter and the Chamber of Secrets", poster: "https://i.postimg.cc/m2tRbz61/HP-Chamber.jpg", description: "", url: `${STREAM_HOST}/dl/6ade74f16e979983cdce62fa` },
            { id: "eng_movies_harry_potter_and_the_prisoner_of_azkaban_2004", name: "Harry Potter and the Prisoner of Azkaban", poster: "https://i.postimg.cc/wT7H6yby/HP-Prisoner.jpg", description: "", url: `${STREAM_HOST}/dl/6ade74f16e979983cdce62fc` },
            { id: "eng_movies_harry_potter_and_the_goblet_of_fire_2005", name: "Harry Potter and the Goblet of Fire", poster: "https://i.postimg.cc/hPfgSz37/HP-Goblet.jpg", description: "", url: `${STREAM_HOST}/dl/6ade74f16e979983cdce62fb` },
            { id: "eng_movies_harry_potter_and_the_order_of_the_phoenix_2007", name: "Harry Potter and the Order of the Phoenix", poster: "https://i.postimg.cc/zXV5JbPL/HP-pheonix.jpg", description: "", url: `${STREAM_HOST}/dl/6ade74f96e979983cdce62ff` },
            { id: "eng_movies_harry_prince", name: "Harry Potter & The Half Blood Prince", poster: "https://i.postimg.cc/YqZ7jrJ2/HP-prince.jpg", description: "", url: `${STREAM_HOST}/dl/6ade74f16e979983cdce62f8` },
            { id: "eng_movies_harry_hallow1", name: "Harry Potter & The Deathly Hallows Part 1", poster: "https://i.postimg.cc/m2J4hL0g/HP-Haloows-1.webp", description: "", url: `${STREAM_HOST}/dl/6ade74f16e979983cdce62f9` },            
            { id: "eng_movies_harry_potter_and_the_deathly_hallows_part_2_2011", name: "Harry Potter and the Deathly Hallows Part 2 2011", poster: "https://i.postimg.cc/vHcMQgSV/HP-Haloows-2.webp", description: "", url: `${STREAM_HOST}/dl/6ade74f96e979983cdce62fe` },      
            { id: "eng_movies_mufasa_the_lion_king_2024", name: "Mufasa The Lion King", poster: "https://i.postimg.cc/j2NjSDZB/mufasa.jpg", description: "", url: `${STREAM_HOST}/dl/6adea1b56e979983cdce6317` },
            { id: "eng_movies_the_lion_king_2019", name: "The Lion King Live Action", poster: "https://i.postimg.cc/Wzr41d5V/lion-king.webp", description: "", url: `${STREAM_HOST}/dl/6adea1dc6e979983cdce6318` },
            { id: "eng_movies_the_legend_of_tarzan_2016", name: "The Legend of Tarzan", poster: "https://i.postimg.cc/h4CcWbMB/tarzan-2016.jpg", description: "", url: `${STREAM_HOST}/dl/6adea1646e979983cdce6315` },
            { id: "eng_movies_high_school_musical", name: "High School Musical", poster: "https://i.postimg.cc/bw81ZhwD/HSM-1.jpg" , description : "Troy Bolton (kapten pasukan bola keranjang sekolah yang popular) dan Gabriella Montez (seorang gadis baru yang pemalu tetapi sangat cemerlang dalam pelajaran) bertemu tanpa sengaja semasa cuti musim sejuk dan menyanyi karaoke bersama-sama. Walaupun pada mulanya ragu-ragu kerana bimbang dengan tanggapan rakan-rakan sepasukan dan kelab sains mereka, Troy dan Gabriella membuat keputusan untuk mencuba nasib menghadiri uji bakat bagi pementasan muzikal musim sejuk sekolah.", url: `${STREAM_HOST}/dl/6ae48a7f6e979983cdce6663` },
            { id: "eng_movies_high_school_musical_2", name: "High School Musical 2", poster: "https://i.postimg.cc/fTYxWLDx/HSM-2.jpg" , description : "Troy mula hanyut dengan kemewahan, peluang bermain golf bersama lembaga pengarah kolej, dan janji-janji manis tentang masa depannya. Kesibukan baharu Troy menyebabkannya mengabaikan rakan-rakan baiknya dan juga Gabriella. Keadaan menjadi lebih tegang apabila Sharpay memaksa Troy untuk menjadi pasangan duetnya dalam pertandingan bakat tahunan Midsummer Night's Talent Show di kelab tersebut. Sharpay turut mensabotaj Ryan dan ahli Wildcats lain agar mereka tidak dapat bertanding.", url: `${STREAM_HOST}/dl/6ae48a7f6e979983cdce6666` },
            { id: "eng_movies_high_school_musical_3_senior_year", name: "High School Musical 3 Senior Year", poster: "https://i.postimg.cc/W1j0dv1r/HSM-3.jpg" , description : "Troy berjaya mengetuai pasukannya, Wildcats, memenangi kejuaraan bola keranjang terakhir mereka. Selepas perlawanan, mereka mengadakan satu pesta besar-besaran di rumah Troy. Sharpay Evans cuba memonopoli persembahan muzikal tersebut dan mengambil pelajar pertukaran dari England bernama Tiara Gold sebagai pembantunya (walaupun Tiara sebenarnya menyimpan niat mahu mengambil alih tempat Sharpay).", url: `${STREAM_HOST}/dl/6ae48a7f6e979983cdce6664` },
            { id: "eng_movies_camp_rock", name: "Camp Rock", poster: "https://i.postimg.cc/L6jz4X2t/CR1.jpg" , description : "Kerana berasa malu dengan statusnya dan takut dipinggirkan, Mitchie mula hidup dalam identiti rahsia/dua dunia. Di hadapan rakan-rakan kem yang kaya dan popular—terutamanya Tess Tyler (Meaghan Jette Martin), si diva kem yang angkuh — Mitchie berbohong dan mendakwa ibunya ialah seorang presiden rangkaian televisyen terkenal. Dia hanya menjadi diri sendiri apabila bersama Caitlyn Gellar (Alyson Stoner), satu-satunya kawan sejati yang memahami bakatnya.", url: `${STREAM_HOST}/dl/6ae48a7f6e979983cdce6667` },
            { id: "eng_movies_camp_rock_2_the_final_jam", name: "Camp Rock 2 The Final Jam", poster: "https://i.postimg.cc/J4jb7nMZ/CR2.jpg" , description : "Axel menawarkan gaji dua kali ganda kepada para kaunselor dan pengajar Camp Rock untuk berpindah ke kemnya. Strategi ini berjaya, malah bekas bintang Camp Rock, Tess Tyler, turut berpindah ke Camp Star. Kekurangan kakitangan memaksa Brown membuat keputusan untuk menutup Camp Rock. Enggan mengalah, Mitchie mengetuai rakan-rakannya (termasuk Shane, Nate, dan Jason) untuk mengambil alih tugas sebagai kaunselor dan pengajar demi memastikan kem mereka kekal beroperasi.", url: `${STREAM_HOST}/dl/6ae48a7f6e979983cdce6662` },
            { id: "eng_movies_another_cinderella_story", name: "Another Cinderella Story", poster: "https://i.postimg.cc/7YSgP6wC/ACS-SG.jpg" , description : "Kehidupan Mary mula berubah apabila Joey Parker (lakonan Drew Seeley), seorang bintang pop terkenal antarabangsa, memutuskan untuk kembali ke sekolah tinggi tempatan bagi menamatkan tahun akhir persekolahannya sambil mencari inspirasi tarian baru. Joey menganjurkan satu pertandingan tarian dan turut menghadiri majlis tari-menari topeng (Masquerade Ball) di sekolah. Dengan bantuan rakan baiknya, Tami, Mary menghadiri majlis tersebut dengan memakai topeng dan gaun hitam yang menawan. Di sana, Mary dan Joey telah menari bersama secara intim, di mana Joey terpukau dengan bakat tarian hebat gadis misteri itu.", url: `${STREAM_HOST}/dl/6ae48a7f6e979983cdce6665` },
            { id: "eng_movies_john_tucker_must_die", name: "John Tucker Must Die", poster: "https://i.postimg.cc/m27QZDBL/JTMD.webp" , description : "Untuk membalas dendam terhadap sikap talam dua muka John, mereka bergabung tenaga dan melatih seorang pelajar baru yang comel dan pemalu bernama Kate (Brittany Snow). Komplot mereka adalah untuk memenangi hati John melalui Kate, kemudian mematahkan hatinya di khalayak ramai bagi memalukannya. Namun, rancangan mereka mula menjadi rumit apabila perasaannya terhadap John menjadi semakin tidak menentu.", url: `${STREAM_HOST}/dl/6ae48a876e979983cdce6668` },
            { id: "eng_movies_princess_protection_program", name: "Princess Protection Program", poster: "https://i.postimg.cc/2jsQfvRR/PPP.jpg" , description : "Untuk memastikan keselamatan Rosalinda sementara pihak P.P.P. mencari jalan untuk menumbangkan Jeneral Kane secara sah, dia dihantar tinggal bersama Mejar Joe Mason di Louisiana. Rosalinda diberikan identiti baharu sebagai Rosie Gonzalez, sepupu dari luar bandar. Di sinilah dia bertemu dengan Carter Mason, anak perempuan Mejar Joe yang bekerja di kedai umpan ikan dan bersikap agak tomboi serta kurang keyakinan diri.", url: `${STREAM_HOST}/dl/6ae48a876e979983cdce6669` },
            { id: "eng_movies_a_cinderella_story", name: "A Cinderella Story", poster: "https://i.postimg.cc/027p5QPQ/ACS-HD.jpg" , description : "Impian terbesar Sam adalah untuk mengumpul wang dan melanjutkan pelajaran ke Universiti Princeton agar dia dapat melarikan diri daripada keluarga tirinya. Di sebalik kesibukan dan penderitaannya di rumah serta bulian di sekolah, satu-satunya perkara yang memberi ketenangan kepada Sam ialah hubungannya dengan seorang rakan siber misteri yang menggunakan nama samaran. Mereka sering berkongsi mesej dan impian yang sama untuk ke Princeton.", url: `${STREAM_HOST}/dl/6ae48a876e979983cdce666a` },
            { id: "eng_movies_the_prince_and_me", name: "The Prince And Me", poster: "https://i.postimg.cc/hPV94jcS/TPAM1.jpg" , description : "Paige tidak mengetahui bahawa Eddie sebenarnya adalah Putera Edvard, Putera Mahkota dari Denmark. Edvard sengaja datang ke Amerika secara menyamar untuk berseronok dan lari daripada protokol istana. Hubungan mereka mula goyah apabila pihak paparazzi berjaya menghidu keberadaan Putera Edvard dan mendedahkan identiti sebenarnya kepada Paige. Paige berasa terkejut dan kecewa kerana ditipu.", url: `${STREAM_HOST}/dl/6ae48a876e979983cdce666b` },
            { id: "eng_movies_stay_alive_2006", name: "Stay Alive", poster: "https://i.postimg.cc/RVV1q9c0/stay-alive.jpg", description: "", url: `${STREAM_HOST}/dl/6ade9d716e979983cdce6310` },
            { id: "eng_movies_austin_powers_international_man_of_mystery_1997_1", name: "Austin Powers International Man of Mystery 1", poster: "https://i.postimg.cc/QxHsX9nG/Austin-1997.jpg", description: "", url: `${STREAM_HOST}/dl/6adea09d6e979983cdce6311` },
            { id: "eng_movies_austin_powers_international_man_of_mystery_1997_2", name: "Austin Powers International Man of Mystery 2", poster: "https://i.postimg.cc/QxHsX9nG/Austin-1997.jpg", description: "", url: `${STREAM_HOST}/dl/6adea0ee6e979983cdce6313` },
            { id: "eng_movies_austin_powers_in_goldmember_2002", name: "Austin Powers in Goldmember", poster: "https://i.postimg.cc/Dy8F2JYK/AUstin-Power-2002.jpg", description: "", url: `${STREAM_HOST}/dl/6adea0a06e979983cdce6312` },
            { id: "eng_movies_beauty_and_the_beast_2017", name: "Beauty and the Beast", poster: "https://i.postimg.cc/3Jd7K4br/BATB.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cb56e979983cdce62db` },
            { id: "eng_movies_cinderella_2015", name: "Cinderella", poster: "https://i.postimg.cc/02bx8MH9/cinderella.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cba6e979983cdce62dc` },
            { id: "eng_movies_zathura_a_space_adventure_2005", name: "Zathura A Space Adventure", poster: "https://i.postimg.cc/ryhMXCg6/zathura.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cba6e979983cdce62dd` },
            { id: "eng_movies_the_chronicles_of_narnia_2005", name: "The Chronicles of Narnia", poster: "https://i.postimg.cc/yYkBVgpb/Narnia-1.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cec6e979983cdce62e3` },
            { id: "eng_movies_the_chronicles_of_narnia_2_2008", name: "The Chronicles of Narnia 2", poster: "https://i.postimg.cc/1RWshcMS/Narnia-2.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cec6e979983cdce62e0` },
            { id: "eng_movies_the_chronicles_of_narnia_3_2010", name: "The Chronicles of Narnia 3", poster: "https://i.postimg.cc/y6fs4XnC/Narnia-3.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cba6e979983cdce62df` },
            { id: "eng_movies_house_of_wax_2005", name: "House Of Wax", poster: "https://i.postimg.cc/FFPN5gp2/house-of-wax.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cba6e979983cdce62de` },
            { id: "eng_movies_jumanji_1995", name: "Jumanji", poster: "https://i.postimg.cc/HWSdD4zN/Jumanji-1.webp", description: "", url: `${STREAM_HOST}/dl/6ade6cec6e979983cdce62e2` },
            { id: "eng_movies_jumanji_welcome_to_the_jungle_2017", name: "Jumanji Welcome To The Jungle", poster: "https://i.postimg.cc/bY6pcHgM/jumanji-jungle.webp", description: "", url: `${STREAM_HOST}/dl/6ade6cec6e979983cdce62e1` },
            { id: "eng_movies_jumanji_the_next_level_2019", name: "Jumanji The Next Level", poster: "https://i.postimg.cc/sfnsd9m6/jumanji-next-level.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cf26e979983cdce62e4` },
            { id: "eng_movies_final_destination_2000", name: "Final Destination", poster: "https://i.postimg.cc/pV0RbYCD/final-destination1.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cf76e979983cdce62e9` },
            { id: "eng_movies_final_destination_2_2003", name: "Final Destination 2", poster: "https://i.postimg.cc/1RWshcBF/final-destination2.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cf76e979983cdce62e8` },
            { id: "eng_movies_final_destination_3_2006", name: "Final Destination 3", poster: "https://i.postimg.cc/9XxC5tb7/final-destination3.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cf76e979983cdce62e5` },
            { id: "eng_movies_final_destination_5_2011", name: "Final Destination 5", poster: "https://i.postimg.cc/L50pt2h5/final-destination5.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cf76e979983cdce62e7` },
            { id: "eng_movies_final_destination_bloodlines_2025", name: "Final Destination Bloodlines", poster: "https://i.postimg.cc/5ykVBbjb/final-destination6.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cf76e979983cdce62e6` },
            { id: "eng_movies_twilight_2008", name: "Twilight", poster: "https://i.postimg.cc/WzfvGTt2/twilight.jpg", description: "", url: `${STREAM_HOST}/dl/6ade73fc6e979983cdce62f5` },
            { id: "eng_movies_twilight_new_moon_2009", name: "Twilight New Moon", poster: "https://i.postimg.cc/VvH8qm5Q/twilight-NM.jpg", description: "", url: `${STREAM_HOST}/dl/6ade73fc6e979983cdce62f7` },
            { id: "eng_movies_twilight_eclipse_2010", name: "Twilight Eclipse", poster: "https://i.postimg.cc/Bbw0T4tW/twilight-Eclipe.jpg", description: "", url: `${STREAM_HOST}/dl/6ade73fc6e979983cdce62f4` },
            { id: "eng_movies_the_twilight_saga_breaking_dawn_part_1_2011", name: "The Twilight Saga Breaking Dawn Part 1", poster: "https://i.postimg.cc/3NbTXYWQ/twilight-BD-P1.jpg", description: "", url: `${STREAM_HOST}/dl/6ade73fc6e979983cdce62f6` },
            { id: "eng_movies_the_twilight_saga_breaking_dawn_part_2_2012", name: "The Twilight Saga Breaking Dawn Part 2", poster: "https://i.postimg.cc/5ykVBbjJ/twilight-BD-P2.jpg", description: "", url: `${STREAM_HOST}/dl/6ade73fc6e979983cdce62f3` },            
            { id: "eng_movies_wrong_turn_2003", name: "Wrong Turn 1", poster: "https://i.postimg.cc/Y9WYfthM/Wrong-Turn-1.jpg", url: `${STREAM_HOST}/dl/6ae27d00061e57f7e995fdf1` },
            { id: "eng_movies_wrong_turn_2_dead_end_2007", name: "Wrong Turn 2 Dead End", poster: "https://i.postimg.cc/HxyX4TVT/Wrong-Turn-2.jpg", url: `${STREAM_HOST}/dl/6ae27d29061e57f7e995fdf2` },
            { id: "eng_movies_wrong_turn_3_left_for_dead_2009", name: "Wrong Turn 3: Left For Dead", poster: "https://i.postimg.cc/FRL3gh79/Wrong-Turn-3.jpg", url: `${STREAM_HOST}/dl/6ae27d37061e57f7e995fdf3` },
            { id: "eng_movies_wrong_turn_4_2011", name: "Wrong Turn 4", poster: "https://i.postimg.cc/PJnZS08B/Wrong-Turn-4.jpg", url: `${STREAM_HOST}/dl/6ae27d47061e57f7e995fdf4` },
            { id: "eng_movies_wrong_turn_5_bloodlines_2012", name: "Wrong Turn 5: Bloodlines", poster: "https://i.postimg.cc/cCGYFPn0/Wrong-Turn-5.jpg", url: `${STREAM_HOST}/dl/6ae27dd7061e57f7e995fdf6` },
            { id: "eng_movies_wrong_turn_6_last_resort_2014", name: "Wrong Turn 6 Last Resort", poster: "https://i.postimg.cc/90HTLs72/Wrong-Turn-6.jpg", url: `${STREAM_HOST}/dl/6ae27d5f061e57f7e995fdf5` },
            { id: "eng_movies_wrong_turn_7", name: "Wrong Turn 2021", poster: "https://i.postimg.cc/D03sxRX7/Wrong-Turn-7.webp", url: `${STREAM_HOST}/dl/6ae413713561d6bb9a50d862` },
            { id: "eng_movies_the_nun_2018", name: "The Nun", poster: "https://i.postimg.cc/GtnYX6yL/The-Nun.jpg", url: `${STREAM_HOST}/dl/6ae27973061e57f7e995fdea` },
            { id: "eng_movies_the_nun_ii_2023", name: "The Nun II", poster: "https://i.postimg.cc/BbfDmRKZ/The-Nun-II.jpg", url: `${STREAM_HOST}/dl/6ae27979061e57f7e995fdeb` },
            { id: "eng_movies_annabelle_2014", name: "Annabelle", poster: "https://i.postimg.cc/5yWvsDCt/Annabelle.jpg", url: `${STREAM_HOST}/dl/6ae27b28061e57f7e995fdee` },
            { id: "eng_movies_annabelle_creation_2017", name: "Annabelle Creation", poster: "https://i.postimg.cc/FzXcTwLz/Annabelle-Creation.jpg", url: `${STREAM_HOST}/dl/6ae27ae7061e57f7e995fdec` },
            { id: "eng_movies_annabelle_comes_home_2019", name: "Annabelle Comes Home", poster: "https://i.postimg.cc/KjhL0CM8/Annabelle-Comes-Home.jpg", url: `${STREAM_HOST}/dl/6ae27aea061e57f7e995fded` },
            { id: "eng_movies_the_hot_chick_2002", name: "The Hot Chick 2002", poster: "https://i.postimg.cc/zDd8ZS7W/hot-chick.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6d326e979983cdce62f1` },
         ]
    },
    "jap_movies_catalog": {
        id: "jap_movies_catalog",
        isMulti: true,
        items: [
            { id: "jap_movies_once_upon_a_crime", name: "Once Upon a Crime", poster: "https://i.postimg.cc/5NhvyRmH/Once-Upon-A-Crime-DP.jpg" , background : "https://i.postimg.cc/WbBrzH7F/Once-Upon-A-Crime-WP.jpg", url: `${STREAM_HOST}/dl/6ae5323c6e979983cdce66ba` },
            { id: "jap_movies_crow_zero1", name: "Crow Zero 1", poster: "https://i.postimg.cc/CL3D5Q4q/Crows-Zero-DP.jpg" , background : "https://i.postimg.cc/bNDkzh1H/Crows-Zero-WP.jpg", url: `${STREAM_HOST}/dl/6ae645a40e3f92a46057073d` },
            { id: "jap_movies_crow_zero2", name: "Crow Zero 2", poster: "https://i.postimg.cc/yYM9xbT0/Crows-Zero-2-DP.jpg" , background : "https://i.postimg.cc/GhWYt5j4/Crows-Zero-2-WP.webp", url: `${STREAM_HOST}/dl/6ae532bf6e979983cdce66d3` },
            { id: "jap_movies_the_scissors_massacre_2008", name: "The Scissors Massacre", poster: "https://i.postimg.cc/j57PQRLY/The-Scissors-Massacre.webp", background : "https://i.postimg.cc/0yf9J6sN/The-Scissors-Massacre-WP.webp", url: `${STREAM_HOST}/dl/6ae27871061e57f7e995fde9` },
            { id: "jap_movies_paradise_kiss_2011", name: "Paradise Kiss Live Action", poster: "https://i.postimg.cc/K8NmgK2j/Paradise-Kiss-DP.jpg", background : "https://i.postimg.cc/2SwCBqDq/Paradise-Kiss-WP.webp", description: "", url: `${STREAM_HOST}/dl/6adea4ba6e979983cdce6320` },
            { id: "jap_movies_gintama_live_action_movie_2017", name: "Gintama Live action Movie 2017", poster: "https://i.postimg.cc/sDvyVQ0v/Gintama-2017.jpg", background : "https://i.postimg.cc/cLZnS8h8/Gintama-1-WP.jpg", description: "", url: `${STREAM_HOST}/dl/6adea5c86e979983cdce6325` },
            { id: "jap_movies_gintama_live_action_movie_2_2018", name: "Gintama Live action Movie 2 2018", poster: "https://i.postimg.cc/5N61xYky/Gintama-2018.jpg", background : "https://i.postimg.cc/qv03TCwh/Gintama-WP-2.jpg", description: "", url: `${STREAM_HOST}/dl/6adea5cc6e979983cdce6326` },
            { id: "jap_movies_your_lie_in_april_live_action", name: "Your Lie In April Live Action", poster: "https://i.postimg.cc/sDvyVQ02/your-lie-in-april.jpg", background : "https://i.postimg.cc/SxrmzXhx/Your-Lie-In-April-Live-Action-WP.jpg", description: "", url: `${STREAM_HOST}/dl/6adea6026e979983cdce6327` },
            { id: "jap_movies_death_note_2006", name: "Death Note 2006", poster: "https://i.postimg.cc/vHcMQgSQ/DN-1.jpg", background : "https://i.postimg.cc/CxYqgf7q/Death-Note-WP-1.jpg", description: "", url: `${STREAM_HOST}/dl/6ade903e6e979983cdce6307` },
            { id: "jap_movies_death_note_2_the_last_name_2006", name: "Death Note 2 The Last Name (2006)", poster: "https://i.postimg.cc/RVN9M6b9/DN-2.jpg", background : "https://i.postimg.cc/mgwTFcsZ/Death-Note-2-The-Last-Name-(2006)-WP.jpg", description: "", url: `${STREAM_HOST}/dl/6ade911c6e979983cdce6308` },
            { id: "jap_movies_death_note_3_l_change_the_world_2008", name: "Death Note 3 L Change The World (2008)", poster: "https://i.postimg.cc/X7p3VGD4/DN-3.jpg", background : "https://i.postimg.cc/2SwCBqDz/Death-Note-3-L-Change-The-World-WP.jpg", description: "", url: `${STREAM_HOST}/dl/6ade91526e979983cdce6309` },
            { id: "jap_movies_detective_conan_live1", name: "Detective Conan Live Action 1", poster: "https://i.postimg.cc/SNJqy2ts/DC-M1.jpg", description: "", url: `${STREAM_HOST}/dl/6adea52b6e979983cdce6324` }, 
            { id: "jap_movies_detective_conan_live2", name: "Detective Conan Live Action 2", poster: "https://i.postimg.cc/SNJqy2ts/DC-M1.jpg", description: "", url: `${STREAM_HOST}/dl/6adea5286e979983cdce6323` },
            { id: "jap_movies_detective_conan_live3", name: "Detective Conan Live Action 3", poster: "https://i.postimg.cc/SNJqy2ts/DC-M1.jpg", description: "", url: `${STREAM_HOST}/dl/6adea5256e979983cdce6322` },
            { id: "jap_movies_detective_conan_live4", name: "Detective Conan Live Action 4", poster: "https://i.postimg.cc/SNJqy2ts/DC-M1.jpg", description: "", url: `${STREAM_HOST}/dl/6adea5226e979983cdce6321` },
            { id: "jap_movies_and_yet_you_re_so_sweet_2023", name: "And Yet, You're So Sweet", poster: "https://i.postimg.cc/sxDgGpxf/And-Yet-You-re-So-Sweet-2023.jpg", background : "https://i.postimg.cc/pLZPn9HW/And-Yet-You-re-So-Sweet-WP.jpg", url: `${STREAM_HOST}/dl/6ae325d66e979983cdce64d7` },
        
        ]
    },
    "ind_movies_catalog": {
        id: "ind_movies_catalog",
        isMulti: true,
        items: [
            { id: "ind_movies_shaitaan_2024", name: "Shaitaan 2024", poster: "https://i.postimg.cc/PJnZS0wP/Shaitaan.jpg", url: `${STREAM_HOST}/dl/6ae291bfc98f67388767909d` },
            { id: "ind_movies_mohabbatein_2001", name: "Mohabbatein", poster: "https://i.postimg.cc/1X16vbqt/Mohabbatein.jpg", url: `${STREAM_HOST}/dl/6ae291f7c98f67388767909e` },
            { id: "ind_movies_om_shanti_om_2007", name: "Om Shanti Om", poster: "https://i.postimg.cc/gjbRg1Zw/Om-Shanti-Om.jpg", url: `${STREAM_HOST}/dl/6ae29121c98f67388767909c` },
            { id: "ind_movies_dilwale_2015", name: "Dilwale", poster: "https://i.postimg.cc/J0CJpSkX/Dilwale.webp", url: `${STREAM_HOST}/dl/6ae290e5c98f67388767909b` },
            
         ]
    },
    "kor_movies_catalog": {
        id: "kor_movies_catalog",
        isMulti: true,
        items: [
            { id: "kor_movies_the_bad_guys_reign_of_chaos_2019", name: "The Bad Guys Reign of Chaos", poster: "https://i.postimg.cc/x8VH6BzH/The-Bad-Guys-Reign-of-Chaos.jpg", url: `${STREAM_HOST}/dl/6ae28671839475ebd7ee028c` },
            { id: "kor_movies_the_gangster_the_cop_the_devil_2019", name: "The Gangster, the Cop, the Devil", poster: "https://i.postimg.cc/gjyhQ4Vx/The-Gangster-the-Cop-the-Devil.jpg", url: `${STREAM_HOST}/dl/6ae286fd839475ebd7ee028d` },
            { id: "kor_movies_the_neighbors_2012", name: "The Neighbors", poster: "https://i.postimg.cc/2ydWMTQL/The-Neighbors.jpg", url: `${STREAM_HOST}/dl/6ae285286e979983cdce6473` },
            { id: "kor_movies_train_to_busan_2016", name: "Train to Busan", poster: "https://i.postimg.cc/KcshgFB0/TTB.jpg", url: `${STREAM_HOST}/dl/6ae282c9dcedf6ab20755977` },
            { id: "kor_movies_train_to_busan_2_2020", name: "Train to Busan 2", poster: "https://i.postimg.cc/2ydWMTQZ/Train-to-Busan-2.jpg", url: `${STREAM_HOST}/dl/6ae281b5dcedf6ab20755970` },
            { id: "kor_movies_unstoppable_2018", name: "Unstoppable", poster: "https://i.postimg.cc/nrKmgT4T/Unstoppable.jpg", url: `${STREAM_HOST}/dl/6ae28480dcedf6ab20755979` },
            { id: "kor_movies_nameless_gangster_rules_of_the_time_2012", name: "Nameless Gangster: Rules Of The Time", poster: "https://i.postimg.cc/nrKmgT47/Nameless-Gangster.jpg", url: `${STREAM_HOST}/dl/6ae2857d6e979983cdce6474` },
            { id: "kor_movies_champion_2018", name: "Champion", poster: "https://i.postimg.cc/MH0BNt7y/Champion.jpg", url: `${STREAM_HOST}/dl/6ae285b96e979983cdce6475` },
            { id: "kor_movies_holy_night_demon_hunters_2025", name: "Holy Night Demon Hunters", poster: "https://i.postimg.cc/fy7dp5cv/Holy-Night-Demon-Hunters.jpg", url: `${STREAM_HOST}/dl/6ae283ebdcedf6ab20755978` },
            { id: "kor_movies_badland_hunters_2024", name: "Badland Hunters", poster: "https://i.postimg.cc/wM5NZFXV/Badland-Hunters.jpg", url: `${STREAM_HOST}/dl/6ae286196e979983cdce6476` },
        ]
    },
    "indo_movies_catalog": {
        id: "indo_movies_catalog",
        isMulti: true,
        items: [
            { id: "indo_movies_dendam_kelam_malam", name: "Dendam Kelam Malam", poster: "https://i.postimg.cc/htRt8MC9/Dendam-Kelam-Malam-DP.jpg" , background : "https://i.postimg.cc/JzCz3KTJ/Dendam-Malam-Kelam-WP.webp", url: `${STREAM_HOST}/dl/6aee542e6e979983cdce696c` },
            { id: "indo_movies_lembayung_2024", name: "Lembayung", poster: "https://i.postimg.cc/zvtZFhPf/Lembayung-DP.jpg" , background : "https://i.postimg.cc/j2g04fkR/Lembayung-WP.jpg", url: `${STREAM_HOST}/dl/6ae5177cf757df1ab7f0434b` },
            { id: "indo_movies_pengabdi_setan_1982", name: "Pengabdi Setan 1982", poster: "https://i.postimg.cc/CMmg0yMN/Pengabdi-Setan-1982-DP.jpg" , background : "https://i.postimg.cc/tR2jb0Rt/Pengabdi-Setan-1982-WP.jpg", url: `${STREAM_HOST}/dl/6ae959454eb9a983e91c112c` },
            { id: "indo_movies_pengabdi_setan_2017", name: "Pengabdi Setan", poster: "https://i.postimg.cc/j2g04fkW/Pengabdi-Setan-1-DP.jpg" , background : "https://i.postimg.cc/rsnXN4YK/Pengabdi-Setan-2-WP.jpg", url: `${STREAM_HOST}/dl/6ae533006e979983cdce66dc` },
            { id: "indo_movies_pengabdi_setan_2022", name: "Pengabdi Setan 2", poster: "https://i.postimg.cc/Rhs5Ltbq/Pengabdi-Setan-2-DP.jpg" , background : "https://i.postimg.cc/gjSFHhBL/Pengabdi-Setan-1-WP.jpg", url: `${STREAM_HOST}/dl/6ae959424eb9a983e91c112b` },
            { id: "indo_movies_kuyank_2025", name: "Kuyank", poster: "https://i.postimg.cc/QC4GJ7nh/Kuyank-DP.jpg" , background : "https://i.postimg.cc/Zn7txNs1/Kuyank-WP.jpg", url: `${STREAM_HOST}/dl/6ae5339f6e979983cdce66f0` },
            { id: "indo_movies_cerita_lila_2026", name: "Cerita Lila", poster: "https://i.postimg.cc/FzW5VSnz/Cerita-Lila-DP.jpg" , background : "https://i.postimg.cc/mkXfy96P/Cerita-Lila-WP.avif", url: `${STREAM_HOST}/dl/6ae533a36e979983cdce66f1` },
            { id: "indo_movies_norma_antara_mertua_dan_menantu_2025", name: "Norma Antara Mertua dan Menantu", poster: "https://i.postimg.cc/BbY9BFwS/Norma-Antara-Mertua-dan-Menantu-DP.jpg" , background : "https://i.postimg.cc/d3HPjCSv/Norma-Antara-Mertua-dan-Menantu-WP.webp", url: `${STREAM_HOST}/dl/6ae533276e979983cdce66dd` },
            { id: "indo_movies_rumah_teteh_story_of_helena_2025", name: "Rumah Teteh Story of Helena", poster: "https://i.postimg.cc/brCc9nVW/Rumah-Teteh-Story-of-Helena-DP.jpg" , background : "https://i.postimg.cc/s2wcXJBQ/Rumah-Teteh-WP.jpg", url: `${STREAM_HOST}/dl/6ae533316e979983cdce66e1` },
            { id: "indo_movies_ain_2026", name: "Ain", poster: "https://i.postimg.cc/FzW5VSCn/Ain-DP.jpg" , background : "https://i.postimg.cc/zvtZFh24/Ain-WP.jpg", url: `${STREAM_HOST}/dl/6ae5336d6e979983cdce66ec` },
            { id: "indo_movies_tenggelamnya_kapal_van_der_wijck", name: "Tenggelamnya Kapal Van der Wijck", poster: "https://i.postimg.cc/ncGVrHbX/Tenggelamnya-Kapal-Van-der-Wijck-DP.jpg" , background: "https://i.postimg.cc/7YkYq5c0/Tenggelamnya-Kapal-Van-der-Wijck-WP.jpg", url: `${STREAM_HOST}/dl/6ae73aee6e979983cdce67fe` },
            { id: "indo_movies_ayat_ayat_cinta", name: "Ayat-Ayat Cinta", poster: "https://i.postimg.cc/L6p6mJ7P/Ayat-Ayat-Cinta-DP.jpg" , background: "https://i.postimg.cc/YqHqtvVN/Ayat-Ayat-Cinta-WP.webp", url: `${STREAM_HOST}/dl/6ae73b366e979983cdce67ff` },
            { id: "indo_movies_ayat_ayat_cinta_2", name: "Ayat-Ayat Cinta 2", poster: "https://i.postimg.cc/hG2r72LL/Ayat-ayat-cinta-2.jpg" , background: "https://i.postimg.cc/3wtBDtXG/Ayat-Ayat-cinta-2-WP.webp", url: `${STREAM_HOST}/dl/6ae73b4e6e979983cdce6800` },
            { id: "indo_movies_buya_hamka_vol_1", name: "Buya Hamka Vol. 1 (2023)", poster: "https://i.postimg.cc/Qx3xjFP9/Buya-Hamka-Vol-1-DP.jpg" , background: "https://i.postimg.cc/15Q5y8Tq/Buya-Hamka-Vol-1-WP.webp", url: `${STREAM_HOST}/dl/6ae73bbd6e979983cdce6801` },
            { id: "indo_movies_pewaris_susuk", name: "Pewaris Susuk", poster: "https://i.postimg.cc/bNH9Wmw4/Pewaris-Susuk.jpg" , url: `${STREAM_HOST}/dl/6ae533376e979983cdce66e4` },
            { id: "indo_movies_kisah_tanah_jawa_pocong_gundul_2023", name: "Kisah Tanah Jawa Pocong Gundul", poster: "https://i.postimg.cc/d1T1gHvw/Kisah-Tanah-Jawa-Pocong-Gundul-DP.jpg", background: "https://i.postimg.cc/G2s267rm/Kisah-Tanah-Jawa-Pocong-Gundul-WP.jpg", url: `${STREAM_HOST}/dl/6ae90d386e979983cdce68a3` },
            { id: "indo_movies_sakaratul_maut_2024", name: "Sakaratul Maut", poster: "https://i.postimg.cc/63G3Fjw9/Sakaratul-Maut-DP.jpg", background: "https://i.postimg.cc/NMrMZJYF/Sakaratul-Maut-WP.jpg", url: `${STREAM_HOST}/dl/6ae90d6d6e979983cdce68a4` },
            { id: "indo_movies_tumbal_kanjeng_iblis_2022", name: "Tumbal Kanjeng Iblis", poster: "https://i.postimg.cc/wvsvnfHv/Tumbal-Kanjeng-Iblis-DP.jpg", background: "https://i.postimg.cc/W3J3xWjt/Tumbal-Kanjeng-Iblis-WP.jpg", url: `${STREAM_HOST}/dl/6ae90d986e979983cdce68a5` },
            { id: "indo_movies_kkn_di_desa_penari_2022", name: "KKN Di Desa Penari", poster: "https://i.postimg.cc/RFnF2s9W/KKN-Di-Desa-Penari-DP.jpg", background: "https://i.postimg.cc/hj7jNygf/KKN-Di-Desa-Penari-WP.jpg", url: `${STREAM_HOST}/dl/6ae90e2b6e979983cdce68a6` },
            { id: "indo_movies_sewu_dino_2023", name: "Sewu Dino", poster: "https://i.postimg.cc/fL0L12Zm/Sewu-Dino-DP.jpg", background: "https://i.postimg.cc/sXZXb6yW/Sewu-Dino-WP.jpg", url: `${STREAM_HOST}/dl/6ae90e516e979983cdce68a7` },
            { id: "indo_movies_kuntilanak_3_2022", name: "Kuntilanak 3", poster: "https://i.postimg.cc/W3J3xWjk/Kuntilanak-3-DP.jpg", background: "https://i.postimg.cc/vB6BCqM6/Kuntilanak-3-WP.jpg", url: `${STREAM_HOST}/dl/6ae90ef66e979983cdce68a8` },
            { id: "indo_movies_sijjin_2023", name: "Sijjin", poster: "https://i.postimg.cc/rmtm7nc5/Sijjin-DP.jpg", background: "https://i.postimg.cc/9MqMs8VG/Sijjin-WP.jpg", url: `${STREAM_HOST}/dl/6ae90f266e979983cdce68a9` },
            { id: "indo_movies_kajiman_2023", name: "Kajiman", poster: "https://i.postimg.cc/qRCRWb0c/Kajiman-DP.jpg", background: "https://i.postimg.cc/8cQ5GRPr/Kajiman-WP.jpg", url: `${STREAM_HOST}/dl/6ae90fa66e979983cdce68aa` },
            { id: "indo_movies_spirit_doll_2023", name: "Spirit Doll", poster: "https://i.postimg.cc/sxdXzYDG/Spirit-Doll-DP.jpg", background: "https://i.postimg.cc/hvWjnLPd/Spirit-Doll-WP.jpg", url: `${STREAM_HOST}/dl/6ae90fde6e979983cdce68ab` },
            { id: "indo_movies_khanzab_2023", name: "Khanzab", poster: "https://i.postimg.cc/0jRQvY2S/Khanzab-DP.jpg", background: "https://i.postimg.cc/PJsxHWr6/Khanzab-WP.jpg", url: `${STREAM_HOST}/dl/6ae910ba6e979983cdce68ac` },
            { id: "indo_movies_qodrat_2022", name: "Qodrat", poster: "https://i.postimg.cc/gjFJpVkD/Qodrat-DP.jpg", background: "https://i.postimg.cc/5yd0JBNs/Qodrat-WP.jpg", url: `${STREAM_HOST}/dl/6ae910c26e979983cdce68ae` },
            { id: "indo_movies_qodrat_2_2025", name: "Qodrat 2", poster: "https://i.postimg.cc/gjFJpVk4/Qodrat-2-DP.jpg", background: "https://i.postimg.cc/5yd0JBNs/Qodrat-WP.jpg", url: `${STREAM_HOST}/dl/6ae910be6e979983cdce68ad` },
            { id: "indo_movies_wayang_puaka_2023", name: "Wayang Puaka", poster: "https://i.postimg.cc/WzL3VGbx/Wayang-Puaka-DP.jpg", background: "https://i.postimg.cc/6qJ3Kr5S/Wayang-Puaka-WP.jpg", url: `${STREAM_HOST}/dl/6ae911076e979983cdce68af` },
            { id: "indo_movies_ronggeng_kematian_2024", name: "Ronggeng Kematian", poster: "https://i.postimg.cc/yx4dKm8z/Ronggeng-Kematian-DP.jpg", background: "https://i.postimg.cc/1XGz38fL/Ronggeng-Kematian-WP.jpg", url: `${STREAM_HOST}/dl/6ae911256e979983cdce68b0` },
            { id: "indo_movies_waktu_maghrib_2023", name: "Waktu Maghrib", poster: "https://i.postimg.cc/j2HjSDDV/Waktu-Maghrib-DP.jpg", background: "https://i.postimg.cc/FzyKHYYX/Waktu-Maghrib-WP.jpg", url: `${STREAM_HOST}/dl/6ae9115c6e979983cdce68b1` },
            { id: "indo_movies_mangkujiwo_2020", name: "Mangkujiwo", poster: "https://i.postimg.cc/QCQMdFFF/Mangkujiwo-1-DP.jpg", background: "https://i.postimg.cc/PJWq5CCP/Mangkujiwo-1-WP.jpg", url: `${STREAM_HOST}/dl/6ae9117d6e979983cdce68b2` },
            { id: "indo_movies_mangkujiwo_2_2023", name: "Mangkujiwo 2", poster: "https://i.postimg.cc/BbTvnjjS/Mangkujiwo-2-DP.jpg", background: "https://i.postimg.cc/wMXBj113/Mangkujiwo-2-WP.jpg", url: `${STREAM_HOST}/dl/6ae911826e979983cdce68b3` },
            { id: "indo_movies_the_djinns_curse_1", name: "The Djinns Curse 1", poster: "https://i.postimg.cc/qRBrJ1KM/The-Djinn-Curse-2023-DP.jpg", url: `${STREAM_HOST}/dl/6ae53cd56e979983cdce6750` },
            { id: "indo_movies_the_djinns_curse_2", name: "The Djinns Curse 2", poster: "https://i.postimg.cc/bJYPymnY/The-Djinn-Curse-2-2026-DP.jpg", url: `${STREAM_HOST}/dl/6ae67f47539e65364d8d4228` },
        ]
    },
    "malaysian_movies_catalog": {
        id: "malaysian_movies_catalog",
        isMulti: true,
        items: [
            
            { id: "malaysian_movies_lady_boss", name: "Lady Boss", poster: "https://i.postimg.cc/jd4q2s07/Lady-Boss-DP.jpg" , background: "https://i.postimg.cc/4NQ4yJk7/Lady-Boss-WP.webp", url: `${STREAM_HOST}/dl/6ae73dac6e979983cdce6806` },
            { id: "malaysian_movies_puasa", name: "16 Puasa", poster: "https://i.postimg.cc/CKtGktc1/16-Puasa-DP.jpg" , url: `${STREAM_HOST}/dl/6ae5162bf757df1ab7f04347` },
            { id: "malaysian_movies_puasa", name: "17 Puasa", poster: "https://i.postimg.cc/0NrG6xdf/17-puasa-DP.jpg" , url: `${STREAM_HOST}/dl/6ae6c9ac6e979983cdce67e7` },
            { id: "malaysian_movies_puasa", name: "19 Puasa", poster: "https://i.postimg.cc/TPhjyGqt/19-puasa-DP.jpg" , url: `${STREAM_HOST}/dl/6ae6c9c66e979983cdce67e8` },
            { id: "malaysian_movies_kl_menjerit", name: "KL Menjerit 1", poster: "https://i.postimg.cc/fbk73Zjv/kl-menjerit-2002.jpg" , url: `${STREAM_HOST}/dl/6ae51665f757df1ab7f04348` },
            { id: "malaysian_movies_kl_menjerit", name: "KL Menjerit 1", poster: "https://i.postimg.cc/7Lb1CDM1/kl-menjerit-2005.jpg" , url: `${STREAM_HOST}/dl/6ae6c8476e979983cdce67e6` },
            { id: "malaysian_movies_jangan_pandang_belakang", name: "Jangan Pandang Belakang 2", poster: "https://i.postimg.cc/bwmHNdbm/Jangan-Pandang-Belakang-2.jpg" , url: `${STREAM_HOST}/dl/6ae517b0f757df1ab7f0434c` },
            { id: "bomoh", name: "5 Bomoh", poster: "https://i.postimg.cc/CxcHLdDk/5-bomoh.jpg" , url: `${STREAM_HOST}/dl/6ae532f56e979983cdce66da` },
            { id: "malaysian_movies_gitu_gitu_apek_return", name: "Gitu Gitu Apek Return", poster: "https://i.postimg.cc/0yVd2rmM/Gitu-Gitu-Apek-Return.jpg" , url: `${STREAM_HOST}/dl/6ae5332c6e979983cdce66e0` },
            { id: "malaysian_movies_tarung_unforgiven", name: "Tarung Unforgiven", poster: "https://i.postimg.cc/NjskcRys/Tarung-Unforgiven.jpg" , url: `${STREAM_HOST}/dl/6ae533326e979983cdce66e2` },
            { id: "malaysian_movies_libang_libu", name: "Libang Libu", poster: "https://i.postimg.cc/t4qNjFsK/bang-Libu.jpg" , url: `${STREAM_HOST}/dl/6ae533326e979983cdce66e3` },            
            { id: "malaysian_movies_lagenda_budak_setan", name: "Lagenda Budak Setan 1", poster: "https://i.postimg.cc/kXFvzTgY/Lagenda-Budak-Setan-(2010).jpg" , url: `${STREAM_HOST}/dl/6ae533676e979983cdce66e9` },
            { id: "malaysian_movies_lagenda_budak_setan", name: "Lagenda Budak Setan : Katerina", poster: "https://i.postimg.cc/jqfXQx0x/Lagenda-Budak-Setan-2012.png" , url: `${STREAM_HOST}/dl/6ae533676e979983cdce66ea` },
            { id: "malaysian_movies_lagenda_budak_setan", name: "Lagenda Budak Setan : Kasyah", poster: "https://i.postimg.cc/2jWwFkRD/Lagenda-Budak-Setan-2014.jpg" , url: `${STREAM_HOST}/dl/6ae5336d6e979983cdce66eb` },
            { id: "malaysian_movies_khadam", name: "Khadam", poster: "https://i.postimg.cc/7PzVMH88/Khadam-(2026).jpg" , url: `${STREAM_HOST}/dl/6ae533726e979983cdce66ed` },            
            { id: "malaysian_movies_suamiku_lukaku", name: "Suamiku Lukaku", poster: "https://i.postimg.cc/y6RPX1qG/Suamiku-Lukaku.jpg" , url: `${STREAM_HOST}/dl/6ae533736e979983cdce66ef` },
            { id: "malaysian_movies_gerak_khas_the_movie", name: "Gerak Khas The Movie", poster: "https://i.postimg.cc/KcTNrGXH/Gerak-Khas-The-Movie-(2001).jpg" , url: `${STREAM_HOST}/dl/6ae539146e979983cdce6747` },
            { id: "malaysian_movies_gerak_khas_the_movie2", name: "Gerak Khas The Movie 2", poster: "https://i.postimg.cc/P5zh4DWq/Gerak-Khas-2-DP.jpg" , background: "https://i.postimg.cc/VkcmngCb/Gerak-Khas-2-WP.jpg", url: `${STREAM_HOST}/dl/6ae8a4966e979983cdce689e` },
            { id: "malaysian_movies_gerak_khas_the_movie3", name: "Gerak Khas The Movie 3", poster: "https://i.postimg.cc/T3Xfg0Dh/Gerak-Khas-3-DP.jpg" , background: "https://i.postimg.cc/W16jnZG3/Gerak-Khas-3-WP.webp", url: `${STREAM_HOST}/dl/6ae8a44d6e979983cdce689d` },           
            { id: "malaysian_movies_mr_cinderella", name: "Mr. Cinderella", poster: "https://i.postimg.cc/T3qG9bVy/Mr-Cinderella-DP.jpg" , background: "https://i.postimg.cc/K8rFNTPM/mr-cinderella-WP.jpg", url: `${STREAM_HOST}/dl/6ae885386e979983cdce6894` },
            { id: "malaysian_movies_mr_cinderella", name: "Mr. Cinderella 2", poster: "https://i.postimg.cc/zGS5jhC3/Mr-Cinderella-2-DP.jpg" , background: "https://i.postimg.cc/DwdFgGrs/mr-cinderella-2-WP.webp", url: `${STREAM_HOST}/dl/6ae8a4a76e979983cdce689f` },           
            { id: "malaysian_movies_maria_mariana", name: "Maria Mariana", poster: "https://i.postimg.cc/qMxBqkVw/Maria-Mariana-DP.jpg" , background: "https://i.postimg.cc/tCNRJXQz/Maria-Mariana-WP.jpg", url: `${STREAM_HOST}/dl/6ae73ce16e979983cdce6803` },
            { id: "malaysian_movies_maria_mariana_ii", name: "Maria Mariana II", poster: "https://i.postimg.cc/ZKxYnTtw/Maria-Mariana-2-DP.jpg" , background: "https://i.postimg.cc/NfkGFgq8/Maria-Mariana-2-WP.jpg", url: `${STREAM_HOST}/dl/6ae73cd26e979983cdce6802` },
            { id: "malaysian_movies_pasrah", name: "Pasrah", poster: "https://i.postimg.cc/3JFrNK52/Pasrah-DP.jpg" , background: "https://i.postimg.cc/TYJ21RMb/Pasrah-WP.jpg", url: `${STREAM_HOST}/dl/6ae73cf26e979983cdce6804` },
            { id: "malaysian_movies_hingga_hujung_nyawa", name: "Hingga Hujung Nyawa", poster: "https://i.postimg.cc/FsVFz95g/Hingga-Hujung-Nyawa-DP.jpg" , background: "https://i.postimg.cc/Hs9WnpDQ/Hingga-Hujung-Nyawa-WP.jpg", url: `${STREAM_HOST}/dl/6ae73d636e979983cdce6805` },
            { id: "malaysian_movies_janji_diana", name: "Janji Diana", poster: "https://i.postimg.cc/br19zTH2/Janji-Diana.jpg" , url: `${STREAM_HOST}/dl/6ae539f46e979983cdce674a` },
            { id: "malaysian_movies_tragedi_oktober", name: "Tragedi Oktober", poster: "https://i.postimg.cc/x8L30Ryj/Tragedi-Oktober.jpg" , url: `${STREAM_HOST}/dl/6ae53a406e979983cdce674b` },
            { id: "malaysian_movies_blok_404", name: "Blok 404", poster: "https://i.postimg.cc/y8LXYW9r/Blok-404-2001.jpg", url: `${STREAM_HOST}/dl/6ae51745f757df1ab7f0434a` },
            { id: "malaysian_movies_blok_404", name: "Blok 404 (2018)", poster: "https://i.postimg.cc/kgTFXD8Y/blok-404-2018.jpg" , url: `${STREAM_HOST}/dl/6ae51740f757df1ab7f04349` },                        
            { id: "malaysian_movies_kem_505", name: "Kem 505", poster: "https://i.postimg.cc/8cLm1HBP/Kem-505-(2002).jpg" , url: `${STREAM_HOST}/dl/6ae53ac06e979983cdce674c` },
            { id: "malaysian_movies_bangunan", name: "Bangunan", poster: "https://i.postimg.cc/wvCk8PJq/Bangunan-(2015).jpg" , url: `${STREAM_HOST}/dl/6ae53b2f6e979983cdce674d` },
            { id: "malaysian_movies_2_alam", name: "2 Alam", poster: "https://i.postimg.cc/C5bsFNHS/2-Alam-(2010).jpg" , url: `${STREAM_HOST}/dl/6ae53b756e979983cdce674e` },
            { id: "malaysian_movies_xx_ray", name: "XX Ray", poster: "https://i.postimg.cc/nr6TyDHW/xxray-1.jpg" , description : "Amir (lakonan Faizal Hussein), seorang mahasiswa universiti yang sangat taasub dengan dunia angkasa lepas dan astronomi. Cerita bermula apabila sebuah meteorit (tahi bintang) jatuh berhampiran sebuah perkampungan Iban di Sarawak. Amir kemudiannya berjaya menghasilkan sebuah alat khas berbentuk topi keledar canggih yang dikuasakan oleh tenaga tahi bintang tersebut. Alat yang dinamakan XX Ray ini membolehkan pemakainya melihat menembusi apa sahaja objek (penglihatan X-ray).", url: `${STREAM_HOST}/dl/6ae48a936e979983cdce666e` },
            { id: "malaysian_movies_xxray_2", name: "XX RAY 2", poster: "https://i.postimg.cc/6qDzkv9g/xxray-2.jpg" , description : "Enggan ciptaannya disalahgunakan, Tina meminta bantuan daripada Amir, seorang ahli astronomi muda, untuk menghalang Johan. Tina dan Amir kemudiannya menyelinap masuk ke dalam makmal pusat sains tersebut dengan niat untuk memusnahkan mesin berkenaan. Mereka terdampar di era kegemilangan Kesultanan Melayu Melaka di bawah pemerintahan Sultan Mansur Shah. Di sana, mereka bukan sahaja terpaksa menyesuaikan diri dengan kehidupan zaman purba, malah turut menjadi saksi kepada konflik legenda paling tragis dalam sejarah Melayu—iaitu pertumpahan darah antara Hang Tuah dan Hang Jebat.", url: `${STREAM_HOST}/dl/6ae48a8d6e979983cdce666c` },
            { id: "malaysian_movies_xx_ray_3", name: "XX RAY 3", poster: "https://i.postimg.cc/gjf4CZY5/xxray-3.jpg" , description : "Rosman mengancam mengulangi insiden blackout negara Ogos 1996 yang dikesan berpunca daripada wormhole akibat penderia angkasa lepas. Penderia itu disembunyikan oleh bapa Rosman dan sebenarnya sebahagian daripada rancangan membuka stargate untuk menyerap tenaga matahari. Ketiga-tiga remaja ini berusaha menghalang rancangan berbahaya Rosman yang berisiko memusnahkan sistem suria. (Anda boleh mendapatkan teks sinopsis lengkap dalam rujukan yang disediakan).", url: `${STREAM_HOST}/dl/6ae48a8d6e979983cdce666d` },
            { id: "malaysian_movies_lemang_aidilfitri_si_bujang_sepah", name: "Lemang Aidilfitri si Bujang Sepah", poster: "https://i.postimg.cc/br0nWLxC/Lemang-Sepah.jpg", url: `${STREAM_HOST}/dl/6ae271d9b10586fd45532283` },
            { id: "malaysian_movies_dodol_si_bujang_sepah_2010", name: "Dodol Si Bujang Sepah (2010)", poster: "https://i.postimg.cc/MH0BNt7s/Dodol-Sepah.jpg", url: `${STREAM_HOST}/dl/6ae271e3b10586fd45532284` },
            { id: "malaysian_movies_pisau_cukur_2009", name: "Pisau Cukur (2009)", poster: "https://i.postimg.cc/WzmZCSG8/Pisau-Cukur.jpg", url: `${STREAM_HOST}/dl/6ae277f8061e57f7e995fde7` },
            { id: "malaysian_movies_sepah_the_movie_2012", name: "Sepah The Movie (2012)", poster: "https://i.postimg.cc/0jGSFZYX/sepah-2012.jpg", url: `${STREAM_HOST}/dl/6ae271d5b10586fd45532282` },
            { id: "malaysian_movies_semerah_cinta_stiletto", name: "Semerah Cinta Stiletto", poster: "https://i.postimg.cc/x1djyR6K/Stiletto-DP.jpg", url: `${STREAM_HOST}/dl/6ae211d06e979983cdce644b` },
            { id: "malaysian_movies_jangan_pandang_belakang_boleh", name: "Jangan Pandang Belakang Boleh", poster: "https://i.postimg.cc/vZm8Lz09/Jangan-Pandang-Belakang-Boleh-DP.jpg", url: `${STREAM_HOST}/dl/6ae212a66e979983cdce6454` },
            { id: "malaysian_movies_dendam_hantu_viral", name: "Dendam Hantu Viral", poster: "https://i.postimg.cc/L8s4BTx1/Dendam-Hantu-Viral-DP.jpg", url: `${STREAM_HOST}/dl/6ae212af6e979983cdce6458` },
            { id: "malaysian_movies_bujang_sepah_silalalitamplom", name: "Bujang Sepah Silalalitamplom 2009", poster: "https://i.postimg.cc/2S5jFw0L/sepah-lalalitamplom.jpg", url: `${STREAM_HOST}/dl/6ae3eeb86e979983cdce649` },
            { id: "malaysian_movies_kahar_kapla_high_council_2024", name: "Kahar Kapla High Council", poster: "https://i.postimg.cc/7YLMsDtn/PHC.jpg", description: "", url: `${STREAM_HOST}/dl/6ade6cb56e979983cdce62da` },
            { id: "malaysian_movies_kudrat_1968_high_council_2026_ep2", name: "Kudrat 1968 High Council EP2", poster: "https://i.postimg.cc/ZnDS840S/Kudrat-1.png", description: "", url: `${STREAM_HOST}/dl/6adea44b6e979983cdce631c` },
            { id: "malaysian_movies_kudrat_1968_high_council_2026_ep01", name: "Kudrat 1968 High Council EP01", poster: "https://i.postimg.cc/ZnDS840S/Kudrat-1.png", description: "", url: `${STREAM_HOST}/dl/6adea44e6e979983cdce631d` },
            { id: "malaysian_movies_kudrat_1968_high_council_2026_ep3", name: "Kudrat 1968 High Council EP3", poster: "https://i.postimg.cc/ZnDS840S/Kudrat-1.png", description: "", url: `${STREAM_HOST}/dl/6adea4516e979983cdce631e` },
            { id: "malaysian_movies_kudrat_1968_high_council_2026_ep04", name: "Kudrat 1968 High Council EP04", poster: "https://i.postimg.cc/ZnDS840S/Kudrat-1.png", description: "", url: `${STREAM_HOST}/dl/6adea4546e979983cdce631f` },
            { id: "malaysian_movies_duyung_legenda_aurora", name: "Duyung Legenda Aurora", poster: "https://i.postimg.cc/BvQKzcJT/Duyung-2-DP.jpg", description: "Puteri Duyung (Maya Karin) kembali ke daratan dan meminta pertolongan daripada Jimmy (Saiful Apek) selepas anaknya, Aurora (Anna Jobling), diculik oleh sindiket pukat tunda haram lalu dilelong kepada seorang saintis bernama Dr. Evo (Yusry Abdul Halim). Jimmy yang kini memiliki sebuah hotel bersama isterinya Aspalela (Yasmin Hani) dan anak mereka Dashmond (Ayie Elham) turut dibantu oleh Hamlau (abang Aurora yang juga pahlawan duyung) serta Ajaq (Aniq Aqil). Cabaran utama mereka adalah golongan duyung hanya mampu berada di darat selama tidak melebihi enam jam.", url: `${STREAM_HOST}/dl/6addf2d26e979983cdce61cc` },
            { id: "malaysian_movies_duyung", name: "Duyung", poster: "https://i.postimg.cc/fbT9PjMv/Duyung-DP.jpg", description: "Jimmy menaruh hati kepada kekasih masa kecilnya, Aspalela (Yasmin Hani). Namun, bapa Aspalela iaitu Wan Pagek, meletakkan syarat yang mustahil, Jimmy mesti mempunyai sebidang tanah sendiri jika mahu mengahwini anaknya. Memandangkan mereka hidup di atas air, Jimmy mendapat idea kreatif dengan membina sebuah pulau terapung daripada timbunan barang terbuang dan sisa sampah. Tindakan ini menyakitkan hati Kordi (Awie), seorang lelaki kaya yang juga bersaing untuk memikat Aspalela.", url: `${STREAM_HOST}/dl/6addf33e6e979983cdce61cd` },
            { id: "malaysian_movies_adnan_sempit_1", name: "Adnan Sempit 1", poster: "https://i.postimg.cc/258ZtFCn/AS1.jpg", description: "Konflik bermula apabila rakan-rakan kolej Nadia menganjurkan majlis pertemuan semula (reunion party). Akibat disindir dan dicabar kerana tidak mempunyai teman lelaki, Nadia secara spontan menarik Adnan yang kebetulan lalu di hadapannya dan memperkenalkan Adnan sebagai kekasihnya. Menyedari status mereka yang jauh berbeza, Nadia meminta Adnan menyamar sebagai teman lelakinya untuk majlis tersebut.", url: `${STREAM_HOST}/dl/6addf81d6e979983cdce61ce` },
            { id: "malaysian_movies_adnan_sempit_3", name: "Adnan Sempit 3", poster: "https://i.postimg.cc/SKNMP7mY/AS3.jpg", description: "meneruskan kesinambungan kisah kehidupan dua pasangan sahabat iaitu Adnan & Nadia serta Bobby & Wawa yang akhirnya selamat melangsungkan perkahwinan. Fasa awal perkahwinan mereka dipenuhi dengan pelbagai gelagat lucu, terutamanya persediaan dan petua malam pertama yang memusingkan kepala. onflik sebenar bermula apabila Nadia dan Wawa disahkan mengandung secara serentak. Berikutan kehamilan tersebut, Adnan mula mengalami alahan yang teruk.", url: `${STREAM_HOST}/dl/6addf81e6e979983cdce61cf` },
            { id: "malaysian_movies_adnan_sempit_sawadikap", name: "Adnan Sempit Sawadikap", poster: "https://i.postimg.cc/Qdq7SnZ5/AS-sawadee.jpg", description: "Ketika melakukan pencarian di sekitar kota Bangkok, mereka terserempak dengan Nok, seorang wanita warga Thailand yang membawa bayi dalam keadaan mencurigakan. Adnan yang yakin bahawa bayi itu adalah anaknya terus mengejar Nok. Bermulalah pengembaraan penuh komedi dan aksi apabila Adnan dan Bobby terpaksa berhadapan dengan kumpulan gangster tempatan, tanpa menyedari bahawa bayi yang dibawa oleh Nok itu sebenarnya menjadi buruan penjenayah atas sebab yang lain.", url: `${STREAM_HOST}/dl/6addf81e6e979983cdce61d0` },
            { id: "malaysian_movies_im_not_single", name: "I'm Not Single", poster: "https://i.postimg.cc/K85TQshY/IMS.jpg", description: "Situasi menjadi rumit kerana Maya sebenarnya sudah mempunyai teman lelaki bernama Dani. Hubungan Maya dan Dani sangat intim sehinggakan mereka sudah merancang untuk berkahwin. Dani yang sukar menerima kenyataan bahawa kekasihnya kini menjadi milik orang lain, mula mencari jalan untuk mendapatkan semula hati Maya.", url: `${STREAM_HOST}/dl/6addf8226e979983cdce61d5` },
            { id: "malaysian_movies_adnan_sempit_generasi_gig", name: "Adnan Sempit Generasi Gig", poster: "https://i.postimg.cc/6phZz1xZ/AS-gig.jpg", description: "Mengisahkan tentang kehidupan Adnan, seorang penghantar barang ('delivery rider') dalam era ekonomi gig yang gigih melakukan pelbagai kerja sampingan demi minat mendalamnya terhadap bidang permotoran. Kisah bermula apabila Adnan berjaya menyelamatkan Nadia, seorang wanita bandar yang sofistikated dan bekerjaya mewah yang sekian lama diminatinya secara diam-diam.", url: `${STREAM_HOST}/dl/6addf81f6e979983cdce61d2` },
            { id: "malaysian_movies_cinta_kolestrol", name: "Cinta Kolestrol", poster: "https://i.postimg.cc/s2DhL93w/Cinta-Kolestrol-DP.jpg", description: "Dua puluh tahun berlalu, Ahmad Yusry pulang dari luar negara sebagai seorang jejaka yang tampan, berpendidikan tinggi, dan mementingkan penampilan. Sebaliknya, Fazira pula membesar sebagai seorang gadis yang sangat gemuk, naif, tidak pandai bergaya, dan mempunyai personaliti yang kurang menarik di mata Yusry.", url: `${STREAM_HOST}/dl/6addf8206e979983cdce61d4` },
            { id: "malaysian_movies_kayangan", name: "Kayangan", poster: "https://i.postimg.cc/258ZtFC9/Kayangan-DP.jpg", description: "Melalui satu kejadian memalukan yang tidak disangka-sangka, Maseira akhirnya terdedah kepada dunia metropolitan apabila dia menerima tawaran untuk bekerja di syarikat keluarga Tengku Amir. Perubahan persekitaran yang begitu mendadak memaksa Maseira untuk menyesuaikan diri dengan kehidupan korporat yang serba mencabar di Kuala Lumpur tanpa mengorbankan jati diri dan pendirian asalnya.", url: `${STREAM_HOST}/dl/6addf8206e979983cdce61d3` },
            { id: "malaysian_movies_adnan_sempit_2", name: "Adnan Sempit 2", poster: "https://i.postimg.cc/zfXgQSqh/AS2.jpg", description: "Adnan yang buntu untuk mengubah imejnya telah meminta bantuan rakan baiknya, Bobby, untuk bertindak sebagai perunding imej dan guru Bahasa Inggeris. Keadaan menjadi huru-hara dan lucu apabila Bobby sendiri sebenarnya tidak pandai berbahasa Inggeris, menyebabkan Adnan terpaksa belajar menggunakan buku tadika serta menggunakan kayu hoki untuk berlatih bermain golf.", url: `${STREAM_HOST}/dl/6addf81f6e979983cdce61d1` },
            { id: "malaysian_movies_girlfriend_aku_dari_neraka", name: "Girlfriend Aku Dari Neraka", poster: "https://i.postimg.cc/7h0LQbcW/GDN-DP.jpg", description: "Rudi ialah seorang lelaki yang gemar bertukar-tukar teman wanita. Dia kemudian bercinta dengan Tasha, seorang gadis yang mempunyai sikap keterlaluan, diva, dan terlalu mengongkong sehingga membuatkan hidup Rudi huru-hara.", url: `${STREAM_HOST}/dl/6addfba26e979983cdce61d6` },
            { id: "malaysian_movies_isteriku_bukan_tukang_masak", name: "Isteriku Bukan Tukang Masak", poster: "https://i.postimg.cc/RhK0bq8s/IBTM.jpg", description: "Zharif yang mengharapkan hidangan air tangan isteri sering kali merungut, sehingga isu dapur ini menjadi punca mereka kerap bertengkar. Dek kerana kecewa dan lapar, Zharif mula membawa diri dan kerap mengunjungi sebuah restoran. Konflik menjadi semakin runcing apabila restoran tersebut rupa-rupanya dimiliki oleh Hanna, bekas kekasih Zharif yang bukan sahaja jelita malah sangat pandai memasak.", url: `${STREAM_HOST}/dl/6addfc076e979983cdce61d7` },
            { id: "malaysian_movies_cun", name: "Cun", poster: "https://i.postimg.cc/4x1cwFRZ/Cun-Dp.jpg", description: "Di kampung tersebut, Luna dipertemukan dengan Atan, seorang pemuda kampung sejati yang bekerja mengusahakan sawah padi dan memelihara kerbau. Kehadiran Luna pada mulanya mencetuskan pelbagai situasi lucu kerana perbezaan ketara antara gaya hidup gadis bandar yang penuh luks dan komuniti orang kampung yang bersahaja. Bagaimanapun, lama-kelamaan Luna mula jatuh hati dengan kedamaian hidup di desa serta kemurnian hati keluarga Atan, terutamanya adik Atan yang istimewa bernama Manis, dan neneknya, Tok Chah.", url: `${STREAM_HOST}/dl/6addfcaf6e979983cdce61d8` },
            { id: "malaysian_movies_cinta_luar_biasa", name: "Cinta Luar Biasa", poster: "https://i.postimg.cc/y8TRnrCz/CLB-DP.jpg", description: "Masa berlalu dan masing-masing kini telah mempunyai kerjaya sendiri di ibu kota. Farah bekerja sebagai seorang jurugambar profesional, Hamidah menjadi kolumnis majalah hiburan, Husin bertugas sebagai jurukamera, manakala Adam pula menjadi guru muzik. Walaupun sibuk dengan urusan kerja, mereka tetap mengototkan janji lama dan memilih Pulau Langkawi sebagai lokasi pertemuan semula mereka.", url: `${STREAM_HOST}/dl/6addfd226e979983cdce61d9` },
            { id: "malaysian_movies_cinta_fotokopi", name: "Cinta Fotokopi", poster: "https://i.postimg.cc/kgySwh3L/CF-DP.jpg", description: "Zurina mendapat tawaran untuk melanjutkan pelajaran ke sebuah kolej kediaman di ibu kota, gaya hidupnya berubah sepenuhnya. Disebabkan rasa dendam yang mendalam terhadap golongan lelaki, dia bertekad dan berjanji pada dirinya untuk mempermainkan, menggoda, serta membakar jiwa setiap lelaki yang ditemuinya dengan menggunakan kelebihan kecantikannya.", url: `${STREAM_HOST}/dl/6addfe0c6e979983cdce61da` },
            { id: "malaysian_movies_kuliah_cinta", name: "Kuliah Cinta", poster: "https://i.postimg.cc/bwPbxfWX/KC-DP.jpg", description: "Segalanya mula berubah apabila semester baru bermula dengan kemasukan pelajar-pelajar junior. Sebagai pelajar senior, Jojo dan Faramy ditugaskan untuk mengendalikan program induksi (orientasi) bagi menyambut kumpulan pelajar baru tersebut. Di situlah Faramy secara diam-diam telah terpikat dengan kejelitaan seorang pelajar junior bernama Ayu.", url: `${STREAM_HOST}/dl/6addfea56e979983cdce61db` },
            { id: "malaysian_movies_sekali_lagi", name: "Sekali Lagi", poster: "https://i.postimg.cc/VkwMqPTx/SL-DP.jpg", description: "Menghampiri hari perkahwinan, hubungan Arman dan Farina mula retak akibat salah faham sehinggakan Farina tergamak meninggalkan Arman sendirian di tepi jalan. Dalam perjalanan pulang, Arman hampir menjadi mangsa ragut samseng jalanan. Mujurlah dia diselamatkan oleh Amy (Mia Sara Nasuha), seorang kanak-kanak perempuan berusia 5 tahun yang sangat pintar dan berdikari.", url: `${STREAM_HOST}/dl/6ade00e36e979983cdce61dd` },
            { id: "malaysian_movies_awak_nak_kahwin_dengan_saya", name: "Awak Nak Kahwin Dengan Saya", poster: "https://i.postimg.cc/4xGt6RMr/ANKDS-DP.jpg", description: "Konflik bermula apabila bekas kekasih Andika iaitu Sara, menghubungi Andika untuk menjemputnya ke majlis perkahwinannya. Sara sengaja mencabar Andika untuk membawa teman wanita baharunya ke majlis tersebut demi membuktikan yang Andika sudah melupakan kisah cinta lama mereka. Berasa tercabar dan ego teruji, Andika terpaksa meminta bantuan Puteri untuk menyamar sebagai kekasihnya.", url: `${STREAM_HOST}/dl/6ade00e36e979983cdce61dc` },
            { id: "malaysian_movies_anak_pak_ustaz", name: "Anak Pak Ustaz", poster: "https://i.postimg.cc/NjtT6vVd/APU-DP.jpg", description: "Hubungan mereka mendapat tentangan hebat apabila Mahmud terserempak dengan Ustaz Husin. Rupa-rupanya, Mahmud dan Ustaz Husin merupakan kawan lama yang mempunyai sejarah lampau yang tidak baik. Mengetahui latar belakang keluarga masing-masing, ibu bapa Shahril tidak merestui hubungan tersebut, manakala Mahmud pula menyuruh Alisya memutuskan hubungannya dengan Shahril.", url: `${STREAM_HOST}/dl/6ade00e46e979983cdce61e0` },
            { id: "malaysian_movies_mat_tudung", name: "Mat Tudung", poster: "https://i.postimg.cc/DwcG5Y3n/mat-tudung-DP.jpg", description: " Zizie terkenal dengan sikapnya yang dingin dan sukar didekati oleh mana-mana lelaki. Demi memenangi hati Zizie, Johari telah mencipta helah luar biasa dengan menyamar sebagai wanita bertudung bernama Johanna, yang kononnya merupakan adik perempuan Johari.", url: `${STREAM_HOST}/dl/6ade00e46e979983cdce61e1` },
            { id: "malaysian_movies_abang_beduk", name: "Abang Beduk", poster: "https://i.postimg.cc/9Q2TdHSN/AB-DP.jpg", description: "Nizamuddin sebenarnya berasal daripada keluarga yang berada, manakala gadis impiannya, Aishah, merupakan seorang gadis kampung biasa yang sentiasa setia menyokong dan memahami dirinya. Malangnya, Nizamuddin yang lurus bendul tidak memahami konsep asas agama seperti istilah bukan mahram apabila Aishah menolak untuk kerap berjumpa. Aishah kemudian mencabar Nizamuddin untuk mencari tujuan hidupnya dan memahami erti mahram sebelum datang mencarinya semula.", url: `${STREAM_HOST}/dl/6ade00e66e979983cdce61e2` },
            { id: "malaysian_movies_jangan_pandang_belakang_congkak", name: "Jangan Pandang Belakang Congkak", poster: "https://i.postimg.cc/XYWFf6hx/JPBC-DP.jpg", description: "Mereka menerima sepucuk surat daripada datuk mereka yang kaya-raya iaitu Pak Sudir (Piee), yang menjemput mereka ke rumahnya. Di sambut oleh pembantu rumah bernama Mustika (Lisa Surihani), mereka diberitahu bakal mewarisi harta pusaka Pak Sudir jika berani bermalam selama tiga hari tiga malam di rumah tersebut.", url: `${STREAM_HOST}/dl/6ade00e36e979983cdce61df` },
            { id: "malaysian_movies_hantu_kapcai", name: "Hantu Kapcai", poster: "https://i.postimg.cc/K8bLPhVr/HK-DP.jpg", description: "Selepas kemalangan, roh Ajib terperangkap di antara alam nyata dan alam ghaib. Dia tersedar dan terkejut besar apabila mendapati dirinya pulang ke rumah, hanya untuk melihat sekujur jenazahnya sendiri sedang dikelilingi oleh ahli keluarga dan jiran tetangga yang sedang membaca doa. Keadaan menjadi buntu kerana tiada sesiapa yang mampu melihat atau mendengar kewujudan roh Ajib. Bagaimanapun, keadaan berubah apabila Ajib menyedari hanya ada seorang sahaja manusia yang boleh berkomunikasi dengannya, iaitu Ibrahim—seorang pemuda kampung yang sedang dalam pencarian untuk memenangi anugerah calon Imam Muda.", url: `${STREAM_HOST}/dl/6ade00e36e979983cdce61de` },
            { id: "malaysian_movies_suamiku_jatuh_dari_langit", name: "Suamiku Jatuh Dari Langit", poster: "https://i.postimg.cc/7ZNzXQr4/SJDL.jpg", description: "Awie tersalah pijak siling rumah tersebut lalu terjatuh dari bumbung betul-betul di hadapan Asyikin. Kejadian itu disedari oleh Pak Bidin. Demi menjaga maruah dan menutup aib keluarga kerana mendapati seorang lelaki berada di dalam bilik anaknya, Pak Bidin mengambil keputusan tegas untuk menikahkan Awie dan Asyikin serta-merta dengan mas kahwin berhutang sebanyak RM50. Dari situlah bermulanya kehidupan rumah tangga yang huru-hara tetapi mencuit hati antara si gadis alim dan si pencuri lurus bendul.", url: `${STREAM_HOST}/dl/6ade00eb6e979983cdce61e5` },
            { id: "malaysian_movies_duhai_si_pari-pari", name: "Duhai si Pari-Pari", poster: "https://i.postimg.cc/fTmmSRH5/DSPP-DP.jpg", description: "Apabila sedar, Syadon mendapati sebuah teko keemasan di sisinya. Keesokan paginya, seorang gadis misteri bernama Pari (Liyana Jasmay) yang berasal dari dunia kayangan muncul di biliknya.", url: `${STREAM_HOST}/dl/6ade00eb6e979983cdce61e4` },
            { id: "malaysian_movies_bini-biniku_gengster", name: "Bini-Biniku Gengster", poster: "https://i.postimg.cc/pXzz5L0G/BBKG-DP.jpg", description: "Filem ini mengisahkan tentang Herry dan Manja, sepasang suami isteri yang hidup bahagia, romantik, dan saling menyayangi. Di mata Herry, Manja merupakan seorang suri rumah yang sangat lembut, baik, dan taat. Namun, Herry tidak mengetahui bahawa Manja mempunyai identiti rahsia sebagai seorang ketua kumpulan gangster kawasan yang digeruni (dikenali sebagai Kak Yong).", url: `${STREAM_HOST}/dl/6ade01846e979983cdce61e7` },
            { id: "malaysian_movies_syurga_cinta", name: "Syurga Cinta", poster: "https://i.postimg.cc/7ZNzXQr5/syurga-cinta-DP.jpg", description: "Sekembalinya ke tanah air, Irham bertemu semula dengan rakan-rakan lamanya, Alex dan Zainal. Menyedari kehebatan Irham yang sering menang dalam memikat wanita, mereka mencabar Irham untuk memikat seorang gadis bertudung (muslimah sejati). Gadis tersebut ialah Siti Syuhadah, seorang guru agama di sebuah tadika. Secara kebetulan, adik angkat Irham yang comel bernama Ikmal merupakan salah seorang pelajar di tadika milik Syuhadah.", url: `${STREAM_HOST}/dl/6ade01846e979983cdce61e8` },
            { id: "malaysian_movies_manisnya_cinta_di_cappadocia", name: "Manisnya Cinta Di Cappadocia", poster: "https://i.postimg.cc/hGPdYbK2/Manisnya-Cinta-DP.jpg", description: "Untuk menenangkan fikiran dan lari seketika daripada masalah hidup, Ifti bersama rakan karibnya, Dhivia (Rafidah Abdullah), telah ditugaskan ke Turki oleh Datin Noor (Erma Fatima) untuk mencari perabot rumah. Di sanalah, takdir mempertemukannya kembali dengan Nazmi (Shaheizy Sam), seorang lelaki misteri yang pada awalnya memperkenalkan diri hanya sebagai seorang pemandu bas.", url: `${STREAM_HOST}/dl/6ade01846e979983cdce61e9` },
            { id: "malaysian_movies_alif_dalam_7_dimensi", name: "Alif Dalam 7 Dimensi", poster: "https://i.postimg.cc/ZKppv5fH/alif-dp.jpg", description: " Aliff Lamin (Izzue Islam), seorang pelajar universiti yang anti-sosial dan pendiam. Dia sebenarnya mewarisi saka daripada nenek moyangnya, yang memberikan kelebihan luar biasa untuk melihat dan mendengar entiti paranormal. Aliff cuba merahsiakan perkara ini sehinggalah dia terpaksa mempertahankan diri daripada serangan makhluk halus di dalam kelas.", url: `${STREAM_HOST}/dl/6ade01846e979983cdce61e6` },
            { id: "malaysian_movies_mamak_cupcake", name: "Mamak Cupcake", poster: "URL", description: "Pada ulang tahun kelahirannya yang ke-21, bapa MJ meletakkan harapan yang sangat tinggi dan mahu memberi kepercayaan kepadanya untuk mewarisi empayar perniagaan tradisi keluarga mereka, iaitu restoran Nasi Kandar. Malah, MJ juga pernah dihantar ke India selama 10 tahun oleh bapanya semata-mata untuk mempelajari selok-belok perniagaan makanan tersebut. Konflik mula melanda diri MJ apabila dia terpaksa berbelah bahagi antara tanggungjawab memenuhi impian bapanya atau mengejar cita-citanya sendiri dalam bidang pastri.", url: `${STREAM_HOST}/dl/6ade01846e979983cdce61ea` },
            { id: "malaysian_movies_bara", name: "Bara", poster: "https://i.postimg.cc/Wp9ZwZ6t/Bara.jpg", description: "Amri bertindak melindungi seorang wanita bernama Effa yang melarikan diri daripada buruan ketua sindiket pelacuran kejam bernama Carlos. Effa kemudiannya bekerja sebagai pelayan di kelab malam tempat Amri membuat persembahan. Hubungan Amri dan Effa semakin rapat dan intim. Effa dibunuh secara kejam di biliknya, dan Amri difitnah serta dipersalahkan atas pembunuhan tersebut sehingga dia terpaksa melarikan diri daripada buruan polis.", url: `${STREAM_HOST}/dl/6adb424b6e979983cdce617a` },
            { id: "malaysian_movies_azura", name: "Azura", poster: "https://i.postimg.cc/DzVLbKQq/Azura.jpg", description: "Mengisahkan Azura, seorang gadis yatim piatu yang gigih dan bijak, yang berusaha keras belajar di universiti demi mencapai cita-citanya. Dia kemudiannya bertemu dengan Zek, seorang anak orang kaya yang hidup mewah dan manja. Walaupun status darjat mereka jauh berbeza, cinta mula berputik antara mereka berdua. Bagaimanapun, hubungan mereka mendapat tentangan hebat daripada bapa Zek (Tan Sri Puteh), memaksa mereka mengharungi pelbagai dugaan dan cabaran hidup yang getir demi mempertahankan cinta mereka.", url: `${STREAM_HOST}/dl/6adb424b6e979983cdce6175` },
            { id: "malaysian_movies_hantu_siang", name: "Hantu Siang", poster: "https://i.postimg.cc/k4DBG163/hantu-siang.jpg", description: "Filem ini mengisahkan tentang Badul, seorang lelaki kasanova dan playboy yang sangat licik. Sepanjang pengalamannya, dia telah berjaya mendekati, menggoda, dan memanipulasi seramai 17 orang gadis. Bagaimanapun, sikap buruknya itu akhirnya memakan diri. Dalam cubaan terbaharunya untuk memperdayakan dua orang gadis lagi, helah dan strategi liciknya telah gagal. Keadaan menjadi terbalik apabila dia sendiri yang terperangkap dengan jeratnya. Akibatnya, Badul menerima padah dan terpaksa mengahwini kedua-dua gadis tersebut secara serentak.", url: `${STREAM_HOST}/dl/6adb4257b8205022a8cfff18` },
            { id: "malaysian_movies_setinggan", name: "Setinggan", poster: "https://i.postimg.cc/pLthCJ7X/setinggan.jpg", description: "Pada mulanya, kehidupan komuniti di kampung setinggan tersebut berjalan dengan aman damai, di mana para penduduknya hidup harmoni dan saling bekerjasama. Bagaimanapun, keadaan mula berubah menjadi kucar-kacir apabila kawasan penempatan tersebut kerap diganggu oleh makhluk halus dan hantu merayau.", url: `${STREAM_HOST}/dl/6adb424b6e979983cdce6176` },
            { id: "malaysian_movies_mr.os", name: "Mr. Os", poster: "https://i.postimg.cc/qBcqTJc8/Mr-Os.jpg", description: "Untuk melayakkan diri menerima baki harta warisan yang bernilai jutaan ringgit, Os mesti menghabiskan kesemua wang RM500,000 tersebut dalam tempoh 21 hari. Namun, syarat ketatnya adalah dia tidak dibenarkan membeli sebarang harta tetap atau aset (seperti rumah, tanah, atau barang pelaburan) untuk simpanan peribadi.", url: `${STREAM_HOST}/dl/6adb4252b8205022a8cfff17` },
            { id: "malaysian_movies_gila_gila_remaja", name: "Gila-Gila Remaja", poster: "https://i.postimg.cc/mktCxZN9/gila-gila-remaja.jpg", description: "Roy yang gemar berlumba motosikal dan bergaul dengan kumpulan remaja nakal telah jatuh cinta dengan Suziana. Hubungan ini tidak disenangi oleh Farouk, yang turut meminati Suzi dan cuba menjatuhkan Roy.", url: `${STREAM_HOST}/dl/6adb424b6e979983cdce6178` },
            { id: "malaysian_movies_gila_gila_remaja_2", name: "Gila-Gila Remaja 2", poster: "https://i.postimg.cc/xdnmf33j/gila-gila-remaja-2.jpg", description: "Afiq pada mulanya menjalin hubungan cinta dengan Erna (Bella Dally). Namun, selepas kehadiran pelajar baharu bernama Lisa (Faralyna Idris) di kolej mereka, Afiq jatuh hati kepada Lisa.", url: `${STREAM_HOST}/dl/6adb424b6e979983cdce6179` },
            { id: "malaysian_movies_prebet_lapok", name: "Prebet Lapok", poster: "https://i.postimg.cc/7LK5x8L5/prebet-lapok.jpg", description: "Permohonan Badul diterima dan dia dihantar ke pusat Latihan Asas Ketenteraan di Port Dickson. Sepanjang tempoh latihan rekrut dijalankan, pelbagai peristiwa lucu, kecoh, dan mencuit hati berlaku akibat telatah Badul yang lurus bendul, kelam-kabut, serta sukar menyesuaikan diri dengan disiplin ketat pihak tentera dan Sarjan Ismail. Di sebalik kekecohan itu, dalam diam ada seorang gadis (Tina) yang mula menaruh hati kepada Badul.", url: `${STREAM_HOST}/dl/6adb424b6e979983cdce6177` },
            { id: "malaysian_movies_orang_kampung_otak_kimia", name: "Orang Kampung Otak Kimia", poster: "https://i.postimg.cc/tgrvjJGT/orang-kampung-otak-kimia.jpg", description: "Walaupun dianggap bodoh di peringkat akademik, Os sebenarnya mempunyai kebolehan luar biasa serta kepintaran tersembunyi dalam bidang kimia dan biologi. Dia berjaya menghasilkan satu ramuan atau formula ajaib yang membolehkan orang bisu dan juga haiwan untuk bercakap.", url: `${STREAM_HOST}/dl/6adb427db8205022a8cfff19` },
            { id: "malaysian_movies_main_main_hantu", name: "Main-Main Hantu", poster: "https://i.postimg.cc/SR7ShXwL/Main-Main-Hantu.jpg", description: "Kisah bermula apabila sekumpulan pemain bola jaring wanita bersama jurulatih mereka, Cikgu Nancy (Nancie Foo), dalam perjalanan untuk menyertai satu perlawanan di Melaka. Malangnya, perjalanan mereka terganggu apabila bas yang mereka naiki tiba-tiba rosak dan menyebabkan mereka terkandas di tengah jalan.", url: `${STREAM_HOST}/dl/6ad677726e979983cdce5f89` },            
            { id: "malaysian_movies_senario_beach_boy", name: "Senario Beach Boy", poster: "https://i.postimg.cc/WzyZD2xt/senariobeachboy.jpg", description: "Filem ini mengisahkan tiga sekawan—Azlee, Mazlan, dan Wahid—yang bosan selepas tiga bulan bekerja di Zoo Negara. Mereka merancang untuk pergi bercuti selama dua minggu dan memilih sebuah destinasi pulau yang kelihatan sangat indah di internet, iaitu Ariba Ariba Resort. Namun, sebaik sahaja mereka tiba di jeti pulau tersebut, nasib malang menimpa apabila dompet mereka telah dicuri. Malah, mereka turut terlanggar tiga orang gadis iaitu Qasidah, Hamidah, dan Zuraidah. Kejutan tidak berhenti di situ; apabila mereka tiba di resort berkenaan, suasana Ariba Ariba Resort rupa-rupanya terbiar, sunyi, dan hampir muflis, jauh berbeza daripada apa yang dipaparkan dalam internet.", url: `${STREAM_HOST}/dl/6acc66136e979983cdce55d5` },
            { id: "malaysian_movies_senario_the_movie", name: "Senario The Movie", poster: "https://i.postimg.cc/90k94Wsr/senariothemovie.jpg", description: "Konflik bermula apabila muncul seorang penipu licik bernama Shamsul. Shamsul mempunyai rancangan jahat untuk membuka sebuah Pusat Riadah, namun niatnya terbantut kerana Pak Tam (pemilik sebuah warung berhampiran) enggan menjual tanahnya. Shamsul kemudiannya mengupah Wahid untuk menakut-nakutkan orang ramai yang berkunjung ke kawasan warung Pak Tam supaya perniagaan di situ lumpuh dan Pak Tam terpaksa menyerahkan tanah tersebut.", url: `${STREAM_HOST}/dl/6acc66136e979983cdce55d6` },
            { id: "malaysian_movies_siapa_tak_sayang_bini", name: "Siapa Tak Sayang Bini", poster: "https://i.postimg.cc/XqP5ZVtZ/siapataksayangbini.jpg", description: "Cerita ini mengisahkan kekalutan dan konflik rumah tangga dua lelaki berjiran iaitu Kassim yang garang dan mengawal isteri, serta Karif yang lebih lembut dan dikawal oleh isterinya.", url: `${STREAM_HOST}/dl/6acc13f16e979983cdce55ce` },
            { id: "malaysian_movies_siapa_tak_sayang_bini_2", name: "Siapa Tak Sayang Bini 2", poster: "https://i.postimg.cc/nVSBSkrT/siapataksayangbini2.jpg", description: "Sinopsis atau plot penuh rasmi yang terperinci tidak disenaraikan secara meluas di pangkalan data umum, namun ia merupakan kesinambungan atau siri komedi daripada telefilem pertama Siapa Tak Sayang Bini! (2003) yang mengisahkan pergolakan serta keletah lucu rumah tangga", url: `${STREAM_HOST}/dl/6acc13f16e979983cdce55d1` },
            { id: "malaysian_movies_mami_jarum_junior", name: "Mami Jarum Junior", poster: "https://i.postimg.cc/6qPZ79gP/mamijarumjunior.jpg", description: "Ia merupakan sambungan kepada filem Mami Jarum. Cerita ini berkisar tentang Rita (Rita Rudaini), seorang andartu yang gemar mengumpat dan memecah-belahkan rumah tangga orang lain walaupun rakan baiknya Mami Jarum sudah bertaubat.", url: `${STREAM_HOST}/dl/6acc05d16e979983cdce55c5` },
            { id: "malaysian_movies_mami_jarum_the_movie", name: "Mami Jarum The Movie", poster: "https://i.postimg.cc/rsH4d83v/mamijarumthemovie.jpg", description: "Cerita ini berkisar tentang seorang wanita gemar bergosip, sombong, dan bangga dengan keluarganya, namun konflik berlaku apabila dia mendapati keadaannya tidak sesempurna yang disangka.", url: `${STREAM_HOST}/dl/6acc05d16e979983cdce55c2` },
            { id: "malaysian_movies_6_jahanam", name: "6 Jahanam", poster: "https://i.postimg.cc/mrv01hhL/6-Jahanam.jpg", description: "Semasa serbuan terakhir itu, mereka merompak sebuah kedai kain milik saudagar dan bekas pendekar bernama Tantari (lakonan P. Ramlee). Tantari tiada di rumah ketika kejadian kerana urusan perniagaan. Malang nasib isterinya, Masmera, apabila dia dirogol secara berkumpulan dan dibunuh dengan kejam oleh Enam Jahanam. Sekembalinya Tantari, dia mendapati isterinya telah tiada. Dengan bersenjatakan gambar potret isterinya sebagai satu-satunya petunjuk, Tantari bersumpah untuk menuntut bela", url: `${STREAM_HOST}/dl/6adb497f6e979983cdce617c` },
            { id: "malaysian_movies_keluarga_69", name: "Keluarga 69", poster: "https://i.postimg.cc/nV4t7Kvg/Keluarga-69.jpg", description: "Anak Orang Kaya Bakar bernama Osman (lakonan P. Ramlee) telah diusir dari rumah oleh bapanya kerana tabiatnya yang suka berfoya-foya dan mabuk. Osman kemudiannya merantau bersama rakannya, Badim, sehingga berjaya menjadi seorang penyanyi terkenal di Ipoh dengan bantuan seorang wanita jelita.", url: `${STREAM_HOST}/dl/6adb497f6e979983cdce617f` },
            { id: "malaysian_movies_ahmad_albab", name: "Ahmad Albab", poster: "https://i.postimg.cc/ZRmdqFPz/Ahmad-Albab.jpg", description: "Sheikh Mas'hud mempunyai tiga orang anak perempuan: Safura (Zahara), Suhara, dan Mastura. Kerana gilakan darjat, Mas'hud telah mengahwinkan Safura dan Suhara dengan pilihan hatinya, iaitu Muharram dan Safar, yang berasal dari keluarga yang kononnya kaya. Namun, anak keduanya, Mastura, menentang sikap angkuh ayahnya. Akibat berang dengan kedegilan Mastura, Mas'hud menghalau dan memaksa Mastura berkahwin dengan seorang pemandu/penggembala kambing yang miskin bernama Syawal untuk memberi pengajaran kepadanya.", url: `${STREAM_HOST}/dl/6adb497f6e979983cdce617e` },
            { id: "malaysian_movies_antara_2_darjat", name: "Antara 2 Darjat", poster: "https://i.postimg.cc/Ss4MK76H/Antara-2-Darjat.jpg", description: "Filem klasik Antara Dua Darjat (1960) arahan dan lakonan P. Ramlee mengisahkan tentang konflik percintaan yang dihalangi oleh perbezaan taraf sosial dan darjat keturunan antara Ghazali dengan Tengku Zaleha.", url: `${STREAM_HOST}/dl/6adb497f6e979983cdce617b` },
            { id: "malaysian_movies_penarik_becha", name: "Penarik Becha", poster: "https://i.postimg.cc/mD4HrNY0/Penarik-Becha.jpg", description: "Filem ini mengisahkan tentang Amran (P. Ramlee), seorang pemuda miskin yang bekerja sebagai penarik beca untuk menyara ibunya yang tua. Kehidupan Amran berubah selepas beliau menyelamatkan Azizah (Saadiah), anak perempuan tunggal seorang bangsawan yang sangat kaya dan kedekut, Orang Kaya Marzuki (Udo Omar), daripada diganggu oleh sekumpulan pemuda nakal yang diketuai oleh Ghazali (Salleh Kamil).", url: `${STREAM_HOST}/dl/6adb497f6e979983cdce6180` },
            { id: "malaysian_movies_anakku_sazali", name: "Anakku Sazali", poster: "https://i.postimg.cc/C10qKHCw/Anakku-Sazali.jpg", description: "Filem Anak-ku Sazali (1956) ialah sebuah filem drama keluarga klasik Melayu arahan Phani Majumdar yang mengisahkan tentang kasih sayang seorang bapa yang terlalu memanjakan anaknya sehingga membawa kepada keruntuhan akhlak dan kemusnahan hidup si anak.", url: `${STREAM_HOST}/dl/6adb497f6e979983cdce617d` },
            { id: "malaysian_movies_anak_bapak", name: "Anak Bapak", poster: "https://i.postimg.cc/nrsbPLT4/Anak-Bapak.jpg", description: "Filem ini mengisahkan tentang Harun (lakonan P. Ramlee), seorang pengurus ladang getah yang baik hati dan bertanggungjawab terhadap pekerjanya, namun mempunyai gaya hidup yang suka berfoya-foya. Akibatnya, Harun terjebak dalam masalah kewangan dan diburu hutang, terutamanya oleh Norma (Ruminah Sidek), seorang penyanyi kelab malam yang tamak.", url: `${STREAM_HOST}/dl/6adb4985092762b16756367e` },
            { id: "malaysian_movies_semerah_padi", name: "Semerah Padi", poster: "https://i.postimg.cc/d3qNGCFF/Semerah-Padi.jpg", description: "Keamanan kampung ini mula tergugat selepas berlakunya skandal zina yang melibatkan penduduk kampung iaitu Jejaka dan Galak (isteri Kechewa), lalu hukuman berat dijatuhkan mengikut hukum syarak. Kematian Jejaka akibat hukuman tersebut mencetuskan rasa dendam yang mendalam dalam diri abangnya, Borek.", url: `${STREAM_HOST}/dl/6adb498a092762b167563680` },
            { id: "malaysian_movies_sarjan_hassan", name: "Sarjan Hassan", poster: "https://i.postimg.cc/4ySvnHNn/Sarjan-Hassan.jpg", description: "Kehadiran Hassan di rumah itu tidak disenangi oleh Aziz (Jins Shamsuddin), anak kandung Pak Lebai yang sombong. Aziz sering membuli dan menghina Hassan sebagai seorang yang penakut dan tidak berguna. Malah, Aziz turut menghasut rakannya, Buang (Salleh Kamil), seorang samseng kampung, untuk turut sama membuli Hassan. Di sebalik penderitaan itu, Hassan hanya mampu bersabar dan mendapat sokongan daripada Minah (Aini Jasmin), pembantu rumah Pak Lebai, serta Salmah (Saadiah), gadis sekampung yang dalam diam mencintai Hassan", url: `${STREAM_HOST}/dl/6adb498a092762b16756367f` },
            { id: "malaysian_movies_musang_berjanggut", name: "Musang Berjanggut", poster: "https://i.postimg.cc/zBNgfSCt/Musang-Berjanggut.jpg", description: "Untuk menyingkirkan Tun Nila Utama, sang Raja berpura-pura sakit keras dan mengklaim hanya bisa disembuhkan dengan daging hati musang berjanggut seEKOR hewan khayalan yang tidak benar-benar ada. Tun Nila diutus mencarinya dengan ancaman hukuman mati jika gagal.", url: `${STREAM_HOST}/dl/6adb498f092762b167563681` },
            { id: "malaysian_movies_madu_3", name: "Madu 3", poster: "https://i.postimg.cc/KjZptTbS/Madu-3.jpg", description: "Jamil (P. Ramlee) sudah menikah selama 12 tahun dengan istri pertamanya, Latifah (Jah Hj. Mahadi), tetapi mereka belum dikaruniai anak dan Jamil merasa diabaikan.  Jamil kemudian menikah lagi secara sembunyi-sembunyi dengan istri kedua, Hasnah (Zera Agus), tanpa sepengetahuan Latifah. Belum cukup, saat bekerja menagih sewa rumah, ia jatuh cinta dan menikahi Rohani (Sarimah), anak dari salah satu penyewanya.", url: `${STREAM_HOST}/dl/6adb4a0d092762b167563682` },
            { id: "malaysian_moviesmm_laksamana_do_re_mi", name: "Laksamana Do Re Mi", poster: "https://i.postimg.cc/0QvwNdYZ/Laksamana-Do-Re-Mi.webp", description: "Dengan bantuan barangan sakti itu, mereka pergi ke Negara Pasir Berdengung dan berjaya dilantik menjadi laksamana. Mereka kemudian diarah membantu Negara Pasir Dua Butir yang sedang diancam oleh pemberontak bernama Menteri Fasola. Fasola bertindak demikian kerana lamarannya ditolak oleh Sultan.", url: `${STREAM_HOST}/dl/6adb4a0d092762b167563684` },
            { id: "malaysian_movies_ibu_mertuaku", name: "Ibu Mertuaku", poster: "https://i.postimg.cc/85G6CBRd/Ibu-Mertuaku.jpg", description: " Hidup dalam kesulitan ekonomi, Sabariah akhirnya menyerah dan kembali ke ibunya di Singapura. Nyonya Mansoor memanfaatkan situasi ini dengan mengirimkan telegram palsu yang menyatakan bahwa Sabariah telah meninggal dunia.", url: `${STREAM_HOST}/dl/6adb4a0d092762b167563685` },
            { id: "malaysian_movies_do_re_mi", name: "Do Re Mi", poster: "https://i.postimg.cc/NMtH076x/Do-Re-Mi.jpg", description: "Ketiganya tidak sengaja bertemu di kantor buruh saat sama-sama mencari pekerjaan. Saat itu terjadi kehebohan ketika seorang wanita diragut tasnya oleh pencuri. Do dan Re awalnya salah paham dan mengira Mi adalah pelakunya karena ikut mengejar pencuri tersebut, namun mereka akhirnya berhasil menangkap pencuri yang sebenarnya.", url: `${STREAM_HOST}/dl/6adb4a0e092762b167563688` },
            { id: "malaysian_movies_nasib_labu_labi", name: "Nasib Si Labu Labi", poster: "https://i.postimg.cc/6QnZw1v1/Nasib-Si-Labu-Labi.jpg", description: "Istri Haji Bakhil meninggal dunia, membuatnya hidup menduda dan mengalami krisis paruh baya. Ia kemudian jatuh hati kepada Cikgu Murni (Murni Sarawak), seorang guru di sekolah anak-anak yatim.", url: `${STREAM_HOST}/dl/6adb4a18092762b167563689` },
            { id: "malaysian_movies_labu_labi", name: "Labu Labi", poster: "https://i.postimg.cc/8c1XLvSq/Labu-Labi.jpg", description: "Labu dan Labi bekerja sebagai pelayan di rumah Haji Bakhil bin Haji Kedekut, seorang kaya raya yang terkenal sangat pelit. Mereka sering dimarahi, dimaki, hingga dipaksa menerima hukuman fisik (seperti ketuk ketampi) oleh Haji Bakhil. Meskipun tertindas, mereka bertahan karena sama-sama menyimpan hati kepada anak perempuan Haji Bakhil yang cantik, yaitu Manisah", url: `${STREAM_HOST}/dl/6adb4a18092762b16756368a` },
            { id: "malaysian_movies_masam_masam_manis", name: "Masam-Masam Manis", poster: "https://i.postimg.cc/nrHSqmJW/Masam-Masam-Manis.jpg", description: "Cerita bermula dari pertemuan dan pertengkaran kecil antara seorang guru bernama Cikgu Shaari dan seorang gadis bernama Norkiah yang sering bertemu, antara lain di Kebun Binatang Negara. Mereka kerap berselisih paham hingga akhirnya menyadari bahwa mereka tinggal bertetangga di tempat sewa (lojing) milik Mak Minah.", url: `${STREAM_HOST}/dl/6adb4a0d092762b167563683` },
            { id: "malaysian_movies_nasib_do_re_mi", name: "Nasib Do Re Mi", poster: "https://i.postimg.cc/wvzmBcXV/Nasib-Do-Re-Mi.jpg", description: "Saat bermalam di sebuah taman bunga, mereka melihat seorang pemuda bernama Lokman dipukuli oleh sekelompok penjahat. Do, Re, dan Mi membantu Lokman melawan para preman tersebut hingga polisi datang menolong.", url: `${STREAM_HOST}/dl/6adb4a0d092762b167563686` },
            { id: "malaysian_movies_3_abdul", name: "3 Abdul", poster: "https://i.postimg.cc/wBLNHbmw/3-Abdul.jpg", description: " Apabila Ismet Ulam Raja jatuh sakit dan kemudiannya meninggal dunia, dua anak yang sulung (Abdul Wahab dan Abdul Wahib) yang bersikap tamak telah merampas dan membahagikan harta pusaka bapa mereka sesama sendiri secara tidak adil, manakala Abdul Wahub dipinggirkan dan keluar dari rumah", url: `${STREAM_HOST}/dl/6adb4a0e092762b167563687` },
            { id: "malaysian_movies_pendekar_bujang_lapok", name: "Pendekar Bujang Lapok", poster: "https://i.postimg.cc/HnpvbMgS/Pendekar-Bujang-Lapok.jpg", description: "Mereka bertiga pergi ke Kampung Pinang Sebatang dan mencuba nasib untuk berguru dengan Pendekar Mustar. Sebelum itu, mereka berdepan dengan pergaduhan di jeti melibatkan orang suruhan Tauke Sampan yang bersikap angkuh dan kasar. Pendekat Mustar berjaya menumpaskan kumpulan tersebut secara berseorangan, menyebabkan Ramli, Ajis, dan Sudin kagum lalu tekad berguru dengannya.", url: `${STREAM_HOST}/dl/6adb4a47092762b16756368d` },
            { id: "malaysian_movies_nujum_pak_belalang", name: "Nujum Pak Belalang", poster: "https://i.postimg.cc/yxVp0RHL/Nujum-Pak-Belalang.jpg", description: "Belalang memiliki ide cerdik untuk membantu ayahnya dengan cara mencuri barang-barang milik penduduk desa (seperti kain gundik raja atau kerbau yang hilang), lalu menyebarkan rumor bahwa Pak Belalang adalah seorang ahli nujum (peramal) sakti yang mampu menemukan barang hilang.", url: `${STREAM_HOST}/dl/6adb4a47092762b16756368c` },
            { id: "malaysian_movies_seniman_bujang_lapok", name: "Seniman Bujang Lapok", poster: "https://i.postimg.cc/wjJ5TvK7/Seniman-Bujang-Lapok.jpg", description: "Setelah melihat iklan pencarian pelakon daripada Malay Film Productions, mereka bertiga mendapat inspirasi untuk mencuba nasib menjadi bintang filem di Studio Jalan Ampas. Mereka bertemu dengan pengurus studio (Kemat Hassan) dan diarah menjalani ujian skrin (screen test) oleh Pengarah Ahmad Nisfu", url: `${STREAM_HOST}/dl/6adb4a4c092762b16756368e` },
            { id: "malaysian_movies_bujang_lapok", name: "Bujang Lapok", poster: "https://i.postimg.cc/Xvd53DCc/Bujang-Lapok.jpg", description: "Filem ini mengisahkan tentang kehidupan tiga orang pemuda bujang yang tinggal bersama di sebuah rumah sewa. Mereka mengharungi pelbagai cabaran dalam kehidupan seharian dan usaha memburu cinta gadis pilihan masing-masing.", url: `${STREAM_HOST}/dl/6adb4a4c092762b16756368f` },
            { id: "malaysian_movies_ali_baba_bujang_lapok", name: "Ali Baba Bujang Lapok", poster: "https://i.postimg.cc/xdMmYFzK/Ali-Baba-Bujang-Lapok.jpg", description: "Suatu hari, ketika Ali Baba mengutip kayu api, dia tanpa sengaja melihat sekumpulan 40 orang penyamun menuju ke sebuah gua. Ali Baba mendengar mantera ajaib yang digunakan untuk membuka pintu gua tersebut. Selepas penyamun itu pergi, Ali Baba masuk ke dalam gua dan mengambil sedikit harta rampasan untuk menyara keluarganya.", url: `${STREAM_HOST}/dl/6adb4a18092762b16756368b` },
            { id: "malaysian_movies_zombie_kampung_pisang", name: "Zombie Kampung Pisang", poster: "https://i.postimg.cc/NM1KVrvd/Zombie-Kampung-Pisang.jpg", description: "Kerantong dipalu bagi mengumpulkan orang ramai di Dewan Orang Ramai untuk berbincang. Namun, ketika kekecohan sedang berlaku, beberapa orang penduduk kampung lagi rebah dan mati mengejut seorang demi seorang. Tidak lama kemudian, bekalan elektrik terputus menyebabkan seluruh kampung menjadi gelap gelita. Pada saat itulah, mayat-mayat yang telah hilang tadi bangkit semula sebagai zombi yang ganas dan mula menyerang penduduk kampung yang lain.", url: `${STREAM_HOST}/dl/6adc88d36e979983cdce6197` },
            { id: "malaysian_movies_husin_mon_jin_pakai_toncit", name: "Husin Mon Jin Pakai Toncit", poster: "https://i.postimg.cc/4dzYMhR8/Jin-Toncit.jpg", description: "Kepulangan Husin menyebabkan kemunculan semula bekas kekasihnya, Mon (lakonan Ezlynn), yang kini kelihatan aneh dan seolah-olah menyembunyikan sesuatu rahsia. Dalam masa yang sama, Kampung Pisang digemparkan dengan kemunculan entiti misteri yang dikenali sebagai Jin Pakai Toncit, yang dikatakan memburu dan menculik lelaki teruna di kampung tersebut sebagai korban.", url: `${STREAM_HOST}/dl/6adc89696e979983cdce6198` },
            { id: "malaysian_movies_kampong_pisang_berbuah_dua_kali", name: "Kampong Pisang Berbuah Dua Kali", poster: "https://i.postimg.cc/76g5cTrc/Zombie-Kampung-Pisang-2.jpg", description: "Kejadian pelik turut menimpa Gerhana (adik kepada Cik Purnama) yang terpukau dengan kecantikan Cik Mek, mencetuskan rasa kurang senang dalam kalangan penduduk seperti Pak Karim dan Pak Din.", url: `${STREAM_HOST}/dl/6adc8b846e979983cdce6199` },
            { id: "malaysian_movies_hantu_kak_limah", name: "Hantu Kak Limah", poster: "https://i.postimg.cc/cHJzkfnV/Hantu-Kak-Limah.jpg", description: "Kak Limah baru saja berkahwin dengan Khuda yang jauh lebih muda daripadanya. Tidak lama selepas menikmati kebahagiaan rumah tangga, Kak Limah dijumpai mati dalam keadaan yang mengerikan.", url: `${STREAM_HOST}/dl/6adcaff36e979983cdce61cb` },            
            { id: "malaysian_movies_hantu_kak_limah_balik_rumah", name: "Hantu Kak Limah Balik Rumah", poster: "https://i.postimg.cc/BbbDQ8YV/hantukaklimahbalikrumah.jpg", description: "Filem Hantu Kak Limah Balik Rumah (2010) ialah filem komedi seram Malaysia arahan Mamat Khalid. Cerita bermula apabila Husin (Awie) pulang ke Kampung Pisang selepas dua tahun di Singapura dan hairan melihat jirannya, Kak Limah (Delimawati), berkelakuan pelik. Penduduk kampung menyangka Kak Limah sudah menjadi hantu sehingga beberapa bomoh dipanggil, sebelum rahsia sebenar akhirnya terbongkar.", url: `${STREAM_HOST}/dl/6acbfc736e979983cdce5555` }
        ]
    },
    "malaysian_movies_seram_catalog": {
        id: "malaysian_seram_movies_catalog",
        isMulti: true,
        items: [
            { id: "mm_7_perhentian", name: "7 Perhentian", poster: "https://i.postimg.cc/zGfDSjxK/7-Perhentian-DP.jpg", url: `${STREAM_HOST}/dl/6ae211d06e979983cdce644d` },
            { id: "mm_hospital", name: "Hospital", poster: "https://i.postimg.cc/Jzh7cqpX/Hospital-DP.jpg", url: `${STREAM_HOST}/dl/6ae212a66e979983cdce6453` },
            { id: "mm_hantu_air", name: "Hantu Air", poster: "https://i.postimg.cc/K8YcrN0g/Hantu-Air-DP.jpg", url: `${STREAM_HOST}/dl/6ae212af6e979983cdce6459` },
            { id: "mm_resort_berhantu", name: "Resort Berhantu", poster: "https://i.postimg.cc/T3P2q9tL/Resort-Berhantu-DP.jpg", url: `${STREAM_HOST}/dl/6ae212af6e979983cdce645b` },
            { id: "mm_jemputan_ke_neraka", name: "Jemputan Ke Neraka", poster: "https://i.postimg.cc/L8SftF7t/JKN-DP.webp", description: "Cerita bermula apabila Ivy (Janna Nick), seorang kurator balai seni, menerima satu kad jemputan ke majlis perkahwinan mewah sahabat lamanya dari zaman universiti, Lisa (Jasper Supayah). Ivy kemudian memujuk tunangnya, Norman (Hafreez Adam), untuk menemaninya ke majlis tersebut. Majlis itu diadakan di sebuah banglo mewah yang terletak jauh di atas bukit di sebuah kawasan peranginan yang sunyi dan terasing.", url: `${STREAM_HOST}/dl/6ade00e66e979983cdce61e3` },
            { id: "mm_tiang_seri", name: "Tiang Seri", poster: "https://i.postimg.cc/wMZcxpZg/Tiang-Seri.jpg", description: "Mengisahkan tentang bapa kepada seorang remaja bernama Nadrah yang telah membeli sebatang tiang kayu antik untuk mendirikan sebuah gazebo di kawasan rumah mereka. Ketika sedang melakukan kerja sekolah di gazebo tersebut, Nadrah terjumpa sebatang paku lama yang tertancap pada tiang itu lalu mencabutnya. Tindakan tersebut secara tidak sengaja telah membebaskan satu entiti/semangat jahat yang terperangkap di dalam tiang berkenaan. Makhluk ghaib tersebut kemudian merasuki badan Nadrah, menyebabkan dia mengalami mimpi ngeri berterusan dan bertindak agresif sehingga mencetuskan beberapa kes kematian misteri.", url: `${STREAM_HOST}/dl/6adc2d077776deedc8b75011` },
            { id: "mm_munafik", name: "Munafik", poster: "https://i.postimg.cc/d3fC7qgF/munafik.jpg", description: "Adam (Syamsul Yusof) ialah seorang ustaz dan pengamal perubatan Islam yang jiwanya rapuh serta hilang punca akibat gagal menerima takdir (Qada dan Qadar) atas kematian isterinya. Selepas bersetuju untuk merawat Maria melalui rukyah, Adam mula dihantui pelbagai peristiwa aneh, seram, dan ujian yang menguji semula keimanannya terhadap Allah SWT.", url: `${STREAM_HOST}/dl/6acc06936e979983cdce55cb` },
            { id: "mm_munafik_2", name: "Munafik 2", poster: "https://i.postimg.cc/fypjWNph/Munafik-2.jpg", description: "staz Adam berhadapan dengan ajaran sesat yang dipimpin oleh seorang lelaki kejam bernama Abu Jar (Nasir Bilal Khan) di sebuah perkampungan terpencil. Abu Jar menggunakan sihir dan tipu muslihat untuk merosakkan akidah penduduk kampung supaya tidak lagi percaya kepada Allah dan ajaran Islam.", url: `${STREAM_HOST}/dl/6adc31436e979983cdce6196` },
            { id: "mm_long_khong_2", name: "Long Khong 2", poster: "https://i.postimg.cc/tJwtRjwG/long-khong-2.jpg", description: "Panor sebenarnya mempunyai hubungan sulit dengan beberapa orang lelaki, sehingga menyebabkan dia dimalukan, diseksa, dan dikenakan sihir oleh sekumpulan pelajar. Untuk melindungi dirinya dan membalas dendam terhadap mereka yang mengkhianatinya serta pawang (Porn) yang tidak bermoral, Panor mendalami dan menggunakan ilmu hitam yang kuat.", url: `${STREAM_HOST}/dl/6adc292f9f12d6e309685176` },
            { id: "mm_art_of_the_devil_3", name: "Long Khong 3", poster: "https://i.postimg.cc/zv6SDr65/long-khong-3.jpg", description: "Cerita mengisahkan Miss Panor, seorang guru sekolah luar bandar yang cantik. Kecantikannya menjadi satu kutukan apabila dia sering diganggu dan diidamkan oleh para pelajar serta rakan sekerja lelaki yang mahu memikatnya menggunakan sihir pemanis dan ilmu hitam.", url: `${STREAM_HOST}/dl/6adc2b2b9f12d6e309685177` },
            { id: "mm_pontianak_menjerit", name: "Pontianak Menjerit", poster: "https://i.postimg.cc/sxq9frqz/Pontianak-Menjerit.jpg", description: "Cerita bermula selepas kematian seorang jutawan, Datuk Pangeran Abdul Rahman, yang meninggalkan harta pusaka bernilai RM30 juta. Peguam arwah kemudian memanggil semua waris yang sah untuk berkumpul di sebuah banglo lama yang terletak di Fraser's Hill bagi sesi pembacaan wasiat. Peguam arwah, Encik Salleh, menyatakan syarat mutlak di dalam wasiat: Semua waris wajib tinggal bersama di dalam banglo terpencil tersebut selama 33 hari. Jika ada yang ingkar atau keluar, mereka akan hilang kelayakan untuk menerima bahagian harta tersebut.", url: `${STREAM_HOST}/dl/6adc2b979f12d6e309685178` },
            { id: "mm_congkak", name: "Congkak", poster: "https://i.postimg.cc/PxxN1gWN/congkak.jpg", description: "Berkisar tentang Kazman dan isterinya Sufiah bersama dua anak perempuan mereka, Ely dan Lisa, yang diganggu makhluk halus akibat menghuni sebuah banglo lama yang mempunyai kaitan dengan permainan tradisional congkak.", url: `${STREAM_HOST}/dl/6acbf8f16e979983cdce554e` },
            { id: "mm_damping_malam", name: "Damping Malam", poster: "https://i.postimg.cc/rsn7tvjT/Damping-Malam.jpg", description: "Berkisar tentang pasangan suami isteri, Wadi dan Ku Khalira, yang hidup mewah tetapi mengabaikan ajaran agama. Gangguan mistik bermula apabila anak mereka, Nuraiza, masuk ke sekolah asrama.", url: `${STREAM_HOST}/dl/6acbf8f36e979983cdce5550` },
            { id: "mm_dorm_melati", name: "Dorm Melati", poster: "https://i.postimg.cc/7hh7YCsm/dormmelati.jpg", description: "Mengisahkan lima sahabat—Adam, Zafira, Eddy, Raihana dan Carol—yang pergi ke kem Dorm Melati selepas tamat STPM untuk membongkar misteri roh Melati yang dikaitkan dengan kematian tragis", url: `${STREAM_HOST}/dl/6acbf8f26e979983cdce54f` },
            { id: "mm_flat_3a", name: "Flat 3A", poster: "https://i.postimg.cc/qqqnMtbZ/flat3a.jpg", description: "Filem ini mengisahkan Fiqah (lakonan Intan Ladyana), seorang pekerja kilang yang dihantui perasaan bersalah selepas membuang kandungan akibat dipaksa oleh teman lelakinya, Anas.", url: `${STREAM_HOST}/dl/6acbfc716e979983cdce5551` },
            { id: "mm_gudang_kubur", name: "Gudang Kubur", poster: "https://i.postimg.cc/wMMJTtf4/gudangkubur.jpg", description: "Filem ini mengisahkan pasangan suami isteri, Anwar (Faizal Hussein) dan Zarra (Nora Danish), yang diganggu makhluk halus selepas membeli sebuah gudang untuk perniagaan jubin tanpa menyedari ia dibina di atas tanah kubur", url: `${STREAM_HOST}/dl/6acbfc716e979983cdce5552` },
            { id: "mm_ia_wujud", name: "Ia Wujud", poster: "https://i.postimg.cc/yxx9YJQt/iawujud.jpg", description: "Ia mengisahkan lima orang pemuda yang bermalam di taman tema terbiar Mimaland untuk mencari bukti aktiviti ghaib melalui permainan spirit of the coin.", url: `${STREAM_HOST}/dl/6acbfc736e979983cdce5554` },
            { id: "mm_highland_tower", name: "Highland Tower", poster: "https://i.postimg.cc/tJJPC1Sf/highlandtower.jpg", description: "Filem Highland Tower (2013) ialah sebuah filem seram Malaysia arahan Pierre Andre yang menggunakan konsep found footage.Ceritanya berkisar tentang Shima, seorang pengacara TV yang meneroka tapak bekas tragedi runtuhan Highland Towers di Hulu Kelang untuk menghasilkan dokumentari paranormal, sebelum mengalami gangguan mistik.", url: `${STREAM_HOST}/dl/6acbfc736e979983cdce5553` },
            { id: "mm_jangan_pandang_belakang", name: "Jangan Pandang Belakang", poster: "https://i.postimg.cc/8ccWPFK2/janganpandangbelakang.gif", description: "Jangan Pandang Belakang ialah filem seram Malaysia 2007 arahan Ahmad Idham yang mengisahkan Darma (lakonan Pierre Andre) yang dihantui rasa bersalah dan gangguan mistik selepas kematian tunangnya, Rose (Intan Ladyana)", url: `${STREAM_HOST}/dl/6acbfc746e979983cdce5557` },
            { id: "mm_jalan_puncak_alam", name: "Jalan Puncak Alam", poster: "https://i.postimg.cc/WzzrbDWx/jalanpuncakalam.jpg", description: "Filem Jalan Puncak Alam (2015) ialah sebuah filem seram Malaysia arahan Dharma Aizat. Ia mengisahkan dua pelajar UiTM, Hanif dan Azizi, yang mengalami gangguan mistik dan seram ketika merentasi laluan gelap di Jalan Puncak Alam selepas motosikal Azizi kehabisan minyak.", url: `${STREAM_HOST}/dl/6acbfc736e979983cdce5556` },
            { id: "mm_jangan_tegur", name: "Jangan Tegur", poster: "https://i.postimg.cc/3NNpJyfM/jangantegur.jpg", description: "Filem Jangan Tegur (2009) ialah sebuah filem seram Malaysia arahan Pierre André. Ia mengisahkan Natasya yang koma akibat kemalangan dan mula dihantui mimpi wanita bernama Baizura, sehingga dia mampu melihat makhluk ghaib selepas sedar", url: `${STREAM_HOST}/dl/6acbfc756e979983cdce5558` },
            { id: "mm_jerit_malam", name: "Jerit Malam", poster: "https://i.postimg.cc/6qPZ79gM/jeritmalam.jpg", description: "Filem Jeritan Malam (2019) adalah sebuah filem seram Indonesia arahan Rocky Soraya, diadaptasi daripada thread popular di Kaskus.", url: `${STREAM_HOST}/dl/6acbfc766e979983cdce5559` },
            { id: "mm_keranda_tok_wan_terbang", name: "Keranda Tok Wan Terbang", poster: "https://i.postimg.cc/wMrNt6ZP/kerandatokwanterbang.jpg", description: "Keranda Tok Wan Terbang ialah sebuah filem komedi seram Malaysia tahun 2015 arahan Hashim Rejab. Ia mengisahkan kekecohan di sebuah kampung apabila salah faham berlaku yang mencetuskan khabar angin bahawa Tok Wan Terbang (penebar roti canai dan penggali kubur) sudah meninggal dunia dan kerandanya mencetuskan misteri lucu.", url: `${STREAM_HOST}/dl/6acbfc806e979983cdce555c` },
            { id: "mm_karak", name: "Karak", poster: "https://i.postimg.cc/D00syWpk/karak.jpg", description: "Filem Karak (2011) ialah sebuah filem seram fantasi Malaysia arahan Yusry Abd Halim terbitan KRU Studios. Ia mengisahkan empat pelajar kolej (Nik, Zura, Jack, dan Ida) yang terjebak dalam kesesakan lalu lintas di Lebuhraya Karak lalu memilih jalan persekutuan lama, di mana mereka diganggu pelbagai entiti menyeramkan.", url: `${STREAM_HOST}/dl/6acbfc7b6e979983cdce555a` },
            { id: "mm_kelibat", name: "Kelibat", poster: "https://i.postimg.cc/kGHSVnzj/kelibat.jpg", description: "Cerita ini mengisahkan tentang sebuah keluarga yang berhijrah ke sebuah rumah banglo terpencil untuk memulakan hidup baharu dan melarikan diri daripada bebanan hutang. Bagaimanapun, kehidupan mereka bertukar menjadi ngeri apabila mereka mula diganggu oleh entiti misteri dan kelibat yang menakutkan di dalam rumah tersebut. Gangguan itu bukan sahaja menguji keberanian mereka, malah mendedahkan konflik dan rahsia hitam yang terpendam dalam keluarga mereka sendiri.", url: `${STREAM_HOST}/dl/6acbfc7b6e979983cdce55bb` },
            { id: "mm_malam_tahlil_suhaila_balik", name: "Malam Tahlil Suhaila Balik", poster: "https://i.postimg.cc/yxGRJVtp/malamtahlilsuhailabalik.jpg", description: "Cerita ini mengisahkan seorang suami bernama Qayyum yang berdepan dengan kejadian misteri apabila mayat isterinya, Suhaila, tiba-tiba muncul dan kembali ke rumah pada salah satu malam majlis tahlil.", url: `${STREAM_HOST}/dl/6acbfdfc6e979983cdce555d` },
            { id: "mm_misteri_jalan_lama", name: "Misteri Jalan Lama", poster: "https://i.postimg.cc/HnNMJpFC/misterijalanlama.jpg", description: "Misteri Jalan Lama ialah sebuah filem aksi fantasi neo-noir Malaysia tahun 2011 arahan Afdlin Shauki yang mengisahkan dua beradik, Indra (Hans Isaac) dan Ilya (Que Haidar), yang berseteru selama 15 tahun sebelum terpaksa bersatu kembali selepas kematian bapa mereka, Iskandar (Ahmad Tamimi Siregar).", url: `${STREAM_HOST}/dl/6acc05d16e979983cdce55c3` },
            { id: "mm_momok_2", name: "Momok 2", poster: "https://i.postimg.cc/gj7hwY1b/momok2.jpg", description: "Ia mengisahkan sekumpulan pelajar kolej yang mendapat tugasan membuat kajian kisah hantu di Kampung Telok Gong daripada Tok Hamdan dan Nek Pah.", url: `${STREAM_HOST}/dl/6acc05d16e979983cdce55c4` },
            { id: "mm_minyak_dagu", name: "Minyak Dagu", poster: "https://i.postimg.cc/qqFKtkWV/minyakdagu-jpg.jpg", description: "Ia mengisahkan dendam seorang pemuda bernama Azman yang menggunakan ilmu hitam dan minyak dagu daripada seorang bomoh kerana patah hati apabila tunangannya, Emelda, memilih lelaki lain.", url: `${STREAM_HOST}/dl/6acc05d36e979983cdce55c7` },
            { id: "mm_mantra", name: "Mantra", poster: "https://i.postimg.cc/J0FXy1Sw/mantra.jpg", description: "Ia mengisahkan Muzir (Zul Handy Black) yang dianiaya sahabatnya, Hasbi (Hasnul Rahmat), sehingga dipenjarakan. Di penjara, Muzir menuntut ilmu hitam daripada seorang tahanan demi menuntut bela atas dendamnya.", url: `${STREAM_HOST}/dl/6acc05d26e979983cdce55c6` },
            { id: "mm_momok_3", name: "Momok 3", poster: "https://i.postimg.cc/gj7hwY1W/momok3.jpg", description: "Momok 3 (2003) ialah sebuah telefilem seram Malaysia arahan Rosli Rahman Adam yang memuatkan tiga kisah seram berasingan: Dendam Maisarah, Penunggu Pusaka, dan Roh Jelmaan", url: `${STREAM_HOST}/dl/6acc05d56e979983cdce55c8` },
            { id: "mm_momok_the_movie", name: "Momok The Movie", poster: "https://i.postimg.cc/8cYvF1xT/momokthemovie.jpg", description: "Momok (telefilem 2000) atau versi lanjutannya Momok The Movie ialah sebuah karya seram tempatan arahan M. Jamil yang menggabungkan beberapa kisah hantu rakyat Malaysia dengan selingan komedi ringan.", url: `${STREAM_HOST}/dl/6acc05da6e979983cdce55c9` },
            { id: "mm_nasi_tangas", name: "Nasi Tangas", poster: "https://i.postimg.cc/qqFKtkW4/nasitangas.jpg", description: "Cerita ini berkisar tentang Hairi dan sahabat baiknya, Fatin, yang bersama-sama mengusahakan sebuah restoran yang cukup maju", url: `${STREAM_HOST}/dl/6acc06936e979983cdce55ca` },
            { id: "mm_paku", name: "Paku", poster: "https://i.postimg.cc/WzyZD2xN/paku.jpg", description: "Filem ini mengisahkan tentang Fahmi yang amat mencintai isterinya, Riana. Kehidupan mereka yang bahagia bersama anak perempuan mereka berkecai apabila Riana meninggal dunia akibat tragedi runtuhan bangunan apartment. Kerana perasaan cinta yang terlalu taksub dan ketidakupayaan untuk menerima kenyataan, Fahmi sanggup melanggar hukum agama dengan mencari seorang bomoh untuk menghidupkan semula Riana menggunakan kaedah ilmu paku pontianak.", url: `${STREAM_HOST}/dl/6acc074d6e979983cdce55cc` },
            { id: "mm_paya_hitam", name: "Paya Hitam", poster: "https://i.postimg.cc/d3fC7qgt/payahitam.jpg", description: "Kisah ini mengisahkan tentang hubungan dua beradik yang dihantui oleh sejarah silam yang hitam. Pengembaraan misteri ini bermula apabila watak utama, Jaja, menyambut ulang tahun kelahirannya yang ke-30. Sejak hari tersebut, dia mula didatangi dan diganggu oleh satu entiti misteri yang berniat untuk meragut nyawanya.", url: `${STREAM_HOST}/dl/6acc074d6e979983cdce55cd` },
            { id: "mm_santau", name: "Santau", poster: "https://i.postimg.cc/KjWTKZCj/santau.jpg", description: "Kehidupan mereka mula berubah menjadi kucar-kacir apabila Aliya mengalami penyakit misteri yang pelik. Hubungan intim suami isteri mula menjadi hambar, dan Aliya sering berkelakuan aneh serta agresif. Keadaan menjadi lebih parah apabila Aliya mula memuntahkan benda-benda kotor seperti rambut, paku, dan kaca, yang merupakan tanda-tanda jelas dia telah terkena santau.", url: `${STREAM_HOST}/dl/6acc13f16e979983cdce55d0` },
            { id: "mm_pelepas_saka", name: "Pelepas Saka", poster: "https://i.postimg.cc/Y0PF4pTC/pelepassaka.jpg", description: "Misteri bermula apabila seorang wanita tua di kampung tersebut bernama Asiah (Nor Albaniah) sedang mencari tuan baharu untuk melepaskan saka belaannya. Disebabkan Asiah tidak mempunyai zuriat atau keturunan untuk mewarisi entiti tersebut, dia terdesak untuk mencari pengganti. Pada malam kenduri sedang berlangsung, Asiah secara rahsia telah melakukan upacara mistik dan melepaskan sakanya kepada Haider. Selepas upacara itu selesai, fizikal Asiah berubah menjadi sangat tua serta membongkok, dan dia terus menghilangkan diri.", url: `${STREAM_HOST}/dl/6acc13f16e979983cdce55cf` },
            { id: "mm_polong", name: "Polong", poster: "https://i.postimg.cc/C528ZF9K/polong.jpg", description: "Kisah bermula dengan Maria Hadi (lakonan June Lojong), seorang wanita yang hidup dengan amalan ilmu hitam dan menyimpan pelbagai dosa silam. Menjelang penghujung hayatnya, Maria cuba mencari keampunan dan bertaubat atas perbuatannya.", url: `${STREAM_HOST}/dl/6acc13f16e979983cdce55d2` },
            { id: "mm_titisan_setan", name: "Titisan Setan", poster: "https://i.postimg.cc/59KLK3yS/titisansetan.jpg", description: "Cerita bermula apabila seorang gadis bernama Melissa (lakonan Wendy Wilson) ingin meluangkan masa pada hujung minggu bersama kekasihnya, Bara (lakonan Baim Wong). Melissa, yang selama ini dibesarkan oleh neneknya dengan disiplin yang ketat, terpaksa berbohong kepada neneknya demi mendapatkan izin untuk keluar. Dia memberi alasan kononnya mahu melawat ibu kepada sahabatnya, Gaby, yang sedang sakit.", url: `${STREAM_HOST}/dl/6acc66136e979983cdce55d7` },
            { id: "mm_sumpahan_kum_kum", name: "Sumpahan Kum-Kum", poster: "https://i.postimg.cc/jq3P3X2Q/sumpahankumkum.jpg", description: "Filem ini mengisahkan tentang Mila (lakonan Shima Anuar), seorang gadis yang mengalami masalah jerawat yang serius dan berasa amat malu serta tertekan dengan penampilan fizikalnya. Demi mendapatkan wajah yang jelita, dia telah pergi menemui seorang dukun kampung bernama Mak Tom (lakonan Lydiawati) untuk memakai susuk.", url: `${STREAM_HOST}/dl/6acc66136e979983cdce55d3` },
            { id: "mm_volkswagen_kuning", name: "Volkswagen Kuning", poster: "https://i.postimg.cc/KcpBpNjJ/volkswagenkuning.jpg", description: "Filem ini mengisahkan sepasang kekasih yang telah pun bertunang, Fuad (lakonan Pekin Ibrahim) dan Sarah (lakonan Atikah Suhaime), yang dalam perjalanan pulang ke kampung halaman Fuad. Di tengah perjalanan, Fuad bercadang untuk singgah makan di sebuah kedai makan yang terkenal dengan hidangan ikan patin. Oleh kerana tidak biasa dengan jalan tersebut, mereka menggunakan aplikasi navigasi Waze, namun akhirnya tersesat selepas senja akibat kehilangan capaian internet.", url: `${STREAM_HOST}/dl/6acc66136e979983cdce55d4` }
        ]
    },
    "animation_movies_catalog": {
        id: "animation_movies_catalog",
        isMulti: true,
        items: [ 
            { id: "am_dragonball_legend_of_shenren", name: "Dragonball Legend Of Shenren", poster: "https://i.postimg.cc/kMNcZ9cH/Dragonball-Legend-Of-Shenren-DP.jpg", background : "https://i.postimg.cc/FFbZqmZw/Dragonball-Legend-Of-Shenren-WP.jpg", url: `${STREAM_HOST}/dl/6accb1486e979983cdce5a79` },
            { id: "am_tenku_no_shiro_laputa", name: "Castle In The Sky (Tenku no Shiro Laputa)", poster: "https://i.postimg.cc/J73qgmq2/Tenku-no-Shiro-Laputa-DP.jpg", background : "https://i.postimg.cc/SQLr5qrV/Tenku-no-Shiro-Laputa-WP.jpg", url: `${STREAM_HOST}/dl/6ade607b6e979983cdce61eb` },
            { id: "am_hello_world", name: "Hello World", poster: "https://i.postimg.cc/66V0Sw0M/Hello-World-DP.jpg", background : "https://i.postimg.cc/XNK8h382/Hello-World-WP.jpg", url: `${STREAM_HOST}/dl/6ade60a76e979983cdce61ee` },
            { id: "am_blue_sky", name: "Blue Sky", poster: "https://i.postimg.cc/Y0xzmf0F/Blue-Sky-DP.jpg", background : "https://i.postimg.cc/j2h4JQ2W/Blue-Sky-WP.jpg", url: `${STREAM_HOST}/dl/6ade60ac6e979983cdce61f0` },
            { id: "am_chibi_maruko_chan_ono_and_sugiyama", name: "Chibi Maruko Chan - Ono and Sugiyama", poster: "https://i.postimg.cc/SRGfz7RJ/Chibi-Maruko-Chan-Ono-and-Sugiyama-DP.jpg", background : "https://i.postimg.cc/SRGfz7Rx/Chibi-Maruko-Chan-Ono-and-Sugiyama-WP.jpg", url: `${STREAM_HOST}/dl/6accafdb6e979983cdce5a76` },
            { id: "am_kimi_no_na_wa_your_name", name: "Kimi no Na wa (Your Name)", poster: "https://i.postimg.cc/vTvt6LTQ/Kimi-no-Na-wa-(Your-Name)-DP.jpg", background : "https://i.postimg.cc/prBJnYrX/Kimi-no-Na-wa-(Your-Name)-WP.jpg", url: `${STREAM_HOST}/dl/6ade607b6e979983cdce61ec` },
            { id: "am_pokemon_the_movie_kyurem_vs_the_sword_of_justice", name: "Pokemon the Movie - Kyurem vs. The Sword of Justice", poster: "https://i.postimg.cc/BbCB1cbS/Pokemon-the-Movie-Kyurem-vs-The-Sword-of-Justice-DP.jpg", background : "https://i.postimg.cc/4y1Qhbyn/Pokemon-the-Movie-Kyurem-vs-The-Sword-of-Justice-WP.png", url: `${STREAM_HOST}/dl/6ade60a76e979983cdce61ef` },
            { id: "am_koe_no_katachi_a_silent_voice", name: "Koe No Katachi (A Silent Voice)", poster: "https://i.postimg.cc/vTvt6LTR/Koe-No-Katachi-(A-Silent-Voice)-DP.jpg", background : "https://i.postimg.cc/RhmTFbSS/Koe-No-Katachi-(A-Silent-Voice)-WP.webp", url: `${STREAM_HOST}/dl/6ade60816e979983cdce61ed` },
            { id: "am_sing_2016", name: "Sing", poster: "https://i.postimg.cc/nLrfPXZZ/Sing-2016-DP.jpg", background: "https://i.postimg.cc/0Nj1Bzxg/Sing-2016-WP.jpg", url: `${STREAM_HOST}/dl/6ae912d66e979983cdce68b6` },
            { id: "am_sing_2_2021", name: "Sing 2", poster: "https://i.postimg.cc/HLn1hrH1/Sing-2021-DP.jpg", background: "https://i.postimg.cc/7Zmy93vZ/Sing-2021-WP.jpg", url: `${STREAM_HOST}/dl/6ae912566e979983cdce68b5` },
            { id: "am_home_2015", name: "Home", poster: "https://i.postimg.cc/3xnH1XMJ/Home-2015-DP.jpg", background: "https://i.postimg.cc/K8JyfPXZ/Home-2015-WP.jpg", url: `${STREAM_HOST}/dl/6ae918416e979983cdce68c0` },
            { id: "am_the_super_mario_bros_2023", name: "The Super Mario Bros", poster: "https://i.postimg.cc/DwBK6rVn/The-Super-Mario-Bros-DP.jpg", background: "https://i.postimg.cc/DwBK6rVv/The-Super-Mario-Bros-WP.jpg", url: `${STREAM_HOST}/dl/6ae913926e979983cdce68b7` },
            { id: "am_trolls_band_together_2023", name: "Trolls Band Together", poster: "https://i.postimg.cc/BnMGpTW9/Trolls-Band-Together-2023-DP.jpg", background: "https://i.postimg.cc/pLqtCfNM/Trolls-Band-Together-2023-WP.webp", url: `${STREAM_HOST}/dl/6ae9142f6e979983cdce68b8` },
            { id: "am_kung_fu_panda_2008", name: "Kung Fu Panda", poster: "https://i.postimg.cc/rwQLj16L/Kung-Fu-Panda-1-DP.jpg", background: "https://i.postimg.cc/6pYNcrsX/Kung-Fu-Panda-1-WP.jpg", url: `${STREAM_HOST}/dl/6ae916146e979983cdce68bc` },
            { id: "am_kung_fu_panda_2_2011", name: "Kung Fu Panda 2", poster: "https://i.postimg.cc/52nMgwhZ/Kung-Fu-Panda-2-DP.jpg", background: "https://i.postimg.cc/2S2fG4sg/Kung-Fu-Panda-2-WP.jpg", url: `${STREAM_HOST}/dl/6ae915a06e979983cdce68bb` },
            { id: "am_kung_fu_panda_3_2016", name: "Kung Fu Panda 3", poster: "https://i.postimg.cc/pLqtCDw4/Kung-Fu-Panda-3-DP.jpg", background: "https://i.postimg.cc/zG017nsQ/Kung-Fu-Panda-3-WP.jpg", url: `${STREAM_HOST}/dl/6ae915436e979983cdce68ba` },
            { id: "am_kung_fu_panda_4_2024", name: "Kung Fu Panda 4", poster: "https://i.postimg.cc/htpqs9k5/Kung-Fu-Panda-4-DP.png", background: "https://i.postimg.cc/W1XP8MBY/Kung-Fu-Panda-4-WP.jpg", url: `${STREAM_HOST}/dl/6ae914a66e979983cdce68b9` },
            { id: "am_the_boss_baby_2017", name: "The Boss Baby", poster: "https://i.postimg.cc/wj0d2hCb/The-Boss-Baby-2017-DP.jpg", background: "https://i.postimg.cc/qvjdw8PG/The-Boss-Baby-2017-WP.webp", url: `${STREAM_HOST}/dl/6ae916996e979983cdce68bd` },
            { id: "am_madagascar_2005", name: "Madagascar", poster: "https://i.postimg.cc/XYQ0LwR8/Madagascar-2005-DP.webp", background: "https://i.postimg.cc/8ztV4h2B/Madagascar-2005-WP.jpg", url: `${STREAM_HOST}/dl/6ae917566e979983cdce68be` },
            { id: "am_madagascar_2_escape_2_africa_2008", name: "Madagascar 2 - Escape 2 Africa", poster: "https://i.postimg.cc/kgnmWjpp/Madagascar-2-Escape-2-Africa-DP.jpg", background: "https://i.postimg.cc/P52kymgQ/Madagascar-2-Escape-2-Africa-WP.jpg", url: `${STREAM_HOST}/dl/6ae917d16e979983cdce68bf` },
            { id: "am_penguins_of_madagascar_2014", name: "Penguins of Madagascar", poster: "https://i.postimg.cc/8ctb9zT1/Penguins-of-Madagascar-DP.jpg", background: "https://i.postimg.cc/d349pVJs/Penguins-of-Madagascar-WP.jpg", url: `${STREAM_HOST}/dl/6ae918526e979983cdce68c1` },
            { id: "am_the_secret_of_nimh_1982", name: "The Secret of NIMH", poster: "https://i.postimg.cc/CxFgbvQr/The-Secret-of-NIMH-1982-DP.jpg", background: "https://i.postimg.cc/y8VH0fbj/The-Secret-of-NIMH-1982-WP.jpg", url: `${STREAM_HOST}/dl/6ae936560cbaec6d50639bb5` },
            { id: "am_the_secret_of_nimh_2_timmy_to_the_rescue_1998", name: "The Secret of NIMH 2: Timmy to the Rescue", poster: "https://i.postimg.cc/Z5TS6fMw/The-Secret-of-NIMH-1998-DP.jpg", background: "https://i.postimg.cc/52xV8PR3/The-Secret-of-NIMH-1998-WP.jpg", url: `${STREAM_HOST}/dl/6ae936b40cbaec6d50639bb6` },
            { id: "am_all_dogs_go_to_heaven_1989", name: "All Dogs Go to Heaven", poster: "https://i.postimg.cc/Bnq02hVC/All-Dogs-Go-to-Heaven-1989-DP.jpg", background: "https://i.postimg.cc/GmcCvM5P/All-Dogs-Go-to-Heaven-1989-WP.jpg", url: `${STREAM_HOST}/dl/6ae937ca0cbaec6d50639bb8` },
            { id: "am_all_dogs_go_to_heaven_2_1996", name: "All Dogs Go to Heaven 2", poster: "https://i.postimg.cc/rw8k5hPN/All-Dogs-Go-to-Heaven-1996-DP.jpg", background: "https://i.postimg.cc/XYVb92zd/All-Dogs-Go-to-Heaven-1996-WP.webp", url: `${STREAM_HOST}/dl/6ae9375a0cbaec6d50639bb7` },
            { id: "am_shrek_2001", name: "Shrek", poster: "https://i.postimg.cc/jjjBXc7Y/Shrek-2001-DP.jpg" , background : "https://i.postimg.cc/q77WLw3V/Shrek-WP.jpg", url: `${STREAM_HOST}/dl/6ae724e26e979983cdce67e9` },
            { id: "am_shrek_2_2004", name: "Shrek 2", poster: "https://i.postimg.cc/Gpp6QKy0/Shrek-2004-DP.jpg" , background : "https://i.postimg.cc/LssGTDZw/Shrek-2004-WP.jpg", url: `${STREAM_HOST}/dl/6ae724eb6e979983cdce67ea` },
            { id: "am_shrek_the_third_2007", name: "Shrek the Third", poster: "https://i.postimg.cc/9ffspbqv/Shrek-2007-DP.jpg" , background : "https://i.postimg.cc/yNN2PjS5/Shrek-2007-WP.jpg", url: `${STREAM_HOST}/dl/6ae724f06e979983cdce67eb` },
            { id: "am_shrek_forever_after_2010", name: "Shrek Forever After", poster: "https://i.postimg.cc/q77WLwCZ/Shrek-2010-DP.jpg" , background : "https://i.postimg.cc/7LLjV9TR/Shrek-2010-WP.jpg", url: `${STREAM_HOST}/dl/6ae724f66e979983cdce67ec` },
            { id: "am_puss_in_boots_2011", name: "Puss In Boots", poster: "https://i.postimg.cc/jjjBXcJF/Puss-In-Boots-2011-DP.webp" , background : "https://i.postimg.cc/zff4j7Rx/Puss-In-Boots-2011-WP.webp", url: `${STREAM_HOST}/dl/6ae7265b6e979983cdce67f2` },
            { id: "am_puss_in_boots_the_last_wish_2022", name: "Puss in Boots The Last Wish", poster: "https://i.postimg.cc/Xvvt8Ly1/Puss-In-Boots-2022-DP.jpg" , background : "https://i.postimg.cc/mrrKwjFV/Puss-In-Boots-2022-WP.jpg", url: `${STREAM_HOST}/dl/6ae726636e979983cdce67f4` },
            { id: "am_frozen_2013", name: "Frozen", poster: "https://i.postimg.cc/XYLTdmX1/Frozen-2013-DP.jpg" , background : "https://i.postimg.cc/zG79K63x/Frozen-2013-WP.jpg", url: `${STREAM_HOST}/dl/6ae733266e979983cdce67f6` },
            { id: "am_frozen_ii_2019", name: "Frozen II", poster: "https://i.postimg.cc/nLLNk2QK/Frozen-2019-DP.webp" , background : "https://i.postimg.cc/4xPrVqnF/Frozen-2019-WP.jpg", url: `${STREAM_HOST}/dl/6ae733636e979983cdce67f8` },
            { id: "am_the_grinch_2018", name: "The Grinch", poster: "https://i.postimg.cc/mgj0CJhd/The-Grinch-2018-DP.jpg" , background : "https://i.postimg.cc/Dw6tLHmd/The-Grinch-2018-WP.jpg", url: `${STREAM_HOST}/dl/6ae7352d6e979983cdce67f9` },
            { id: "am_luck_2022", name: "Luck (2022)", poster: "https://i.postimg.cc/htsHT6hV/Luck-2022-DP.jpg" , background : "https://i.postimg.cc/XYLTdmXk/Luck-2022-WP.png", url: `${STREAM_HOST}/dl/6ae7376e6e979983cdce67fc` },
            { id: "am_spirited_away_2001", name: "Spirited Away", poster: "https://i.postimg.cc/L8DrLwhV/Spirited-Away-DP.jpg" , background : "https://i.postimg.cc/qvw9ySg8/Spirited-Away-WP.jpg", url: `${STREAM_HOST}/dl/6ae7385f6e979983cdce67fd` },
            { id: "am_gintama_yoshiwara_in_flames", name: "Gintama Yoshiwara in Flames", poster: "https://i.postimg.cc/vHJ9TNvW/Gintama-Yoshiwara-in-Flames-DP.jpg" , background : "https://i.postimg.cc/fTGXyrvX/Gintama-Yoshiwara-in-Flames-WP.jpg", url: `${STREAM_HOST}/dl/6ae5358b6e979983cdce6746` },
            { id: "am_lilo_and_stitch1", name: "Lilo and Stitch 2002", poster: "https://i.postimg.cc/GtVnjr58/Lilo-Stitch-DP-2002.jpg" , background : "https://i.postimg.cc/RCLdyfwb/Lilo-and-Stitch-2002-WP.jpg", url: `${STREAM_HOST}/dl/6ae518256e979983cdce66af` },
            { id: "am_lilo_and_stitch2", name: "Lilo and Stitch 2005", poster: "https://i.postimg.cc/0jF1CxBb/Lilo-Stitch-2-DP-2005.jpg" , background : "https://i.postimg.cc/SQfd38c5/Lilo-and-Stitch-2005-WP.jpg", url: `${STREAM_HOST}/dl/6ae654da3a36aa61a17a7a9f` },
            { id: "am_sleeping_beauty", name: "Sleeping Beauty 1959", poster: "https://i.postimg.cc/1X21KPjm/Sleeping-Beauty-1959-DP.png" , background : "https://i.postimg.cc/59SgTv8g/Sleeping-Beauty-1959-WP.webp", url: `${STREAM_HOST}/dl/6ae532326e979983cdce66b1` },
            { id: "am_the_little_mermaid1", name: "The Little Mermaid 1989", poster: "https://i.postimg.cc/Zn2zLZMm/The-Little-Mermaid-1989-DP.jpg" , background : "https://i.postimg.cc/y6yjt90h/The-Little-Mermaid-1989-WP.jpg", url: `${STREAM_HOST}/dl/6ae532366e979983cdce66b8` },
            { id: "am_the_little_mermaid2", name: "The Little Mermaid 2000", poster: "https://i.postimg.cc/3NVQZ7cY/The-Little-Mermaid-2-2000-DP.jpg" , background : "https://i.postimg.cc/y6yjt90F/The-Little-Mermaid-2000-WP.jpg", url: `${STREAM_HOST}/dl/6ae658d357a1c542c414ba82` },
            { id: "am_the_little_mermaid3", name: "The Little Mermaid 2008", poster: "https://i.postimg.cc/zv6Yk5c1/The-Little-Mermaid-2008-DP.jpg" , background : "https://i.postimg.cc/HW9zR5bX/The-Little-Mermaid-2008-WP.webp", url: `${STREAM_HOST}/dl/6ae6591257a1c542c414ba83` },
            { id: "am_cinderella1", name: "Cinderella 1950", poster: "https://i.postimg.cc/ZnCh30j2/Cinderella-1950-DP.webp" , background : "https://i.postimg.cc/9XYbKTy4/Cinderella-1950-WP.webp", url: `${STREAM_HOST}/dl/6ae532326e979983cdce66b3` },
            { id: "am_cinderella2", name: "Cinderella 2002", poster: "https://i.postimg.cc/cCrNY6XN/Cinderella-2-2002-DP.jpg" , background : "https://i.postimg.cc/kMvsz8WR/Cinderella-2002-WP.webp", url: `${STREAM_HOST}/dl/6ae65b906e979983cdce6758` },
            { id: "am_cinderella3", name: "Cinderella 2007", poster: "https://i.postimg.cc/D0H3cFM3/Cinderella-3-2007-DP.webp" , background : "https://i.postimg.cc/FzpxS59F/Cinderella-2007-WP.jpg", url: `${STREAM_HOST}/dl/6ae65cb1f19a3ee0ff532001` },
            { id: "am_moana1", name: "Moana 2016", poster: "https://i.postimg.cc/nrCt7MTT/Moana-2016-DP.jpg" , background : "https://i.postimg.cc/5ygmzdxf/Moana-2016-WP.webp", url: `${STREAM_HOST}/dl/6ae532bb6e979983cdce66d0` },
            { id: "am_moana2", name: "Moana 2024", poster: "https://i.postimg.cc/J0GWJtK2/Moana-2-2024-DP.jpg" , background : "https://i.postimg.cc/cChc3ysS/Moana-2024-WP.jpg", url: `${STREAM_HOST}/dl/6ae65f14f19a3ee0ff532006` },
            { id: "am_how_to_train_your_dragon1", name: "How to Train Your Dragon 2010", poster: "https://i.postimg.cc/brsjbdLR/How-To-Train-Your-Dragon-2010-DP.jpg" , background : "https://i.postimg.cc/x85PmD97/How-to-Train-Your-Dragon-2010-WP.jpg", url: `${STREAM_HOST}/dl/6ae532bf6e979983cdce66d2` },
            { id: "am_how_to_train_your_dragon2", name: "How to Train Your Dragon 2014", poster: "https://i.postimg.cc/26HDVnd9/How-To-Train-Your-Dragon-2014-DP.webp" , background : "https://i.postimg.cc/FzpxS59t/How-to-Train-Your-Dragon-2014-WP.jpg", url: `${STREAM_HOST}/dl/6ae66186dce7f9a73628491b` },
            { id: "am_how_to_train_your_dragon3", name: "How to Train Your Dragon 2018", poster: "https://i.postimg.cc/3RLTd2j6/How-To-Train-Your-Dragon-2018-DP.jpg" , background : "https://i.postimg.cc/hvs0mWSR/How-to-Train-Your-Dragon-2018-WP.jpg", url: `${STREAM_HOST}/dl/6ae6633adce7f9a73628491e` },
            { id: "am_the_addams_family3", name: "The Addams Family 2019", poster: "https://i.postimg.cc/tTzMTyjm/Addams-Family-2019-DP.jpg" , background : "", url: `${STREAM_HOST}/dl/6ae532f56e979983cdce66d7` },
            { id: "am_cinnamonroll_movie", name: "Cinnamoroll The Movie", poster: "https://i.postimg.cc/T1GKmkQw/cinamon.jpg" , url: `${STREAM_HOST}/dl/6ae4053f6e979983cdce665f` },
            { id: "am_bilal_2015", name: "Bilal 2015", poster: "https://i.postimg.cc/kG928jwD/Bilal.jpg" , url: `${STREAM_HOST}/dl/6ae4053f6e979983cdce6660` },
            { id: "am_spirited_away", name: "Spirited Away", poster: "https://i.postimg.cc/Qxp4kVbb/Spirited-Away-DP.jpg", url: `${STREAM_HOST}/dl/6ae3f22a6e979983cdce6657` },
            { id: "am_detective_conan_movie_2000", name: "Detective Conan Movie 2000", poster: "https://i.postimg.cc/mgYYKLwf/DC-Movie-2000.jpg", url: `${STREAM_HOST}/dl/6ae275f7540439e8c1174662` },
            { id: "am_detective_conan_movie_2001", name: "Detective Conan Movie 2001", poster: "https://i.postimg.cc/x1vvBfRr/DC-Movie-2001.jpg", url: `${STREAM_HOST}/dl/6ae273d2540439e8c1174654` },
            { id: "am_detective_conan_movie_2002", name: "Detective Conan Movie 2002", poster: "https://i.postimg.cc/K8PPCG5d/DC-Movie-2002.jpg", url: `${STREAM_HOST}/dl/6ae273e0540439e8c1174655` },
            { id: "am_detective_conan_movie_2003", name: "Detective Conan Movie 2003", poster: "https://i.postimg.cc/HkwwFYtq/DC-Movie-2003.jpg", url: `${STREAM_HOST}/dl/6ae273e9540439e8c1174656` },
            { id: "am_detective_conan_movie_2004", name: "Detective Conan Movie 2004", poster: "https://i.postimg.cc/t4338qzw/DC-Movie-2004.jpg", url: `${STREAM_HOST}/dl/6ae273ef540439e8c1174657` },
            { id: "am_detective_conan_movie_2005", name: "Detective Conan Movie 2005", poster: "https://i.postimg.cc/L8ttG9VW/DC-Movie-2005.jpg", url: `${STREAM_HOST}/dl/6ae273f9540439e8c1174658` },
            { id: "am_detective_conan_movie_2006", name: "Detective Conan Movie 2006", poster: "https://i.postimg.cc/2SQQgkxJ/DC-Movie-2006.jpg", url: `${STREAM_HOST}/dl/6ae27402540439e8c1174659` },
            { id: "am_detective_conan_movie_2007", name: "Detective Conan Movie 2007", poster: "https://i.postimg.cc/DwrrRvcR/DC-Movie-2007.jpg", url: `${STREAM_HOST}/dl/6ae2741a540439e8c117465a` },
            { id: "am_detective_conan_movie_2008", name: "Detective Conan Movie 2008", poster: "https://i.postimg.cc/Z588XbLs/DC-Movie-2008.jpg", url: `${STREAM_HOST}/dl/6ae27420540439e8c117465b` },
            { id: "am_detective_conan_movie_2009", name: "Detective Conan Movie 2009", poster: "https://i.postimg.cc/YC66Trxn/DC-Movie-2009.jpg", url: `${STREAM_HOST}/dl/6ae27425540439e8c117465c` },
            { id: "am_detective_conan_movie_2010", name: "Detective Conan Movie 2010", poster: "https://i.postimg.cc/Vkqq2fF7/DC-Movie-2010.jpg", url: `${STREAM_HOST}/dl/6ae2742c540439e8c117465d` },
            { id: "am_detective_conan_movie_2011", name: "Detective Conan Movie 2011", poster: "https://i.postimg.cc/4x66jf1W/DC-Movie-2011.jpg", url: `${STREAM_HOST}/dl/6ae27434540439e8c117465e` },
            { id: "am_detective_conan_movie_2012", name: "Detective Conan Movie 2012", poster: "https://i.postimg.cc/3xXXz8Z9/DC-Movie-2012.jpg", url: `${STREAM_HOST}/dl/6ae27438540439e8c117465f` },
            { id: "am_detective_conan_movie_2013", name: "Detective Conan Movie 2013", poster: "https://i.postimg.cc/6prrFWhc/DC-Movie-2013.jpg", url: `${STREAM_HOST}/dl/6ae275e1540439e8c1174660` },
            { id: "am_detective_conan_movie_2014", name: "Detective Conan Movie 2014", poster: "https://i.postimg.cc/Mp20sM1h/DC-Movie-2014.jpg", url: `${STREAM_HOST}/dl/6ae275e8540439e8c1174661` },
            { id: "am_detective_conan_movie_2015", name: "Detective Conan Movie 2015", poster: "https://i.postimg.cc/8zQdyJLx/DC-Movie-2015.jpg", url: `${STREAM_HOST}/dl/6ae2762d540439e8c1174663` },
            { id: "am_detective_conan_movie_2016", name: "Detective Conan Movie 2016", poster: "https://i.postimg.cc/W1Lm9F0y/DC-Movie-2016.jpg", url: `${STREAM_HOST}/dl/6ae27633540439e8c1174664` },
            { id: "am_detective_conan_movie_2017", name: "Detective Conan Movie 2017", poster: "https://i.postimg.cc/wj85WyDZ/DC-Movie-2017.jpg", url: `${STREAM_HOST}/dl/6ae27638540439e8c1174665` },
            { id: "am_detective_conan_movie_2018", name: "Detective Conan Movie 2018", poster: "https://i.postimg.cc/cLy7Dgf9/DC-Movie-2018.jpg", url: `${STREAM_HOST}/dl/6ae27642540439e8c1174666` },
            { id: "am_detective_conan_movie_2019", name: "Detective Conan Movie 2019", poster: "https://i.postimg.cc/L8KkyYjx/DC-Movie-2019.jpg", url: `${STREAM_HOST}/dl/6ae2764a540439e8c1174667` },
            { id: "am_detective_conan_movie_2021", name: "Detective Conan Movie 2021", poster: "https://i.postimg.cc/DwkQCJ1P/DC-Movie-2021.jpg", url: `${STREAM_HOST}/dl/6ae2765d540439e8c1174669` },
            { id: "am_detective_conan_movie_2022", name: "Detective Conan Movie 2022", poster: "https://i.postimg.cc/t4QdrZF2/DC-Movie-2022.jpg", url: `${STREAM_HOST}/dl/6ae276c06e979983cdce646e` },
            { id: "am_detective_conan_movie_2023", name: "Detective Conan Movie 2023", poster: "https://i.postimg.cc/QdGg69cb/DC-Movie-2023.jpg", url: `${STREAM_HOST}/dl/6ae27657540439e8c1174668` },
            { id: "am_detective_conan_movie_2024", name: "Detective Conan Movie 2024", poster: "https://i.postimg.cc/2SRdHbn9/DC-Movie-2024.jpg", url: `${STREAM_HOST}/dl/6ae276ea6e979983cdce646f` },
            { id: "am_crayon_shinchan_roar_kasukabe_animal_kingdom", name: "Crayon Shinchan Roar! Kasukabe Animal Kingdom", poster: "https://i.postimg.cc/3NSJXd0m/Crayon-Shinchan-Roar-Kasukabe-Animal-Kingdom.jpg", url: `${STREAM_HOST}/dl/6ae3272dd617963c181912df` },
            { id: "am_crayon_shinchan_serious_battle_robot_dad_strikes_back", name: "Crayon Shinchan Serious Battle! Robot Dad Strikes Back", poster: "https://i.postimg.cc/gjSkVnL3/Crayon-Shinchan-Serious-Battle-Robot-Dad-Strikes-Back-DP.jpg", url: `${STREAM_HOST}/dl/6ae3272dd617963c181912de` },
            { id: "am_crayon_shinchan_super_dimension_the_storm_called_my_bride", name: "Crayon Shinchan Super Dimension! The Storm Called My Bride", poster: "https://i.postimg.cc/kG1XQBRt/Crayon-Shinchan-Super-Dimension-The-Storm-Called-My-Bride.jpg", url: `${STREAM_HOST}/dl/6ae325ce6e979983cdce64d3` },
            { id: "am_crayon_shinchan_the_legend_called_buri_buri_3_minutes_charge", name: "Crayon Shinchan The Legend Called Buri Buri 3 Minutes Charge", poster: "https://i.postimg.cc/SRTN6JY9/Crayon-Shinchan-The-Legend-Called-Buri-Buri-3-Minutes-Charge.jpg", url: `${STREAM_HOST}/dl/6ae325ce6e979983cdce64d1` },
            { id: "am_crayon_shinchan_the_legend_called_dance_amigo", name: "Crayon Shinchan The Legend Called Dance! Amigo!", poster: "https://i.postimg.cc/cC94Rrtn/Crayon-Shinchan-The-Legend-Called-Dance-Amigo.jpg", url: `${STREAM_HOST}/dl/6ae3272dd617963c181912da` },
            { id: "am_crayon_shinchan_the_movie_my_moving_story_cactus_attack", name: "Crayon Shinchan the Movie My Moving Story Cactus Attack", poster: "https://i.postimg.cc/nrRc4C9X/Crayon-Shinchan-the-Movie-My-Moving-Story-Cactus-Attack.webp", url: `${STREAM_HOST}/dl/6ae325ce6e979983cdce64d5` },
            { id: "am_crayon_shinchan_the_storm_called_me_and_the_space_princess", name: "Crayon Shinchan The Storm Called Me and the Space Princess", poster: "https://i.postimg.cc/L5C6tng5/Crayon-Shinchan-The-Storm-Called-Me-and-the-Space-Princess.jpg", url: `${STREAM_HOST}/dl/6ae325ce6e979983cdce64d4` },
            { id: "am_crayon_shinchan_the_storm_called_the_battle_of_the_warring_states", name: "Crayon Shinchan The Storm Called The Battle of the Warring States", poster: "https://i.postimg.cc/6qj5ry4p/Crayon-Shinchan-The-Storm-Called-The-Battle-of-the-Warring-States.jpg", url: `${STREAM_HOST}/dl/6ae325ce6e979983cdce64d0` },
            { id: "am_crayon_shinchan_the_storm_called_the_hero_of_kinpoko", name: "Crayon Shinchan The Storm Called The Hero of Kinpoko", poster: "https://i.postimg.cc/hvPtQ9vm/Crayon-Shinchan-The-Storm-Called-The-Hero-of-Kinpoko.jpg", url: `${STREAM_HOST}/dl/6ae325d66e979983cdce64d9` },
            { id: "am_crayon_shinchan_the_storm_called_the_jungle", name: "Crayon Shinchan The Storm Called The Jungle", poster: "https://i.postimg.cc/2y8SL4yB/Crayon-Shinchan-The-Storm-Called-The-Jungle.jpg", url: `${STREAM_HOST}/dl/6ae3272dd617963c181912dc` },
            { id: "am_crayon_shinchan_the_storm_called_the_kasukabe_boys_of_the_evening", name: "Crayon Shinchan The Storm Called The Kasukabe Boys of the Evening", poster: "https://i.postimg.cc/7hYZJgh5/Crayon-Shinchan-The-Storm-Called-The-Kasukabe-Boys-of-the-Evening.jpg", url: `${STREAM_HOST}/dl/6ae325ce6e979983cdce64d2` },
            { id: "am_crayon_shinchan_the_storm_called_the_singing_buttocks_bomb", name: "Crayon Shinchan The Storm Called The Singing Buttocks Bomb", poster: "https://i.postimg.cc/brNwSQrN/Crayon-Shinchan-The-Storm-Called-The-Singing-Buttocks-Bomb.jpg", url: `${STREAM_HOST}/dl/6ae325d66e979983cdce64d6` },
            { id: "am_kakushigito_movie", name: "KAKUSHIGITO", poster: "https://i.postimg.cc/tJC4nhJq/KAKUSHIGITO.jpg", url: `${STREAM_HOST}/dl/6ae327706e979983cdce64dc` },
            { id: "am_miyori_no_mori_miyori_s_forest", name: "Miyori no Mori Miyori's Forest", poster: "https://i.postimg.cc/qqMv68qV/Miyori-no-Mori-Miyori-s-Forest.jpg", url: `${STREAM_HOST}/dl/6ae3272dd617963c181912db` },
            { id: "am_ocean_waves_1993", name: "Ocean Waves", poster: "https://i.postimg.cc/1X53Vptb/Ocean-Waves-1993.jpg", url: `${STREAM_HOST}/dl/6ae3273f6e979983cdce64da` },
            { id: "am_princess_arete", name: "Princess Arete", poster: "https://i.postimg.cc/MHKpfyTC/Princess-Arete.jpg", url: `${STREAM_HOST}/dl/6ae3272ed617963c181912e0` },
            { id: "am_spy_x_family_code_white", name: "SPY x FAMILY CODE White", poster: "https://i.postimg.cc/kGXgRx4p/SPY-x-FAMILY-CODE-White.png", url: `${STREAM_HOST}/dl/6ae3272dd617963c181912dd` },
            { id: "am_taisho_otome_fairy_tale", name: "Taisho Otome Fairy tale", poster: "https://i.postimg.cc/1tKzzWm1/Taisho-Otome-Fairy-tale.jpg", url: `${STREAM_HOST}/dl/6ae325d66e979983cdce64d8` },
            { id: "am_the_boy_and_the_heron", name: "The Boy And the Heron", poster: "https://i.postimg.cc/tTzggrqb/The-Boy-And-the-Heron.jpg", url: `${STREAM_HOST}/dl/6ae32773d617963c181912e3` },
            { id: "am_valley_of_the_lanterns", name: "Valley Of The Lanterns", poster: "https://i.postimg.cc/XJgvv2VT/Valley-Of-The-Lanterns.jpg", url: `${STREAM_HOST}/dl/6ae32738d617963c181912e1` },
            { id: "am_yobi_the_five_tailed_fox", name: "Yobi the Five Tailed Fox", poster: "https://i.postimg.cc/vTHZxWBK/Yobi-the-Five-Tailed-Fox.jpg", url: `${STREAM_HOST}/dl/6ae32738d617963c181912e2` },
            { id: "am_dragon_ball_movie_3_mystical_adventure", name: "Dragon Ball Movie 3 - Mystical Adventure", poster: "https://i.postimg.cc/DwrrRvgK/Dragon-Ball-Movie-3-Mystical-Adventure.jpg", url: `${STREAM_HOST}/dl/6ae2727f6e979983cdce646d` },
            { id: "am_kucing_sesat", name: "Kucing Sesat", poster: "https://i.postimg.cc/qRHx3zpM/Kucing.jpg", url: `${STREAM_HOST}/dl/6ae212a66e979983cdce6452` },
            { id: "am_the_lion_king_1994", name: "The Lion King", poster: "https://i.postimg.cc/4x4Xr2kp/lion-king-1994.webp", description: "", url: `${STREAM_HOST}/dl/6adea2196e979983cdce6319` },
            { id: "am_the_lion_king_3_hakuna_matata_2004", name: "The Lion King 3 Hakuna Matata", poster: "https://i.postimg.cc/mgZT0pfC/lion-king-2004.jpg", description: "", url: `${STREAM_HOST}/dl/6adea2e36e979983cdce631a` },
            { id: "am_the_lion_king_2_1998", name: "The Lion King 2", poster: "https://i.postimg.cc/L63HQK7y/lion-king-1998.jpg", description: "", url: `${STREAM_HOST}/dl/6adea3056e979983cdce631b` },
            { id: "am_barbie_as_rapunzel", name: "Barbie as Rapunzel", poster: "https://i.postimg.cc/RFjvXVp5/Barbie-Rapunzel.jpg", description: ".", url: `${STREAM_HOST}/dl/6adc2ca76e979983cdce6195` },
            { id: "am_thebadguy", name: "The Bad Guy", poster: "https://i.postimg.cc/0QXzH56k/The-Bad-Guy.jpg", url: `${STREAM_HOST}/dl/6ad7557a6e979983cdce5fb6` },
            { id: "am_thebadguy2", name: "The Bad Guy 2", poster: "https://i.postimg.cc/4dxK5H3R/The-Bad-Guy-2.jpg", url: `${STREAM_HOST}/dl/6ad7557a6e979983cdce5fb5` },
            { id: "am_doraemon_1980", name: "Doraemon: The Record of Nobita's Parallel Visit to the West (1988)", poster: "https://i.postimg.cc/K8McK6Wz/D1.jpg", url: `${STREAM_HOST}/dl/6accab1d6e979983cdce5a66` },
            { id: "am_doraemon_2018", name: "Doraemon: Nobita's Treasure Island (2018)", poster: "https://i.postimg.cc/cJGxfDqT/D2.jpg", url: `${STREAM_HOST}/dl/6accab1d6e979983cdce5a68` },
            { id: "am_doraemon_english_2017", name: "Doraemon: Great Adventure in The Antarctic Kachi Kochi (2017)", poster: "https://i.postimg.cc/L814qcbG/D3.jpg", url: `${STREAM_HOST}/dl/6accab1d6e979983cdce5a67` },
            { id: "am_doraemon_2003", name: "Doraemon 2003 Nobita", poster: "https://i.postimg.cc/SKLydWkb/D4.jpg", url: `${STREAM_HOST}/dl/6accab1d6e979983cdce5a65` },
            { id: "am_doraemon_2014", name: "Doraemon Stand By Me (2014)", poster: "https://i.postimg.cc/tCfC4q2W/D5.jpg", url: `${STREAM_HOST}/dl/6accab1d6e979983cdce5a69` },
            { id: "am_doraemon_malay_2017", name: "Doraemon 2017 - Benua Antartika", poster: "https://i.postimg.cc/9FSFQmJy/D6.jpg", url: `${STREAM_HOST}/dl/6accab1d6e979983cdce5a6a` },
            { id: "am_doraemon_1986", name: "Doraemon Nobita and the Steel Troops (1986)", poster: "https://i.postimg.cc/QxVdD9kK/D7.jpg", url: `${STREAM_HOST}/dl/6accab256e979983cdce5a6c` },
            { id: "am_doraemon_2002", name: "Doraemon Nobita in the Robot Kingdom (2002)", poster: "https://i.postimg.cc/YqjC7Gfh/D8.jpg", url: `${STREAM_HOST}/dl/6accab256e979983cdce5a6d` },
            { id: "am_doraemon_1982", name: "Doraemon Nobita and the Haunts of Evil (1982)", poster: "https://i.postimg.cc/yYW8KgXX/D9.jpg", url: `${STREAM_HOST}/dl/6accab256e979983cdce5a6b` },
            { id: "am_doraemon_1983", name: "Doraemon Nobita and the Castle of the Undersea Devil (1983)", poster: "https://i.postimg.cc/3wjK1g71/D10.jpg", url: `${STREAM_HOST}/dl/6accab256e979983cdce5a6e` },
            { id: "am_doraemon_2016", name: "Doraemon Nobita and the Birth of Japan (2016)", poster: "https://i.postimg.cc/8kZzxBWS/D11.jpg", url: `${STREAM_HOST}/dl/6accab2b6e979983cdce5a70` },
            { id: "am_doraemon_2004", name: "Doraemon Nobita in the Wan Nyan Spacetime Odyssey (2004)", poster: "https://i.postimg.cc/FFTHwgSq/D12.jpg", url: `${STREAM_HOST}/dl/6accab2a6e979983cdce5a6f` },
            { id: "am_doraemon_special", name: "Doraemon Movie Special Movie", poster: "https://i.postimg.cc/Bb7ZD43r/D13.png", url: `${STREAM_HOST}/dl/6accab306e979983cdce5a71` },
            { id: "am_doraemon_2006", name: "Doraemon Nobita's Dinosaur (2006)", poster: "https://i.postimg.cc/90gXTCVq/D14.webp", url: `${STREAM_HOST}/dl/6accab306e979983cdce5a72` },
            { id: "am_doraemon_2013", name: "Doraemon: Nobita and the Secret Gadget Museum (2013)", poster: "https://i.postimg.cc/4yfjzS1C/Doraemon-The-Movie-Nobita-and-Secret-Gadget-Museum.jpg", url: `${STREAM_HOST}/dl/6accb5fa6e979983cdce5ac4` },
            { id: "am_doraemon_2015", name: "Doraemon: Nobita & The Space Heroes (2015)", poster: "https://i.postimg.cc/j2xBzF4Z/Doraemon-The-Movie-Nobita-The-Space-Heroes.jpg", url: `${STREAM_HOST}/dl/6accb6076e979983cdce5ac5` },
            { id: "am_doraemon_2009", name: "Doraemon: New Record of Nobita's Spaceblazer (2009)", poster: "https://i.postimg.cc/wMqnhGQF/Doraemon-The-Movie-New-Record-of-Nobita-Spaceblazer.jpg", url: `${STREAM_HOST}/dl/6accb6136e979983cdce5ac6` },
            { id: "am_doraemon_2", name: "Stand by Me Doraemon 2 (2020)", poster: "https://i.postimg.cc/WzNxMHw8/Doraemon-Stand-By-Me-2.jpg", url: `${STREAM_HOST}/dl/6accb6196e979983cdce5ac7` },
            { id: "am_doraemon_1", name: "Stand by Me Doraemon", poster: "https://i.postimg.cc/wMqnhGQV/Doraemon-Stand-By-Me.jpg", url: `${STREAM_HOST}/dl/6accb6236e979983cdce5ac8` },
            { id: "am_dragonball_04", name: "Mutiara Naga Movie 04: The Path to Power", poster: "https://i.postimg.cc/q7dx3d1R/Dragon-Ball-The-Way-to-the-Strongest.jpg", url: `${STREAM_HOST}/dl/6accb1486e979983cdce5a77` },
            { id: "am_dragonball_castle", name: "Dragon Ball: Sleeping Princess in Devil's Castle", poster: "https://i.postimg.cc/DzKPXKx0/Dragon-Ball-Sleeping-Princess-in-Devil-s-Castle.jpg", url: `${STREAM_HOST}/dl/6accb1486e979983cdce5a78` },
            { id: "am_dragonball_shenron", name: "Dragon Ball: Legend of Shenron", poster: "https://i.postimg.cc/qRVCyWxv/Legend-of-Shenron.jpg", url: `${STREAM_HOST}/dl/6accb1486e979983cdce5a79` },
            { id: "am_conan_1999", name: "Movie: The Last Wizard of the Century (1999)", poster :"https://i.postimg.cc/C5YdBmK9/The-Last-Wizard-of-the-Century.jpg", url: `${STREAM_HOST}/dl/6ace5db16e979983cdce5d28` },
            { id: "am_conan_2000", name: "Movie: Captured in Her Eyes (2000)", poster :"https://i.postimg.cc/wMH3y0Bf/Captured-in-Her-Eyes.jpg", url: `${STREAM_HOST}/dl/6ace5db16e979983cdce5d29` },
            { id: "am_conan_2019", name: "Movie: The Fist of Blue Sapphire (2019)", poster :"https://i.postimg.cc/fLYJR6M1/The-Fist-of-Blue-Sapphire.jpg", url: `${STREAM_HOST}/dl/6ace68066e979983cdce5dd1` },
            { id: "am_naruto_3", name: "Naruto The Movie 3: Guardians of the Crescent Moon Kingdom", poster: "https://i.postimg.cc/qvRm0kWy/Naruto-The-Movie-3-Guardians-of-the-Crescent-Moon-Kingdom-(Malay-Dub).jpg", url: `${STREAM_HOST}/dl/6accaf986e979983cdce5a74` },
            { id: "am_naruto_gelel", name: "Naruto The Movie: Legend of the Stone of Gelel", poster: "https://i.postimg.cc/7Z6BDxj2/Naruto-the-Movie-Legend-of-the-Stone-of-Gelel.jpg", url: `${STREAM_HOST}/dl/6accaf986e979983cdce5a75` },
            { id: "am_naruto_snow", name: "Naruto The Movie: Ninja Clash in the Land of Snow", poster: "https://i.postimg.cc/SxsZqyH8/Naruto-the-Movie-Ninja-Clash-in-the-Land-of-Snow.jpg", url: `${STREAM_HOST}/dl/6accaf986e979983cdce5a73` }
        ]
    },
    "story_catalog": {
        id: "story_catalog",
        isMulti: true,
        items:  [
            { id: "islamic_history_conquest_of_khaybar", name: "Conquest Of Khaybar", poster: "https://i.postimg.cc/4dWsyt15/Conquest-Of-Khaybar.jpg", background: "https://i.postimg.cc/4xhQWWtS/Conquest-of-Khaybar.jpg", url: `${STREAM_HOST}/dl/6aeaa2d96e979983cdce6927` },
            { id: "islamic_history_the_false_prophet", name: "The False Prophet", poster: "https://i.postimg.cc/qR14qnGn/The-False-Prophet.jpg", background: "https://i.postimg.cc/t4VNBBW0/The-False-Prophet.jpg", url: `${STREAM_HOST}/dl/6aeaa2d96e979983cdce6923` },
            { id: "islamic_history_sodom_gomorrah", name: "Sodom & Gomorrah", poster: "https://i.postimg.cc/pTsRr8Bz/Sodom-amp-Gomorrah.jpg", background: "https://i.postimg.cc/dVTj55dX/Sodom-Gomorrah.jpg", url: `${STREAM_HOST}/dl/6aeaa2d96e979983cdce6924` },
            { id: "islamic_history_the_tragic_life_of_abu_dharr_al_ghafari", name: "The Tragic Life Of Abu Dharr Al-Ghafari", poster: "", background: "https://i.postimg.cc/W1Jw55gc/The-Tragic-Life-of-Abu-Dharr-Al-Ghafari.jpg", url: `${STREAM_HOST}/dl/6aeaa2d96e979983cdce6925` },
            { id: "islamic_history_the_golden_sands", name: "The Golden Sands", poster: "https://i.postimg.cc/C1cS5D48/The-Golden-Sands.jpg", background: "https://i.postimg.cc/pLnJss81/The-Golden-Sands.jpg", url: `${STREAM_HOST}/dl/6aeaa2d96e979983cdce6926` },
            { id: "islamic_history_battles_of_badr_uhud_the_trench", name: "Battles Of Badr, Uhud & The Trench", poster: "https://i.postimg.cc/50sbyvm8/Battles-Of-Badr-Uhud-amp-The-Trench.jpg", background: "https://i.postimg.cc/mgFymmMv/Battles-of-Badr-Uhud-The-Trench.jpg", url: `${STREAM_HOST}/dl/6aeaa2d96e979983cdce6928` }
        ]
    },
    "animation_dub_catalog": {
        id: "animation_dub_catalog",
        isMulti: true,
        items:  [
            { id: "animation_dub_aladdin1", name: "Aladdin 1992", poster: "https://i.postimg.cc/hv6R0g5S/Aladdin-1992-DP.webp" , background : "https://i.postimg.cc/59SgTv8K/Aladdin-1992-WP.webp", url: `${STREAM_HOST}/dl/6ae532326e979983cdce66b2` },
            { id: "animation_dub_kung_fu_panda_2008", name: "Kung Fu Panda", poster: "https://i.postimg.cc/rwQLj16L/Kung-Fu-Panda-1-DP.jpg", background: "https://i.postimg.cc/6pYNcrsX/Kung-Fu-Panda-1-WP.jpg", url: `${STREAM_HOST}/dl/6ae939086e979983cdce68c5` },
            { id: "animation_dub_kung_fu_panda_2_2011", name: "Kung Fu Panda 2", poster: "https://i.postimg.cc/52nMgwhZ/Kung-Fu-Panda-2-DP.jpg", background: "https://i.postimg.cc/2S2fG4sg/Kung-Fu-Panda-2-WP.jpg", url: `${STREAM_HOST}/dl/6ae939086e979983cdce68c3` },
            { id: "animation_dub_kung_fu_panda_3_2016", name: "Kung Fu Panda 3", poster: "https://i.postimg.cc/pLqtCDw4/Kung-Fu-Panda-3-DP.jpg", background: "https://i.postimg.cc/zG017nsQ/Kung-Fu-Panda-3-WP.jpg", url: `${STREAM_HOST}/dl/6ae939086e979983cdce68c6` },
            { id: "animation_dub_kung_fu_panda_4_2024", name: "Kung Fu Panda 4", poster: "https://i.postimg.cc/htpqs9k5/Kung-Fu-Panda-4-DP.png", background: "https://i.postimg.cc/W1XP8MBY/Kung-Fu-Panda-4-WP.jpg", url: `${STREAM_HOST}/dl/6ae939086e979983cdce68c2` },
            { id: "animation_dub_madagascar_2_escape_to_africa_2008", name: "Madagascar 2 Escape To Africa", poster: "https://i.postimg.cc/kgnmWjpp/Madagascar-2-Escape-2-Africa-DP.jpg", background: "https://i.postimg.cc/P52kymgQ/Madagascar-2-Escape-2-Africa-WP.jpg", url: `${STREAM_HOST}/dl/6ae939086e979983cdce68c4` },
            { id: "animation_dub_sing_2016", name: "Sing", poster: "https://i.postimg.cc/nLrfPXZZ/Sing-2016-DP.jpg", background: "https://i.postimg.cc/0Nj1Bzxg/Sing-2016-WP.jpg", url: `${STREAM_HOST}/dl/6ae939086e979983cdce68c7` },
            { id: "animation_dub_dragon_ball_z_movie_dead_zone_malay_dub", name: "Dragon Ball Z Movie Dead Zone", poster: "https://i.postimg.cc/5ymSFq0Z/Dragon-Ball-Z-Movie-Dead-Zone-DP.jpg", background : "https://i.postimg.cc/qqGxCXqH/Dragon-Ball-Z-Movie-Dead-Zone-WP.jpg", url: `${STREAM_HOST}/dl/6acd0fcd6e979983cdce5cef` },
            { id: "animation_dub_shrek_2001", name: "Shrek", poster: "https://i.postimg.cc/jjjBXc7Y/Shrek-2001-DP.jpg" , background : "https://i.postimg.cc/q77WLw3V/Shrek-WP.jpg", url: `${STREAM_HOST}/dl/6ae724ff6e979983cdce67ed` },
            { id: "animation_dub_shrek_2_2004", name: "Shrek 2", poster: "https://i.postimg.cc/Gpp6QKy0/Shrek-2004-DP.jpg" , background : "https://i.postimg.cc/LssGTDZw/Shrek-2004-WP.jpg", url: `${STREAM_HOST}/dl/6ae725046e979983cdce67ee` },
            { id: "animation_dub_shrek_the_third_2007", name: "Shrek the Third", poster: "https://i.postimg.cc/9ffspbqv/Shrek-2007-DP.jpg" , background : "https://i.postimg.cc/yNN2PjS5/Shrek-2007-WP.jpg", url: `${STREAM_HOST}/dl/6ae725096e979983cdce67ef` },
            { id: "animation_dub_shrek_forever_after_2010", name: "Shrek Forever After", poster: "https://i.postimg.cc/q77WLwCZ/Shrek-2010-DP.jpg" , background : "https://i.postimg.cc/7LLjV9TR/Shrek-2010-WP.jpg", url: `${STREAM_HOST}/dl/6ae7250e6e979983cdce67f0` },
            { id: "animation_dub_puss_in_boots_2011", name: "Puss In Boots", poster: "https://i.postimg.cc/jjjBXcJF/Puss-In-Boots-2011-DP.webp" , background : "https://i.postimg.cc/zff4j7Rx/Puss-In-Boots-2011-WP.webp", url: `${STREAM_HOST}/dl/6ae726586e979983cdce67f1` },
            { id: "animation_dub_puss_in_boots_the_last_wish_2022", name: "Puss in Boots The Last Wish", poster: "https://i.postimg.cc/Xvvt8Ly1/Puss-In-Boots-2022-DP.jpg" , background : "https://i.postimg.cc/mrrKwjFV/Puss-In-Boots-2022-WP.jpg", url: `${STREAM_HOST}/dl/6ae7265f6e979983cdce67f3` },
            { id: "animation_dub_frozen_2013", name: "Frozen", poster: "https://i.postimg.cc/XYLTdmX1/Frozen-2013-DP.jpg" , background : "https://i.postimg.cc/zG79K63x/Frozen-2013-WP.jpg", url: `${STREAM_HOST}/dl/6ae733226e979983cdce67f5` },
            { id: "animation_dub_frozen_ii_2019", name: "Frozen II", poster: "https://i.postimg.cc/nLLNk2QK/Frozen-2019-DP.webp" , background : "https://i.postimg.cc/4xPrVqnF/Frozen-2019-WP.jpg", url: `${STREAM_HOST}/dl/6ae7333b6e979983cdce67f7` },
            { id: "animation_dub_the_grinch_2018", name: "The Grinch", poster: "https://i.postimg.cc/mgj0CJhd/The-Grinch-2018-DP.jpg" , background : "https://i.postimg.cc/Dw6tLHmd/The-Grinch-2018-WP.jpg", url: `${STREAM_HOST}/dl/6ae735376e979983cdce67fb` },
            { id: "animation_dub_putih_2001", name: "Putih", poster: "https://i.postimg.cc/zXm2gTnc/Putih-2001.jpg", url: `${STREAM_HOST}/dl/6ae403d56e979983cdce665e` },
            { id: "animation_dub_bola_kampung_movie", name: "Bola Kampung The Movie", poster: "https://i.postimg.cc/L4ctMfdw/Bola-Kampung-Movie.jpg" , url: `${STREAM_HOST}/dl/6ae48c405284e642276a123e` },
            { id: "animation_dub_papa_zola_the_movie_2025", name: "Papa Zola The Movie", poster: "https://i.postimg.cc/9Qddsmp0/Papa-Zola.jpg", url: `${STREAM_HOST}/dl/6ae28003061e57f7e995fdfa` },
            { id: "animation_dub_boboiboy_the_movie_2016", name: "BoBoiBoy 1", poster: "https://i.postimg.cc/htLLNDrG/Boboiboy-2016.jpg", url: `${STREAM_HOST}/dl/6ae27f67061e57f7e995fdf8` },
            { id: "animation_dub_boboiboy_movie_2_2019", name: "BoBoiBoy 2", poster: "https://i.postimg.cc/Z588XbcR/Boboiboy-2019.webp", url: `${STREAM_HOST}/dl/6ae27f97061e57f7e995fdf9` },
            { id: "animation_dub_mechamato_movie_2022", name: "Mechamato", poster: "https://i.postimg.cc/g2VV1zD2/Mecha-2022.jpg", url: `${STREAM_HOST}/dl/6ae280666e979983cdce6470` },
            { id: "animation_dub_ejen_ali_2019", name: "Ejen Ali 1", poster: "https://i.postimg.cc/52BBD431/Ejen-Ali-2019.jpg", url: `${STREAM_HOST}/dl/6ae280b66e979983cdce6471` },
            { id: "animation_dub_ejen_ali_movie_2_2025", name: "Ejen Ali 2", poster: "https://i.postimg.cc/wjXXnqVx/Ejen-Ali-2025.jpg", url: `${STREAM_HOST}/dl/6ae281076e979983cdce6472` },
            { id: "animation_dub_the_little_mermaid1", name: "The Little Mermaid 1", poster: "https://i.postimg.cc/Zn2zLZMm/The-Little-Mermaid-1989-DP.jpg" , background : "https://i.postimg.cc/y6yjt90h/The-Little-Mermaid-1989-WP.jpg", url: `${STREAM_HOST}/dl/6ae656033a36aa61a17a7aa0` },
            { id: "animation_dub_the_little_mermaid2", name: "The Little Mermaid 2", poster: "https://i.postimg.cc/3NVQZ7cY/The-Little-Mermaid-2-2000-DP.jpg" , background : "https://i.postimg.cc/y6yjt90F/The-Little-Mermaid-2000-WP.jpg", url: `${STREAM_HOST}/dl/6ae6585557a1c542c414ba81` },
            { id: "animation_dub_the_little_mermaid3", name: "The Little Mermaid 3", poster: "https://i.postimg.cc/zv6Yk5c1/The-Little-Mermaid-2008-DP.jpg" , background : "https://i.postimg.cc/HW9zR5bX/The-Little-Mermaid-2008-WP.webp", url: `${STREAM_HOST}/dl/6ae6575f57a1c542c414ba80` },
            { id: "animation_dub_lilo_and_stitch1", name: "Lilo and Stitch 1", poster: "https://i.postimg.cc/GtVnjr58/Lilo-Stitch-DP-2002.jpg" , background : "https://i.postimg.cc/RCLdyfwb/Lilo-and-Stitch-2002-WP.jpg", url: `${STREAM_HOST}/dl/6ae654323a36aa61a17a7a9d` },
            { id: "animation_dub_lilo_and_stitch2", name: "Lilo and Stitch 2", poster: "https://i.postimg.cc/0jF1CxBb/Lilo-Stitch-2-DP-2005.jpg" , background : "https://i.postimg.cc/SQfd38c5/Lilo-and-Stitch-2005-WP.jpg", url: `${STREAM_HOST}/dl/6ae654da3a36aa61a17a7a9f` },
            { id: "animation_dub_cinderella1", name: "Cinderella 1", poster: "https://i.postimg.cc/ZnCh30j2/Cinderella-1950-DP.webp" , background : "https://i.postimg.cc/9XYbKTy4/Cinderella-1950-WP.webp", url: `${STREAM_HOST}/dl/6ae532326e979983cdce66b4` },
            { id: "animation_dub_cinderella2", name: "Cinderella 2", poster: "https://i.postimg.cc/cCrNY6XN/Cinderella-2-2002-DP.jpg" , background : "https://i.postimg.cc/kMvsz8WR/Cinderella-2002-WP.webp", url: `${STREAM_HOST}/dl/6ae65b316e979983cdce6757` },
            { id: "animation_dub_cinderella3", name: "Cinderella 3", poster: "https://i.postimg.cc/D0H3cFM3/Cinderella-3-2007-DP.webp" , background : "https://i.postimg.cc/FzpxS59F/Cinderella-2007-WP.jpg", url: `${STREAM_HOST}/dl/6ae65c5cf19a3ee0ff532000` },
            { id: "animation_dub_moana1", name: "Moana 1", poster: "https://i.postimg.cc/nrCt7MTT/Moana-2016-DP.jpg" , background : "https://i.postimg.cc/5ygmzdxf/Moana-2016-WP.webp", url: `${STREAM_HOST}/dl/6ae65e84f19a3ee0ff532004` },
            { id: "animation_dub_how_to_train_your_dragon1", name: "How to Train Your Dragon 1", poster: "https://i.postimg.cc/brsjbdLR/How-To-Train-Your-Dragon-2010-DP.jpg" , background : "https://i.postimg.cc/x85PmD97/How-to-Train-Your-Dragon-2010-WP.jpg", url: `${STREAM_HOST}/dl/6ae6623ddce7f9a73628491c` },
            { id: "animation_dub_how_to_train_your_dragon2", name: "How to Train Your Dragon 2", poster: "https://i.postimg.cc/26HDVnd9/How-To-Train-Your-Dragon-2014-DP.webp" , background : "https://i.postimg.cc/FzpxS59t/How-to-Train-Your-Dragon-2014-WP.jpg", url: `${STREAM_HOST}/dl/6ae6613adce7f9a736284919` },
            { id: "animation_dub_how_to_train_your_dragon3", name: "How to Train Your Dragon 3", poster: "https://i.postimg.cc/3RLTd2j6/How-To-Train-Your-Dragon-2018-DP.jpg" , background : "https://i.postimg.cc/hvs0mWSR/How-to-Train-Your-Dragon-2018-WP.jpg", url: `${STREAM_HOST}/dl/6ae6632adce7f9a73628491d` },
        ]
    },
    "anak_mak_catalog": {
        id: "anak_mak",
        catalogId: "anak_mak_catalog",
        name: "Suamiku Anak Mak",
        poster: "https://i.postimg.cc/htSxcQgp/SAM-DP.jpg",
        background: "https://i.postimg.cc/c1VGT9cD/Suami-Anak-Mak-WP.webp",
        description: "Selepas berkahwin, Zaraa mula menyedari bahawa Haris ialah seorang anak mak iaitu lelaki yang terlalu mengutamakan dan bergantung kepada ibunya, Mak Leha (lakonan Dian P. Ramlee).Apabila segala pengorbanan dan kesabaran Zaraa tidak dihargai oleh Haris yang terus tunduk kepada telunjuk ibunya, Zaraa berada di persimpangan jalan untuk memilih sama ada terus mempertahankan cinta yang terseksa atau melepaskan diri demi menjaga maruahnya.",
        episodes: createEpisodes([  
            { title: "Episode 01" , url: `${STREAM_HOST}/dl/6ae48d285284e642276a1244` },
            { title: "Episode 02" , url: `${STREAM_HOST}/dl/6ae48d285284e642276a1240` },
            { title: "Episode 03" , url: `${STREAM_HOST}/dl/6ae48d285284e642276a1241` },
            { title: "Episode 04" , url: `${STREAM_HOST}/dl/6ae48d285284e642276a1243` },
            { title: "Episode 05" , url: `${STREAM_HOST}/dl/6ae8c441f68f8e30a1786ea0` }, 
            { title: "Episode 06" , url: `${STREAM_HOST}/dl/6aea466174b13de7daa48bf1` },
            { title: "Episode 07" , url: `${STREAM_HOST}/dl/6aede4fb6e979983cdce6964` },
            { title: "Episode 08" , url: `${STREAM_HOST}/dl/6aede4fd6e979983cdce6965` },
        ])
    },
    "perempuan_sialan_catalog": {
        id: "perempuan_sialan",
        catalogId: "perempuan_sialan_catalog",
        name: "Dia Perempuan Sialan (The Hidden Hand)",
        poster: "https://i.postimg.cc/Hkp5d8H9/DPS-DP.jpg",
        background: "https://i.postimg.cc/wj6JgRHF/DPS-WP.jpg",
        description: "Puan Sri Asyikin mati secara mengerikan dan misteri. Kematian ini membawa kegelisahan kepada anaknya, Nerina (Hannah Delisha), dan menantunya, Syawal (Meerqeen).",
        episodes: createEpisodes([  
            { title: "Episode 01" , url: `${STREAM_HOST}/dl/6ae48d695284e642276a124d` },
            { title: "Episode 02" , url: `${STREAM_HOST}/dl/6ae48d6e5284e642276a124e` },
            { title: "Episode 03" , url: `${STREAM_HOST}/dl/6ae48d745284e642276a124f` },
            { title: "Episode 04" , url: `${STREAM_HOST}/dl/6ae48d695284e642276a124c` },
            { title: "Episode 05" , url: `${STREAM_HOST}/dl/6ae48d385284e642276a124b` },
            { title: "Episode 06" , url: `${STREAM_HOST}/dl/6ae48d385284e642276a124a` },
            { title: "Episode 07" , url: `${STREAM_HOST}/dl/6ae48d325284e642276a1248` },
            { title: "Episode 08" , url: `${STREAM_HOST}/dl/6ae48d325284e642276a1249` },
            { title: "Episode 09" , url: `${STREAM_HOST}/dl/6ae48d325284e642276a1247` },
            { title: "Episode 10" , url: `${STREAM_HOST}/dl/6ae48d285284e642276a1246` },
            { title: "Episode 11" , url: `${STREAM_HOST}/dl/6ae48d285284e642276a1242` },
            { title: "Episode 12" , url: `${STREAM_HOST}/dl/6ae48d285284e642276a1245` } 
        ])
    },
    "walid_catalog": {
        id: "walid",
        catalogId: "walid_catalog",
        name: "Walid",
        poster: "https://i.postimg.cc/3NDyCc4s/Walid-DP.jpg",
        background: "https://i.postimg.cc/tJV1tMZw/Walid-WP.jpg",
        description: " Mengisahkan Walid (Faizal Hussein), bekas pemimpin ajaran sesat Jihad Ummah yang melarikan diri ke kawasan pergunungan untuk membina semula pengaruhnya.  Usaha beliau bangkit mempertemukannya dengan Habiburrahman (Aqasha), seorang pendakwah Indonesia berkarisma yang mempunyai agenda tersendiri, mencetuskan persaingan menguasai pengikut. Dalam masa sama, bekas isteri Walid (Ummi Hafizah) dan bekas mentornya (Ustaz Fateh) berusaha meluruskan semula keadaan serta menyelamatkan akidah pengikut yang tersasar",
        episodes: createEpisodes([
            { title: "Walid - Episode 1" , url: `${STREAM_HOST}/dl/6ae6968a7e9ed09f91dd42c2` },
            { title: "Walid - Episode 2" , url: `${STREAM_HOST}/dl/6ae696556e979983cdce67a6` },
            { title: "Walid - Episode 3" , url: `${STREAM_HOST}/dl/6ae696506e979983cdce67a5` },
            { title: "Walid - Episode 4" , url: `${STREAM_HOST}/dl/6ae6964b6e979983cdce67a4` },
            { title: "Walid - Episode 5" , url: `${STREAM_HOST}/dl/6ae6964b6e979983cdce67a3` },
            { title: "Walid - Episode 6" , url: `${STREAM_HOST}/dl/6ae6964b6e979983cdce67a2` },
            { title: "Walid - Episode 7" , url: `${STREAM_HOST}/dl/6ae696456e979983cdce67a1` },
            { title: "Walid - Episode 8" , url: `${STREAM_HOST}/dl/6ae696426e979983cdce679f` },
            { title: "Walid - Episode 9" , url: `${STREAM_HOST}/dl/6ae696436e979983cdce67a0` },
            { title: "Walid - Episode 10" , url: `${STREAM_HOST}/dl/6ae696426e979983cdce679e` },
            { title: "Walid - Episode 11" , url: `${STREAM_HOST}/dl/6ae696426e979983cdce679c` },
            { title: "Walid - Episode 12" , url: `${STREAM_HOST}/dl/6ae696426e979983cdce679d` }
                    ])
    },
    "sesaat_lebih_catalog": {
        id: "sesaat_lebih",
        catalogId: "sesaat_lebih_catalog",
        name: "Sesaat Lebih",
        poster: "https://i.postimg.cc/Rh7N3nnt/Sesaat-Lebih-DP.jpg",
        background: "https://i.postimg.cc/JnFDXL0m/Sesaat-Lebih-WP.jpg",
        description: "Selepas pemergian Haoyu, Adelia bergelut dengan rasa sedih yang mendalam serta usaha untuk kembali rapat dengan anak perempuannya, Hana (Hawra Jamalullail). Kerana rindu dan trauma, Adelia mengalami masa-masa sukar termasuk berhalusinasi seolah-olah arwah suaminya masih hidup.",
        episodes: createEpisodes([
            { title: "Sesaat Lebih - Episode 1" , url: `${STREAM_HOST}/dl/6ae696c67e9ed09f91dd42ca` },
            { title: "Sesaat Lebih - Episode 2" , url: `${STREAM_HOST}/dl/6ae696d07e9ed09f91dd42cd` },
            { title: "Sesaat Lebih - Episode 3" , url: `${STREAM_HOST}/dl/6ae696cb7e9ed09f91dd42cb` },
            { title: "Sesaat Lebih - Episode 4" , url: `${STREAM_HOST}/dl/6ae696c57e9ed09f91dd42c8` },
            { title: "Sesaat Lebih - Episode 5" , url: `${STREAM_HOST}/dl/6ae696c57e9ed09f91dd42c7` },
            { title: "Sesaat Lebih - Episode 6" , url: `${STREAM_HOST}/dl/6ae696c67e9ed09f91dd42c9` },
            { title: "Sesaat Lebih - Episode 7" , url: `${STREAM_HOST}/dl/6ae696d07e9ed09f91dd42ce` },
            { title: "Sesaat Lebih - Episode 8" , url: `${STREAM_HOST}/dl/6ae696cb7e9ed09f91dd42cc` },
            { title: "Sesaat Lebih - Episode 9" , url: `${STREAM_HOST}/dl/6ae6b3a5b02aef8b31f6945f` },
            { title: "Sesaat Lebih - Episode 10" , url: `${STREAM_HOST}/dl/6ae696c07e9ed09f91dd42c5` },
            { title: "Sesaat Lebih - Episode 11" , url: `${STREAM_HOST}/dl/6ae6968f7e9ed09f91dd42c4` },
            { title: "Sesaat Lebih - Episode 12" , url: `${STREAM_HOST}/dl/6ae6968a7e9ed09f91dd42c3` }
                    ])
    },
    "seadanya_kita_catalog": {
        id: "seadanya_kita",
        catalogId: "seadanya_kita_catalog",
        name: "Seadanya Kita",
        poster: "https://i.postimg.cc/nr4CsQQj/Seadanya-Kita-DP.jpg",
        background: "https://i.postimg.cc/G2f8DCtR/Seadanya-Kita-WP.jpg",
        description: "Alani ialah seorang ibu tunggal yang berusaha membina semula hidupnya dengan tenang bersama anak lelakinya, Iqi, selepas mengalami pengkhianatan yang menyakitkan daripada bekas suaminya, Farouq (yang meninggalkan mereka demi Neesa). Ketenangan hidup Alani teruji apabila Farouq tiba-tiba kembali dan mahu menuntut tempat dalam hidup anak mereka, Iqi.",
        episodes: createEpisodes([
            { title: "Seadanya Kita - Episode 1" , url: `${STREAM_HOST}/dl/6ae699716e979983cdce67a9` },
            { title: "Seadanya Kita - Episode 2" , url: `${STREAM_HOST}/dl/6ae6999d6e979983cdce67ab` },
            { title: "Seadanya Kita - Episode 3" , url: `${STREAM_HOST}/dl/6ae6999d6e979983cdce67aa` },
            { title: "Seadanya Kita - Episode 4" , url: `${STREAM_HOST}/dl/6ae699a26e979983cdce67ac` },
            { title: "Seadanya Kita - Episode 5" , url: `${STREAM_HOST}/dl/6ae699a36e979983cdce67ad` },
            { title: "Seadanya Kita - Episode 6" , url: `${STREAM_HOST}/dl/6ae699a76e979983cdce67ae` },
            { title: "Seadanya Kita - Episode 7" , url: `${STREAM_HOST}/dl/6ae699a76e979983cdce67af` },
            { title: "Seadanya Kita - Episode 9" , url: `${STREAM_HOST}/dl/6ae699a86e979983cdce67b0` },
            { title: "Seadanya Kita - Episode 10" , url: `${STREAM_HOST}/dl/6ae699ad6e979983cdce67b2` },
            { title: "Seadanya Kita - Episode 11", url: `${STREAM_HOST}/dl/6ae699d96e979983cdce67b3` },
            { title: "Seadanya Kita - Episode 12" , url: `${STREAM_HOST}/dl/6ae699da6e979983cdce67b4` },
            { title: "Seadanya Kita - Episode 13" , url: `${STREAM_HOST}/dl/6ae699e06e979983cdce67b5` },
            { title: "Seadanya Kita - Episode 14" , url: `${STREAM_HOST}/dl/6ae699e06e979983cdce67b6` },
            { title: "Seadanya Kita - Episode 15" , url: `${STREAM_HOST}/dl/6ae699e16e979983cdce67b7` }
                    ])
    },
    "satu_dua_dia_catalog": {
        id: "satu_dua_dia",
        catalogId: "satu_dua_dia_catalog",
        name: "Satu Dua .. Dia?",
        poster: "https://i.postimg.cc/rwsGmJvv/1-2-atau-Dia-DP.jpg",
        background: "https://i.postimg.cc/t4JdT5Lf/1-2-WP.webp",
        description: "Demi mengejar klik dan perhatian di media sosial, Mia menulis satu artikel panas mengenai Isa (lakonan Ariel Fesol), vokalis utama kumpulan penyanyi lelaki popular bernama RIV4L. Sambil mengenali sisi sebenar Isa serta kemelut di sebalik dunia glamor boyband tersebut, Mia mendapati Isa turut menyimpan satu rahsia besar yang mampu meruntuhkan kariernya. Dalam masa yang sama, perasaan mula bercampur-aduk antara mereka berdua.",
        episodes: createEpisodes([
            { title: "Satu Dua Dia - Episode 1" , url: `${STREAM_HOST}/dl/6ae6974d7e9ed09f91dd42db` },
            { title: "Satu Dua Dia - Episode 2" , url: `${STREAM_HOST}/dl/6ae697bf7e9ed09f91dd42e8` },
            { title: "Satu Dua Dia - Episode 3" , url: `${STREAM_HOST}/dl/6ae697bf7e9ed09f91dd42e9` },
            { title: "Satu Dua Dia - Episode 4" , url: `${STREAM_HOST}/dl/6ae6974d7e9ed09f91dd42dc` },
            { title: "Satu Dua Dia - Episode 5" , url: `${STREAM_HOST}/dl/6ae6974d7e9ed09f91dd42dd` },
            { title: "Satu Dua Dia - Episode 6" , url: `${STREAM_HOST}/dl/6ae697837e9ed09f91dd42de` },
            { title: "Satu Dua Dia - Episode 7" , url: `${STREAM_HOST}/dl/6ae697847e9ed09f91dd42df` },
            { title: "Satu Dua Dia - Episode 8" , url: `${STREAM_HOST}/dl/6ae697847e9ed09f91dd42e0` },
            { title: "Satu Dua Dia - Episode 9" , url: `${STREAM_HOST}/dl/6ae697847e9ed09f91dd42e1` },
            { title: "Satu Dua Dia - Episode 10" , url: `${STREAM_HOST}/dl/6ae697897e9ed09f91dd42e2` },
            { title: "Satu Dua Dia - Episode 11" , url: `${STREAM_HOST}/dl/6ae697897e9ed09f91dd42e3` },
            { title: "Satu Dua Dia - Episode 12" , url: `${STREAM_HOST}/dl/6ae6978e7e9ed09f91dd42e4` },
            { title: "Satu Dua Dia - Episode 13" , url: `${STREAM_HOST}/dl/6ae6978e7e9ed09f91dd42e5` },
            { title: "Satu Dua Dia - Episode 14" , url: `${STREAM_HOST}/dl/6ae697ba7e9ed09f91dd42e6` },
            { title: "Satu Dua Dia - Episode 15" , url: `${STREAM_HOST}/dl/6ae697ba7e9ed09f91dd42e7` }
                    ])
    },
    "puteri_and_phrince_catalog": {
        id: "puteri_and_phrince",
        catalogId: "puteri_and_phrince_catalog",
        name: "Putri and Phrince",
        poster: "https://i.postimg.cc/PJWPL888/Putri-Phrince-DP.jpg",
        background: "https://i.postimg.cc/sxZB9NQL/Putri-Phrince-WP.webp",
        description: "Sambil memegang identiti rahsia itu, status sosial Putri di alam realiti turut meningkat naik. Dia mula mendapat perhatian daripada pelajar baharu yang tampan dan menjadi rebutan ramai bernama Phrince, serta dibantu oleh sahabat baiknya, Lola..",
        episodes: createEpisodes([
            { title: "Putri and Phrince - Episode 1" , url: `${STREAM_HOST}/dl/6ae698067e9ed09f91dd42f6` },
            { title: "Putri and Phrince - Episode 2" , url: `${STREAM_HOST}/dl/6ae698067e9ed09f91dd42f7` },
            { title: "Putri and Phrince - Episode 3" , url: `${STREAM_HOST}/dl/6ae698327e9ed09f91dd42f9` },
            { title: "Putri and Phrince - Episode 4" , url: `${STREAM_HOST}/dl/6ae6980b7e9ed09f91dd42f8` },
            { title: "Putri and Phrince - Episode 5" , url: `${STREAM_HOST}/dl/6ae698377e9ed09f91dd42fa` },
            { title: "Putri and Phrince - Episode 6" , url: `${STREAM_HOST}/dl/6ae6983c7e9ed09f91dd42fb` },
            { title: "Putri and Phrince - Episode 7" , url: `${STREAM_HOST}/dl/6ae698417e9ed09f91dd42fc` },
            { title: "Putri and Phrince - Episode 8" , url: `${STREAM_HOST}/dl/6ae698427e9ed09f91dd42fd` },
            { title: "Putri and Phrince - Episode 9" , url: `${STREAM_HOST}/dl/6ae698477e9ed09f91dd42fe` },
            { title: "Putri and Phrince - Episode 10" , url: `${STREAM_HOST}/dl/6ae698477e9ed09f91dd42ff` },
            { title: "Putri and Phrince - Episode 11" , url: `${STREAM_HOST}/dl/6ae699716e979983cdce67a7` },
            { title: "Putri and Phrince - Episode 12" , url: `${STREAM_HOST}/dl/6ae699716e979983cdce67a8` }
                    ])
    },
    "puteri_kelas_atas_catalog": {
        id: "puteri_kelas_atas",
        catalogId: "puteri_kelas_atas_catalog",
        name: "Puteri Kelas Atas",
        poster: "https://i.postimg.cc/Y06h4mmW/Puteri-Kelas-Atas-DP.jpg",
        background: "https://i.postimg.cc/tTcZ6jJp/Puteri-Kelas-Atas-WP.webp",
        description: " Tunku Amelia (Emma Sofea), seorang puteri diraja yang dihantar secara rahsia untuk belajar di Sekolah Berasrama Berlian selepas terlibat dalam satu pertelingkahan besar dengan ayahandanya. Meskipun tindakan ini kelihatan seperti sebuah hukuman, Amelia sebaliknya menyambut baik peluang tersebut sebagai satu permulaan baharu. Dia melihatnya sebagai jalan untuk melepaskan diri daripada belenggu protokol istana yang ketat dan tekanan yang dihadapi sebagai pewaris darah bangsawan.",
        episodes: createEpisodes([
            { title: "Puteri Kelas Atas - Episode 1" , url: `${STREAM_HOST}/dl/6ae697c57e9ed09f91dd42ea` },
            { title: "Puteri Kelas Atas - Episode 2" , url: `${STREAM_HOST}/dl/6ae697c57e9ed09f91dd42eb` },
            { title: "Puteri Kelas Atas - Episode 3" , url: `${STREAM_HOST}/dl/6ae697ca7e9ed09f91dd42ec` },
            { title: "Puteri Kelas Atas - Episode 4" , url: `${STREAM_HOST}/dl/6ae697ca7e9ed09f91dd42ed` },
            { title: "Puteri Kelas Atas - Episode 5" , url: `${STREAM_HOST}/dl/6ae697ca7e9ed09f91dd42ee` },
            { title: "Puteri Kelas Atas - Episode 6" , url: `${STREAM_HOST}/dl/6ae697cf7e9ed09f91dd42ef` },
            { title: "Puteri Kelas Atas - Episode 7" , url: `${STREAM_HOST}/dl/6ae697fb7e9ed09f91dd42f0` },
            { title: "Puteri Kelas Atas - Episode 8" , url: `${STREAM_HOST}/dl/6ae698007e9ed09f91dd42f1` },
            { title: "Puteri Kelas Atas - Episode 9" , url: `${STREAM_HOST}/dl/6ae698007e9ed09f91dd42f2` },
            { title: "Puteri Kelas Atas - Episode 10" , url: `${STREAM_HOST}/dl/6ae698007e9ed09f91dd42f3` },
            { title: "Puteri Kelas Atas - Episode 11" , url: `${STREAM_HOST}/dl/6ae698067e9ed09f91dd42f5` },
            { title: "Puteri Kelas Atas - Episode 12" , url: `${STREAM_HOST}/dl/6ae698067e9ed09f91dd42f4` }
                    ])
    },
    "pabila_dia_tersenyum_catalog": {
        id: "pabila_dia_tersenyum",
        catalogId: "pabila_dia_tersenyum_catalog",
        name: "Pabila Dia Tersenyum",
        poster: "https://i.postimg.cc/HnDrstj0/Pabila-Dia-Tersenyum-DP.jpg",
        background: "https://i.postimg.cc/vBKgnsTR/Pabila-Dia-Tersenyum-WP.jpg",
        description: "Ketika Elina berusia tujuh tahun, ibunya iaitu Mirah melarikan diri bersama seorang lelaki dari Kuala Lumpur bernama Imran (atau Irman). Ayah Elina terkorban sewaktu cuba menghalang kepindahan tersebut. Elina kemudiannya dijaga oleh bapa saudaranya, Benson. elepas Benson dimasukkan ke lokap/penjara, Elina yang hidup menanggung kebencian terpaksa menjejaki ibunya, Mirah, ke Kuala Lumpur. Di sana, nasibnya bertambah malang apabila dia dijumpai dalam keadaan parah dan hampir mati di dalam semak.",
        episodes: createEpisodes([
            { title: "Pabila Dia Tersenyum - Episode 1" , url: `${STREAM_HOST}/dl/6ae6957b6e979983cdce6799` },
            { title: "Pabila Dia Tersenyum - Episode 2" , url: `${STREAM_HOST}/dl/6ae6957b6e979983cdce6798` },
            { title: "Pabila Dia Tersenyum - Episode 3" , url: `${STREAM_HOST}/dl/6ae695766e979983cdce6797` },
            { title: "Pabila Dia Tersenyum - Episode 4" , url: `${STREAM_HOST}/dl/6ae695a76e979983cdce679a` },
            { title: "Pabila Dia Tersenyum - Episode 5" , url: `${STREAM_HOST}/dl/6ae695766e979983cdce6796` },
            { title: "Pabila Dia Tersenyum - Episode 6" , url: `${STREAM_HOST}/dl/6ae695766e979983cdce6795` },
            { title: "Pabila Dia Tersenyum - Episode 7" , url: `${STREAM_HOST}/dl/6ae695706e979983cdce6793` },
            { title: "Pabila Dia Tersenyum - Episode 8" , url: `${STREAM_HOST}/dl/6ae695706e979983cdce6794` },
            { title: "Pabila Dia Tersenyum - Episode 9" , url: `${STREAM_HOST}/dl/6ae695706e979983cdce6792` },
            { title: "Pabila Dia Tersenyum - Episode 10" , url: `${STREAM_HOST}/dl/6ae6956b6e979983cdce6791` },
            { title: "Pabila Dia Tersenyum - Episode 11" , url: `${STREAM_HOST}/dl/6ae695436e979983cdce6790` },
            { title: "Pabila Dia Tersenyum - Episode 12" , url: `${STREAM_HOST}/dl/6ae695436e979983cdce678f` },
            { title: "Pabila Dia Tersenyum - Episode 13" , url: `${STREAM_HOST}/dl/6ae695436e979983cdce678e` },
            { title: "Pabila Dia Tersenyum - Episode 14" , url: `${STREAM_HOST}/dl/6ae6953e6e979983cdce678d` },
            { title: "Pabila Dia Tersenyum - Episode 15" , url: `${STREAM_HOST}/dl/6ae6953e6e979983cdce678c` }
                    ])
    },
    "mitos_cinta_akira_catalog": {
        id: "mitos_cinta_akira",
        catalogId: "mitos_cinta_akira_catalog",
        name: "Mitos Cinta Akira",
        poster: "https://i.postimg.cc/MH2nKYXY/Mitos-Cinta-Akira-DP.jpg",
        background: "https://i.postimg.cc/26tbWD6J/Mitos-Cinta-Akira-WP.jpg",
        description: "Akira merupakan gadis bandar yang terpaksa berpindah ke kampung dan hidup di bawah didikan bapa yang sangat tegas serta mengongkong, manakala Haris dibesarkan dalam keluarga yang bermasalah. Hubungan mereka sering diuji dengan tekanan keluarga, perbezaan personaliti, dan beban pelajaran. Sahabat baik Haris iaitu Ikhwan (lakonan Areef Amran) sering menjadi orang tengah dan tempat Akira berpaut.",
        episodes: createEpisodes([
            { title: "Mitos Cinta Akira - Episode 1" , url: `${STREAM_HOST}/dl/6ae694876e979983cdce676d` },
            { title: "Mitos Cinta Akira - Episode 2" , url: `${STREAM_HOST}/dl/6ae694816e979983cdce676b` },
            { title: "Mitos Cinta Akira - Episode 3" , url: `${STREAM_HOST}/dl/6ae694816e979983cdce676c` },
            { title: "Mitos Cinta Akira - Episode 4" , url: `${STREAM_HOST}/dl/6ae6947b6e979983cdce6769` },
            { title: "Mitos Cinta Akira - Episode 5" , url: `${STREAM_HOST}/dl/6ae6947b6e979983cdce6768` },
            { title: "Mitos Cinta Akira - Episode 6" , url: `${STREAM_HOST}/dl/6ae694506e979983cdce6767` },
            { title: "Mitos Cinta Akira - Episode 7" , url: `${STREAM_HOST}/dl/6ae6944f6e979983cdce6766` },
            { title: "Mitos Cinta Akira - Episode 8" , url: `${STREAM_HOST}/dl/6ae6947b6e979983cdce676a` },  
            { title: "Mitos Cinta Akira - Episode 9" , url: `${STREAM_HOST}/dl/6ae6944f6e979983cdce6764` },
            { title: "Mitos Cinta Akira - Episode 10" , url: `${STREAM_HOST}/dl/6ae694496e979983cdce6763` },
            { title: "Mitos Cinta Akira - Episode 11" , url: `${STREAM_HOST}/dl/6ae694446e979983cdce6762` },
            { title: "Mitos Cinta Akira - Episode 12" , url: `${STREAM_HOST}/dl/6ae694446e979983cdce6761` },
            { title: "Mitos Cinta Akira - Episode 13" , url: `${STREAM_HOST}/dl/6ae694446e979983cdce6760` },
            { title: "Mitos Cinta Akira - Episode 14" , url: `${STREAM_HOST}/dl/6ae6943e6e979983cdce675f` },
            { title: "Mitos Cinta Akira - Episode 15" , url: `${STREAM_HOST}/dl/6ae6943d6e979983cdce675e` }
                    ])
    },
    "lambaian_huda_catalog": {
        id: "lambaian_huda",
        catalogId: "lambaian_huda_catalog",
        name: "Lambaian Huda",
        poster: "https://i.postimg.cc/NFqKfxLk/Lambaian-Huda-DP.jpg",
        background: "https://i.postimg.cc/xCZJm2CW/Lambaian-Huda-WP.jpg",
        description: "Mengisahkan perjalanan rohani Suzie, seorang penyanyi kelab malam yang berusaha meninggalkan masa silam yang kelam dan hubungan toksiknya. Kehadiran jiran baharunya, Fatih—seorang pensyarah agama lulusan Mesir—serta rakan serumahnya Lisa yang berminat mendalami Islam, membuka lembaran baharu untuk mereka mencari hidayah dan keampunan.",
        episodes: createEpisodes([
            { title: "Lambaian Huda - Episode 1" , url: `${STREAM_HOST}/dl/6ae6953e6e979983cdce678b` },
            { title: "Lambaian Huda - Episode 2" , url: `${STREAM_HOST}/dl/6ae695386e979983cdce678a` },
            { title: "Lambaian Huda - Episode 3" , url: `${STREAM_HOST}/dl/6ae695386e979983cdce6789` },
            { title: "Lambaian Huda - Episode 4" , url: `${STREAM_HOST}/dl/6ae695336e979983cdce6788` },
            { title: "Lambaian Huda - Episode 5" , url: `${STREAM_HOST}/dl/6ae695336e979983cdce6787` },
            { title: "Lambaian Huda - Episode 6" , url: `${STREAM_HOST}/dl/6ae695086e979983cdce6786` },
            { title: "Lambaian Huda - Episode 7" , url: `${STREAM_HOST}/dl/6ae695036e979983cdce6785` },
            { title: "Lambaian Huda - Episode 8" , url: `${STREAM_HOST}/dl/6ae695036e979983cdce6784` },
            { title: "Lambaian Huda - Episode 9" , url: `${STREAM_HOST}/dl/6ae695036e979983cdce6783` },
            { title: "Lambaian Huda - Episode 10" , url: `${STREAM_HOST}/dl/6ae694fe6e979983cdce6782` },
            { title: "Lambaian Huda - Episode 11" , url: `${STREAM_HOST}/dl/6ae694fe6e979983cdce6781` },
            { title: "Lambaian Huda - Episode 12" , url: `${STREAM_HOST}/dl/6ae694fd6e979983cdce6780` },
            { title: "Lambaian Huda - Episode 13" , url: `${STREAM_HOST}/dl/6ae694f76e979983cdce677f` },
            { title: "Lambaian Huda - Episode 14" , url: `${STREAM_HOST}/dl/6ae694f76e979983cdce677e` },
            { title: "Lambaian Huda - Episode 15" , url: `${STREAM_HOST}/dl/6ae694f36e979983cdce677d` }
                    ])
    },
    "kelas_belakang_catalog": {
        id: "kelas_belakang",
        catalogId: "kelas_belakang_catalog",
        name: "Kelas Belakang",
        poster: "https://i.postimg.cc/yxmkJSS9/Kelas-Belakang-DP.jpg",
        background: "https://i.postimg.cc/wvryNpvZ/Kelas-Belakang-WP.jpg",
        description: "Keadaan mula berubah apabila Iman Kirana (lakonan Amylia Aidura), seorang pelajar cemerlang dan terbaik di sekolah tersebut, tampil menawarkan diri untuk menjadi tutor atau mengajar kelas berkenaan. Niat asal Iman adalah demi melayakkan dirinya mengejar satu tawaran biasiswa berprestij..",
        episodes: createEpisodes([
            { title: "Kelas Belakang - Episode 1" , url: `${STREAM_HOST}/dl/6ae697487e9ed09f91dd42d9` },
            { title: "Kelas Belakang - Episode 2" , url: `${STREAM_HOST}/dl/6ae697437e9ed09f91dd42d8` },
            { title: "Kelas Belakang - Episode 3" , url: `${STREAM_HOST}/dl/6ae6973e7e9ed09f91dd42d7` },
            { title: "Kelas Belakang - Episode 4" , url: `${STREAM_HOST}/dl/6ae6973e7e9ed09f91dd42d5` },
            { title: "Kelas Belakang - Episode 5" , url: `${STREAM_HOST}/dl/6ae6973e7e9ed09f91dd42d6` },
            { title: "Kelas Belakang - Episode 6" , url: `${STREAM_HOST}/dl/6ae697117e9ed09f91dd42d4` },
            { title: "Kelas Belakang - Episode 7" , url: `${STREAM_HOST}/dl/6ae6970b7e9ed09f91dd42d3` },
            { title: "Kelas Belakang - Episode 8" , url: `${STREAM_HOST}/dl/6ae6970b7e9ed09f91dd42d2` },
            { title: "Kelas Belakang - Episode 9" , url: `${STREAM_HOST}/dl/6ae697067e9ed09f91dd42d1` },
            { title: "Kelas Belakang - Episode 10" , url: `${STREAM_HOST}/dl/6ae697017e9ed09f91dd42d0` },
            { title: "Kelas Belakang - Episode 11" , url: `${STREAM_HOST}/dl/6ae6b2de6e979983cdce67e5` },
            { title: "Kelas Belakang - Episode 12" , url: `${STREAM_HOST}/dl/6ae697017e9ed09f91dd42cf` }
                    ])
    },
    "bidaah_catalog": {
        id: "bidaah",
        catalogId: "bidaah_catalog",
        name: "Bidaah",
        poster: "https://i.postimg.cc/kG32XyDF/Bidaah-DP.jpg",
        background: "https://i.postimg.cc/vT61LNxM/Bidaah-WP.webp",
        description: "Drama ini mengisahkan tentang penyelewengan dan ajaran sesat yang berselindung di sebalik topeng agama di sebuah perkampungan. Cerita berfokus kepada Baiduri, seorang gadis yang dibesarkan dalam keluarga alim. Dia telah dipaksa oleh ibunya, Kalsum, untuk menyertai sebuah kumpulan keagamaan yang dinamakan Jihad Ummah.",
        episodes: createEpisodes([
            { title: "Bidaah - Episode 1" , url: `${STREAM_HOST}/dl/6ae694c16e979983cdce6778` },
            { title: "Bidaah - Episode 2" , url: `${STREAM_HOST}/dl/6ae694c66e979983cdce677b` },
            { title: "Bidaah - Episode 3" , url: `${STREAM_HOST}/dl/6ae694c66e979983cdce677a` },
            { title: "Bidaah - Episode 4" , url: `${STREAM_HOST}/dl/6ae694c26e979983cdce6779` },
            { title: "Bidaah - Episode 5" , url: `${STREAM_HOST}/dl/6ae694f36e979983cdce677c` },
            { title: "Bidaah - Episode 6" , url: `${STREAM_HOST}/dl/6ae694c16e979983cdce6777` },
            { title: "Bidaah - Episode 7" , url: `${STREAM_HOST}/dl/6ae694bc6e979983cdce6776` },
            { title: "Bidaah - Episode 8" , url: `${STREAM_HOST}/dl/6ae694bc6e979983cdce6775` },
            { title: "Bidaah - Episode 9" , url: `${STREAM_HOST}/dl/6ae694bc6e979983cdce6774` },
            { title: "Bidaah - Episode 10" , url: `${STREAM_HOST}/dl/6ae694bb6e979983cdce6773` },
            { title: "Bidaah - Episode 11" , url: `${STREAM_HOST}/dl/6ae694b66e979983cdce6772` },
            { title: "Bidaah - Episode 12" , url: `${STREAM_HOST}/dl/6ae6948e6e979983cdce6771` },
            { title: "Bidaah - Episode 13" , url: `${STREAM_HOST}/dl/6ae6948e6e979983cdce6770` },
            { title: "Bidaah - Episode 14" , url: `${STREAM_HOST}/dl/6ae694886e979983cdce676f` },
            { title: "Bidaah - Episode 15" , url: `${STREAM_HOST}/dl/6ae694876e979983cdce676e` }
                    ])
    },
    "abang_imam_catalog": {
        id: "",
        catalogId: "abang_imam_catalog",
        name: "Abang Imam Minah Skuter",
        poster: "https://i.postimg.cc/VvqdSbb0/Abang-Imam-Minah-Skuter-DP.jpg",
        background: "https://i.postimg.cc/MHjcbFfz/Abang-Imam-Minah-Skuter-WP.webp",
        description: "Zarul bertindak menyembunyikan diri dan bersembunyi di sebuah kampung terpencil bernama Kampung Ulu Banat. Di kampung tersebut, dia tidak sengaja terjebak dan dilantik menjadi imam tidak rasmi (imam terjun) walaupun dia bukanlah seorang ustaz atau imam sebenar. Sepanjang berada di kampung itu, Zarul berdepan dengan pelbagai ragam penduduk tempatan—termasuklah gelagat lucu beberapa orang warga emas dan konflik perebutan kuasa—sambil cuba menyembunyikan identiti sebenarnya. Daripada pertembungan yang penuh jenaka dan salah faham itu, perlahan-lahan mula timbul rasa cinta dan penerimaan antara Zarul dan Mardiah.",
        episodes: createEpisodes([
            { title: "Abang Imam Minah Skuter - Episode 1" , url: `${STREAM_HOST}/dl/6ae699e46e979983cdce67b8` },
            { title: "Abang Imam Minah Skuter - Episode 2" , url: `${STREAM_HOST}/dl/6ae699e56e979983cdce67b9` },
            { title: "Abang Imam Minah Skuter - Episode 3" , url: `${STREAM_HOST}/dl/6ae699e56e979983cdce67ba` },
            { title: "Abang Imam Minah Skuter - Episode 4" , url: `${STREAM_HOST}/dl/6ae699eb6e979983cdce67bb` },
            { title: "Abang Imam Minah Skuter - Episode 5" , url: `${STREAM_HOST}/dl/6ae699eb6e979983cdce67bc` },
            { title: "Abang Imam Minah Skuter - Episode 6" , url: `${STREAM_HOST}/dl/6ae69a166e979983cdce67bd` },
            { title: "Abang Imam Minah Skuter - Episode 7" , url: `${STREAM_HOST}/dl/6ae69a1a6e979983cdce67be` },
            { title: "Abang Imam Minah Skuter - Episode 8" , url: `${STREAM_HOST}/dl/6ae6943b6e979983cdce675a` },
            { title: "Abang Imam Minah Skuter - Episode 9" , url: `${STREAM_HOST}/dl/6ae6943b6e979983cdce6759` },
            { title: "Abang Imam Minah Skuter - Episode 10" , url: `${STREAM_HOST}/dl/6ae6943b6e979983cdce675b` },
            { title: "Abang Imam Minah Skuter - Episode 11" , url: `${STREAM_HOST}/dl/6ae6943b6e979983cdce675c` },
            { title: "Abang Imam Minah Skuter - Episode 12" , url: `${STREAM_HOST}/dl/6ae6943d6e979983cdce675d` }
                    ])
    },
    "w_two_world_catalog": {
        id: "w_two_world",
        catalogId: "w_two_world_catalog",
        name: "W : Two World",
        poster: "https://i.postimg.cc/wM81Tk3J/W-Two-World-DP.jpg",
        background: "https://i.postimg.cc/J0Byc2HM/W-Two-World-WP.avif",
        description: "Ketika mencari ayahnya, Izara secara tidak sengaja ditarik masuk ke dalam dunia webtoon ciptaan bapanya. Di dalam dunia komik itu, Izara menyelamatkan nyawa Aliff Hadi—watak utama siri W yang sedang memburu pihak pembunuh keluarganya pada masa lalu.",
        episodes: createEpisodes([
            { title: "W Two Worlds Malaysia - Episode 1", url: `${STREAM_HOST}/dl/6ae6a149b83c8d1c75dd6b08` },
            { title: "W Two Worlds Malaysia - Episode 2", url: `${STREAM_HOST}/dl/6ae6a144b83c8d1c75dd6b07` },
            { title: "W Two Worlds Malaysia - Episode 3", url: `${STREAM_HOST}/dl/6ae6a13fb83c8d1c75dd6b06` },
            { title: "W Two Worlds Malaysia - Episode 4", url: `${STREAM_HOST}/dl/6ae6a13fb83c8d1c75dd6b05` },
            { title: "W Two Worlds Malaysia - Episode 6", url: `${STREAM_HOST}/dl/6ae6a10eb83c8d1c75dd6b04` },
            { title: "W Two Worlds Malaysia - Episode 7", url: `${STREAM_HOST}/dl/6ae6a10eb83c8d1c75dd6b03` },
            { title: "W Two Worlds Malaysia - Episode 8", url: `${STREAM_HOST}/dl/6ae6a10eb83c8d1c75dd6b02` },
            { title: "W Two Worlds Malaysia - Episode 9", url: `${STREAM_HOST}/dl/6ae6a103b83c8d1c75dd6b01` },
            { title: "W Two Worlds Malaysia - Episode 10", url: `${STREAM_HOST}/dl/6ae6a103b83c8d1c75dd6aff` },
            { title: "W Two Worlds Malaysia - Episode 11", url: `${STREAM_HOST}/dl/6ae6a103b83c8d1c75dd6b00` },
            { title: "W Two Worlds Malaysia - Episode 12", url: `${STREAM_HOST}/dl/6ae6a0feb83c8d1c75dd6afe` }
                    ])
    },
    "dihatiku_ada_kamu_catalog": {
        id: "dihatiku_ada_kamu",
        catalogId: "dihatiku_ada_kamu_catalog",
        name: "Di Hatiku Ada Kamu",
        poster: "https://i.postimg.cc/wM81Tk3X/Di-Hatiku-Ada-Kamu-DP.jpg",
        background: "https://i.postimg.cc/1XNgcjVm/Di-Hatiku-Ada-Kamu-WP.jpg",
        description: "Rian Aulia (lakonan Hannah Delisha), seorang gadis dari golongan berada yang mengalami cinta pandang pertama dan tertarik kepada Ahmad Adif Rayqal (lakonan Redza Rosli) selepas temu janji buta yang diatur oleh keluarga mereka. Meskipun Adif kelihatan seperti seorang lelaki yang budiman dan misteri, dia sebenarnya menyimpan satu agenda tersembunyi. Perkahwinan mereka pada mulanya diatur tanpa desakan, namun Adif mempunyai rancangan untuk membalas dendam dan meruntuhkan empayar perniagaan ayah Rian iaitu Idris (Idris Holding), demi menuntut bela atas kesedihan serta kehilangan ahli keluarganya dahulu.",
        episodes: createEpisodes([
            { title: "Di Hatiku Ada Kamu - Episode 1", url: `${STREAM_HOST}/dl/6ae6a040b83c8d1c75dd6ae4` },
            { title: "Di Hatiku Ada Kamu - Episode 2", url: `${STREAM_HOST}/dl/6ae6a00eb83c8d1c75dd6adf` },
            { title: "Di Hatiku Ada Kamu - Episode 3", url: `${STREAM_HOST}/dl/6ae6a00eb83c8d1c75dd6ae0` },
            { title: "Di Hatiku Ada Kamu - Episode 4", url: `${STREAM_HOST}/dl/6ae6a013b83c8d1c75dd6ae1` },
            { title: "Di Hatiku Ada Kamu - Episode 5", url: `${STREAM_HOST}/dl/6ae6a013b83c8d1c75dd6ae2` },
            { title: "Di Hatiku Ada Kamu - Episode 6", url: `${STREAM_HOST}/dl/6ae6a040b83c8d1c75dd6ae3` },
            { title: "Di Hatiku Ada Kamu - Episode 7", url: `${STREAM_HOST}/dl/6ae6a040b83c8d1c75dd6ae5` },
            { title: "Di Hatiku Ada Kamu - Episode 8", url: `${STREAM_HOST}/dl/6ae69fddb83c8d1c75dd6ade` },
            { title: "Di Hatiku Ada Kamu - Episode 9", url: `${STREAM_HOST}/dl/6ae69fd8b83c8d1c75dd6add` },
            { title: "Di Hatiku Ada Kamu - Episode 10", url: `${STREAM_HOST}/dl/6ae69fd8b83c8d1c75dd6adc` },
            { title: "Di Hatiku Ada Kamu - Episode 11", url: `${STREAM_HOST}/dl/6ae69fd8b83c8d1c75dd6adb` },
            { title: "Di Hatiku Ada Kamu - Episode 12", url: `${STREAM_HOST}/dl/6ae69fd3b83c8d1c75dd6ada` },
            { title: "Di Hatiku Ada Kamu - Episode 13", url: `${STREAM_HOST}/dl/6ae69fd3b83c8d1c75dd6ad9` },
            { title: "Di Hatiku Ada Kamu - Episode 14", url: `${STREAM_HOST}/dl/6ae69fcdb83c8d1c75dd6ad8` },
            { title: "Di Hatiku Ada Kamu - Episode 15", url: `${STREAM_HOST}/dl/6ae69fcdb83c8d1c75dd6ad7` },
            { title: "Di Hatiku Ada Kamu - Episode 16", url: `${STREAM_HOST}/dl/6ae69fc8b83c8d1c75dd6ad6` },
            { title: "Di Hatiku Ada Kamu - Episode 17", url: `${STREAM_HOST}/dl/6ae69fc8b83c8d1c75dd6ad5` },
            { title: "Di Hatiku Ada Kamu - Episode 18", url: `${STREAM_HOST}/dl/6ae69f9cb83c8d1c75dd6ad4` },
            { title: "Di Hatiku Ada Kamu - Episode 19", url: `${STREAM_HOST}/dl/6ae69f9bb83c8d1c75dd6ad3` },
            { title: "Di Hatiku Ada Kamu - Episode 20", url: `${STREAM_HOST}/dl/6ae69f96b83c8d1c75dd6ad2` },
            { title: "Di Hatiku Ada Kamu - Episode 21", url: `${STREAM_HOST}/dl/6ae69f91b83c8d1c75dd6ad1` },
            { title: "Di Hatiku Ada Kamu - Episode 22", url: `${STREAM_HOST}/dl/6ae69f91b83c8d1c75dd6ad0` },
            { title: "Di Hatiku Ada Kamu - Episode 23", url: `${STREAM_HOST}/dl/6ae69f91b83c8d1c75dd6acf` },
            { title: "Di Hatiku Ada Kamu - Episode 24", url: `${STREAM_HOST}/dl/6ae69f8cb83c8d1c75dd6ace` },
            { title: "Di Hatiku Ada Kamu - Episode 25", url: `${STREAM_HOST}/dl/6ae69f8cb83c8d1c75dd6acd` },
            { title: "Di Hatiku Ada Kamu - Episode 26", url: `${STREAM_HOST}/dl/6ae69f556e979983cdce67c6` }
                    ])
    },
    "aisya_catalog": {
        id: "aisya",
        catalogId: "aisya_catalog",
        name: "AI.5YA",
        poster: "https://i.postimg.cc/HnDrstj8/AI-5YA-DP.jpg",
        background: "https://i.postimg.cc/sxZB9NGD/AI-5YA-WP.jpg",
        description: "Dato' Soffar (lakonan Afdlin Shauki), pemberi dana kepada Jehan, telah mengaturkan pemberian sebuah robot android untuk membantu kerja-kerja penggambaran. Jehan terpaksa mengubah fungsi AI.5YA daripada robot peneman menjadi kru penggambaran dan pelakon pembantu. Apabila video-video mereka menjadi tular (viral) di media sosial, Jehan menghadapi masalah besar dan terpaksa merahsiakan identiti sebenar AI.5YA daripada pengetahuan orang ramai serta saingannya, Maya.",
        episodes: createEpisodes([
            { title: "AI.5YA - Episode 1", url: `${STREAM_HOST}/dl/6ae6ab736e979983cdce67e4` },
            { title: "AI.5YA - Episode 2", url: `${STREAM_HOST}/dl/6ae6ab6e6e979983cdce67e3` }, 
            { title: "AI.5YA - Episode 3", url: `${STREAM_HOST}/dl/6ae6ab6e6e979983cdce67e2` },
            { title: "AI.5YA - Episode 4", url: `${STREAM_HOST}/dl/6ae6ab686e979983cdce67e0` },
            { title: "AI.5YA - Episode 5", url: `${STREAM_HOST}/dl/6ae6ab686e979983cdce67e1` },
            { title: "AI.5YA - Episode 6", url: `${STREAM_HOST}/dl/6ae6ab406e979983cdce67df` },
            { title: "AI.5YA - Episode 7", url: `${STREAM_HOST}/dl/6ae6ab406e979983cdce67de` },
            { title: "AI.5YA - Episode 8", url: `${STREAM_HOST}/dl/6ae6ab3b6e979983cdce67dd` },
            { title: "AI.5YA - Episode 9", url: `${STREAM_HOST}/dl/6ae6ab3b6e979983cdce67dc` },
            { title: "AI.5YA - Episode 10", url: `${STREAM_HOST}/dl/6ae6ab376e979983cdce67db` }
                                ])
    },
    "alter_naratif_catalog": {
        id: "alter_naratif",
        catalogId: "alter_naratif_catalog",
        name: "Alter Naratif",
        poster: "https://i.postimg.cc/yx4DYTWR/Alter-Naratif-DP.jpg",
        background: "https://i.postimg.cc/GtsBJ5T2/Alter-Naratif-WP.jpg",
        description: "Ketua Pegawai Eksekutif EDA, Mel Isa, memperjuangkan teknologi ini sebagai masa depan psikoterapi untuk membantu mangsa trauma membina semula kehidupan mereka. Keadaan berubah apabila Mel mula pitam dan mengalami halusinasi. Dia mula mengesyaki ingatannya sendiri telah diolah atau dimanipulasi.",
        episodes: createEpisodes([
            { title: "Alter-Naratif - Episode 1", url: `${STREAM_HOST}/dl/6ae6a180b83c8d1c75dd6b0f` },
            { title: "Alter-Naratif - Episode 2", url: `${STREAM_HOST}/dl/6ae6a180b83c8d1c75dd6b10` },
            { title: "Alter-Naratif - Episode 3", url: `${STREAM_HOST}/dl/6ae6a180b83c8d1c75dd6b0e` },
            { title: "Alter-Naratif - Episode 4", url: `${STREAM_HOST}/dl/6ae6a14fb83c8d1c75dd6b0d` },
            { title: "Alter-Naratif - Episode 5", url: `${STREAM_HOST}/dl/6ae6a14fb83c8d1c75dd6b0b` },
            { title: "Alter-Naratif - Episode 6", url: `${STREAM_HOST}/dl/6ae6a14fb83c8d1c75dd6b0c` },
            { title: "Alter-Naratif - Episode 7", url: `${STREAM_HOST}/dl/6ae6a149b83c8d1c75dd6b0a` },
            { title: "Alter-Naratif - Episode 8", url: `${STREAM_HOST}/dl/6ae6a149b83c8d1c75dd6b09` }
                                ])
    },
    "anggun_mikayla_catalog": {
        id: "anggun_mikayla",
        catalogId: "anggun_mikayla_catalog",
        name: "Anggun Mikayla",
        poster: "https://i.postimg.cc/NFqKfxL1/Anggun-Mikayla.jpg",
        background: "https://i.postimg.cc/VvbSBV0S/Anggun-Mikayla-WP.jpg",
        description: "Mikayla dipelihara oleh ibu saudaranya, Suraya (Lisdawati), dan sering menghadapi hinaan, ejekan serta dipinggirkan oleh keluarga serta masyarakat sejak kecil kerana latar belakang dan penampilannya yang unik. Tekad untuk mencari kasih sayang seorang ibu membawa Mikayla berpindah ke Kuala Lumpur. Di sana, dia bekerja sebagai jurusolek dan sambilan sebagai 'hantu' di pesta ria milik Uncle Jon.",
        episodes: createEpisodes([
            { title: "Anggun Mikayla - Episode 1", url: `${STREAM_HOST}/dl/6ae6a091b83c8d1c75dd6af0` },
            { title: "Anggun Mikayla - Episode 2", url: `${STREAM_HOST}/dl/6ae6a091b83c8d1c75dd6af3` },
            { title: "Anggun Mikayla - Episode 3", url: `${STREAM_HOST}/dl/6ae6a091b83c8d1c75dd6af1` },
            { title: "Anggun Mikayla - Episode 4", url: `${STREAM_HOST}/dl/6ae6a089b83c8d1c75dd6aee` },
            { title: "Anggun Mikayla - Episode 5", url: `${STREAM_HOST}/dl/6ae6a082b83c8d1c75dd6aed` },
            { title: "Anggun Mikayla - Episode 6", url: `${STREAM_HOST}/dl/6ae6a08cb83c8d1c75dd6aef` },
            { title: "Anggun Mikayla - Episode 7", url: `${STREAM_HOST}/dl/6ae6a057b83c8d1c75dd6aea` },
            { title: "Anggun Mikayla - Episode 8", url: `${STREAM_HOST}/dl/6ae6a050b83c8d1c75dd6ae9` },
            { title: "Anggun Mikayla - Episode 9", url: `${STREAM_HOST}/dl/6ae6a081b83c8d1c75dd6aec` },
            { title: "Anggun Mikayla - Episode 10", url: `${STREAM_HOST}/dl/6ae6a081b83c8d1c75dd6aeb` },
            { title: "Anggun Mikayla - Episode 11", url: `${STREAM_HOST}/dl/6ae6a050b83c8d1c75dd6ae8` },
            { title: "Anggun Mikayla - Episode 12", url: `${STREAM_HOST}/dl/6ae6a045b83c8d1c75dd6ae6` },
            { title: "Anggun Mikayla - Episode 13", url: `${STREAM_HOST}/dl/6ae6a046b83c8d1c75dd6ae7` }
         ])
    },
    "ijab_kabut_catalog": {
        id: "ijab_kabut",
        catalogId: "ijab_kabut_catalog",
        name: "Ijab Kabut",
        poster: "https://i.postimg.cc/mkfP2ShF/Ijab-Kabut-DP.jpg",
        background: "https://i.postimg.cc/VvbSBV0S/Anggun-Mikayla-WP.jpg",
        description: "Deanna (lakonan Azira Shafinaz), seorang penerbit muzik yang bercita-cita tinggi, kompetitif dan amat menitikberatkan kesempurnaan. Dia merancang untuk mengadakan sebuah majlis perkahwinan impian yang serba lengkap dengan perancang perkahwinan, katering, serta sebuah band. Namun, situasi menjadi huru-hara apabila tunangnya secara tiba-tiba memutuskan pertunangan mereka. Tidak mahu mengaku kalah atau membatalkan majlis yang telah dirancang, Deanna berdegil untuk meneruskan perkahwinan tersebut dan berazam mencari sesiapa sahaja lelaki yang sudi menjadi pengantin lelakinya.",
        episodes: createEpisodes([
            { title: "Ijab Kabut - Episode 1", url: `${STREAM_HOST}/dl/6ae6ab356e979983cdce67da` },
            { title: "Ijab Kabut - Episode 2", url: `${STREAM_HOST}/dl/6ae6ab326e979983cdce67d8` },
            { title: "Ijab Kabut - Episode 3", url: `${STREAM_HOST}/dl/6ae6ab356e979983cdce67d9` },
            { title: "Ijab Kabut - Episode 4", url: `${STREAM_HOST}/dl/6ae6ab326e979983cdce67d7` },
            { title: "Ijab Kabut - Episode 5", url: `${STREAM_HOST}/dl/6ae6ab306e979983cdce67d5` },
            { title: "Ijab Kabut - Episode 6", url: `${STREAM_HOST}/dl/6ae6ab006e979983cdce67d4` },
            { title: "Ijab Kabut - Episode 7", url: `${STREAM_HOST}/dl/6ae6ab306e979983cdce67d6` },
            { title: "Ijab Kabut - Episode 8", url: `${STREAM_HOST}/dl/6ae6ab006e979983cdce67d3` },
            { title: "Ijab Kabut - Episode 9", url: `${STREAM_HOST}/dl/6ae6aafa6e979983cdce67d2` },
            { title: "Ijab Kabut - Episode 10", url: `${STREAM_HOST}/dl/6ae6aafa6e979983cdce67d1` }
                                ])
    },
    "gadis_masa_catalog": {
        id: "gadis_masa",
        catalogId: "gadis_masa_catalog",
        name: "Gadis Masa",
        poster: "https://i.postimg.cc/5yFHqRQz/Gadis-Masa-DP.jpg",
        background: "https://i.postimg.cc/br2GHBS2/Gadis-Masa-WP.jpg",
        description: "Dalam keadaan berduka dan terdesak untuk mengubah takdir, Maya secara tidak sengaja menemui sebuah payung misteri (kenang-kenangan zaman mereka bercinta) yang mempunyai kuasa ajaib untuk membawanya kembali ke masa lalu—iaitu ke saat-saat dia dan Khairi mula-mula bertemu. Maya berusaha pelbagai cara untuk membetulkan kesilapan lalu dan menyelamatkan rumah tangganya (atau memastikan mereka tidak bertemu supaya Khairi terselamat daripada kemalangan). Walau bagaimanapun, setiap tindakan atau perubahan yang dilakukannya di masa lalu membawa pelbagai akibat lucu, tidak dijangka, dan penuh kekeliruan.",
        episodes: createEpisodes([
            { title: "Gadis Masa - Episode 1", url: `${STREAM_HOST}/dl/6ae69f53b83c8d1c75dd6acc` },
            { title: "Gadis Masa - Episode 2", url: `${STREAM_HOST}/dl/6ae69f4b6e979983cdce67bf` },
            { title: "Gadis Masa - Episode 3", url: `${STREAM_HOST}/dl/6ae69f4b6e979983cdce67c1` },
            { title: "Gadis Masa - Episode 4", url: `${STREAM_HOST}/dl/6ae69f556e979983cdce67c5` },
            { title: "Gadis Masa - Episode 5", url: `${STREAM_HOST}/dl/6ae69f4b6e979983cdce67c3` },
            { title: "Gadis Masa - Episode 6", url: `${STREAM_HOST}/dl/6ae69f4b6e979983cdce67c4` },
            { title: "Gadis Masa - Episode 7", url: `${STREAM_HOST}/dl/6ae69f4b6e979983cdce67c0` },
            { title: "Gadis Masa - Episode 8", url: `${STREAM_HOST}/dl/6ae69f4b6e979983cdce67c2` }
        ])
    },
    "projek_catalog": {
        id: "projek",
        catalogId: "projek_catalog",
        name: "Project High Council",
        poster: "https://i.postimg.cc/ydL63rxW/PHC-DP.jpg",
        background: "https://i.postimg.cc/SKWJRrcg/PHC-WP.webp",
        backgroundShape: "Landscape",
        description: "Kisah bermula apabila Fakhri, seorang pelajar berusia 15 tahun yang bijak tetapi panas baran dan sering terlibat dalam pergaduhan, diterima masuk ke KUDRAT dengan azam untuk mengubah dirinya menjadi lebih baik. Di sekolah tersebut, dia tanpa diduga bertemu semula dengan abang kandung yang telah lama terpisah sejak kecil akibat perceraian ibu bapa mereka, iaitu Naim.",
        episodes: createEpisodes([  
            { title: "Projek High Council Episode 1", url: `${STREAM_HOST}/dl/6ade6ca76e979983cdce62d5` },
            { title: "Projek High Council Episode 2", url: `${STREAM_HOST}/dl/6ade6cb06e979983cdce62d9` },
            { title: "Projek High Council Episode 3", url: `${STREAM_HOST}/dl/6ade6cb06e979983cdce62d7` },
            { title: "Projek High Council Episode 4", url: `${STREAM_HOST}/dl/6ade6cb06e979983cdce62d6` },
            { title: "Projek High Council Episode 5", url: `${STREAM_HOST}/dl/6ade6cb06e979983cdce62d8` },
            { title: "Projek High Council Episode 6", url: `${STREAM_HOST}/dl/6ade6ca76e979983cdce62d1` },
            { title: "Projek High Council Episode 7", url: `${STREAM_HOST}/dl/6ade6ca76e979983cdce62d3` },
            { title: "Projek High Council Episode 8", url: `${STREAM_HOST}/dl/6ade6ca76e979983cdce62d0` },
            { title: "Projek High Council Episode 9", url: `${STREAM_HOST}/dl/6ade6ca76e979983cdce62d2` },
            { title: "Projek High Council Episode 10", url: `${STREAM_HOST}/dl/6ade6ca76e979983cdce62d4` }
        ])
    },
    "shark2_catalog": {
        id: "shark2",
        catalogId: "shark2_catalog",
        name: "Shark: The Storm 2",
        poster: "https://i.postimg.cc/QtT1kjHD/Shark-The-Storm-2.webp",
        background: "https://i.postimg.cc/vBVfLGcs/Shark-2-WP.jpg",
        backgroundShape: "Landscape",
        description: "Ketenangan hidupnya terganggu apabila dia berdepan dengan Hyun Woo Yong (dilakonkan oleh Lee Hyun-wook), seorang pemimpin kejam yang mengendalikan liga pertarungan haram tanpa aturan. Woo Yong cuba menarik Woo Sol ke dalam dunia laga bawah tanah tersebut. Konflik menjadi semakin runcing apabila rakan-rakan serta insan yang bererti dalam hidup Woo Sol turut menjadi sasaran.",
        episodes: createEpisodes([  
            { title: "shark_the_storm_2025_ep_01", name: "Shark The Storm 2025 EP01", url: `${STREAM_HOST}/dl/6ae28209dcedf6ab20755972` },
            { title: "shark_the_storm_2025_ep_02", name: "Shark The Storm 2025 EP02", url: `${STREAM_HOST}/dl/6ae28216dcedf6ab20755975` },
            { title: "shark_the_storm_2025_ep_03", name: "Shark The Storm 2025 EP03", url: `${STREAM_HOST}/dl/6ae28212dcedf6ab20755974` },
            { title: "shark_the_storm_2025_ep_04", name: "Shark The Storm 2025 EP04", url: `${STREAM_HOST}/dl/6ae2820edcedf6ab20755973` },
            { title: "shark_the_storm_2025_ep_05", name: "Shark The Storm 2025 EP05", url: `${STREAM_HOST}/dl/6ae2821bdcedf6ab20755976` },
            { title: "shark_the_storm_2025_ep_06", name: "Shark The Storm 2025 EP06", url: `${STREAM_HOST}/dl/6ae28205dcedf6ab20755971` }
        ])
    },
    "oddbods_catalog": {
        id: "oddbods",
        catalogId: "oddbods_catalog",
        name: "Oddbods",
        poster: "https://i.postimg.cc/LswFdKJB/ODD-DP.jpg",
        background: "https://i.postimg.cc/hG6RFWX8/ODD-WP.webp",
        backgroundShape: "Landscape",
        description: "Oddbods is an award-winning sketch-based series following the adventures of seven adorable characters as they laugh, fool, and trip their way through the most seemingly ordinary situations, often with unexpected consequences. Comedy that appeals to both children and adults. After all, there's a little odd in everyone!.",
        episodes: createEpisodes([ 
            { title: "Oddbods Episode 1", url: `${STREAM_HOST}/dl/6adc95c16e979983cdce619d` },
            { title: "Oddbods Episode 2", url: `${STREAM_HOST}/dl/6adc95c16e979983cdce619c` },
            { title: "Oddbods Episode 3", url: `${STREAM_HOST}/dl/6adc95c16e979983cdce619e` },
            { title: "Oddbods Episode 4", url: `${STREAM_HOST}/dl/6adc95c16e979983cdce619a` },
            { title: "Oddbods Episode 5", url: `${STREAM_HOST}/dl/6adc95c16e979983cdce619b` },
            { title: "Oddbods Episode 6", url: `${STREAM_HOST}/dl/6adc95c16e979983cdce619f` },
            { title: "Oddbods Episode 7", url: `${STREAM_HOST}/dl/6adc95cc6e979983cdce61a0` },
            { title: "Oddbods Episode 8", url: `${STREAM_HOST}/dl/6adc95cc6e979983cdce61a2` },
            { title: "Oddbods Episode 9", url: `${STREAM_HOST}/dl/6adc95cc6e979983cdce61a1` },
            { title: "Oddbods Episode 10", url: `${STREAM_HOST}/dl/6adc95cc6e979983cdce61a3` },
            { title: "Oddbods Episode 11", url: `${STREAM_HOST}/dl/6adc95f06e979983cdce61a5` },
            { title: "Oddbods Episode 12", url: `${STREAM_HOST}/dl/6adc95f06e979983cdce61a9` },
            { title: "Oddbods Episode 13", url: `${STREAM_HOST}/dl/6adc95f06e979983cdce61a7` },
            { title: "Oddbods Episode 14", url: `${STREAM_HOST}/dl/6adc95f06e979983cdce61a8` },
            { title: "Oddbods Episode 15", url: `${STREAM_HOST}/dl/6adc95f06e979983cdce61a6` },
            { title: "Oddbods Episode 16", url: `${STREAM_HOST}/dl/6adc95f06e979983cdce61a4` },
            { title: "Oddbods Episode 17", url: `${STREAM_HOST}/dl/6adc96056e979983cdce61aa` },
            { title: "Oddbods Episode 18", url: `${STREAM_HOST}/dl/6adc960a6e979983cdce61ab` },
            { title: "Oddbods Episode 19", url: `${STREAM_HOST}/dl/6adc960a6e979983cdce61ac` },
            { title: "Oddbods Episode 20", url: `${STREAM_HOST}/dl/6adc960f6e979983cdce61ad` },
            { title: "Oddbods Episode 21", url: `${STREAM_HOST}/dl/6adc96176e979983cdce61b0` },
            { title: "Oddbods Episode 22", url: `${STREAM_HOST}/dl/6adc96176e979983cdce61b1` },
            { title: "Oddbods Episode 23", url: `${STREAM_HOST}/dl/6adc96176e979983cdce61b3` },
            { title: "Oddbods Episode 24", url: `${STREAM_HOST}/dl/6adc96176e979983cdce61af` },
            { title: "Oddbods Episode 25", url: `${STREAM_HOST}/dl/6adc96176e979983cdce61b2` },
            { title: "Oddbods Episode 26", url: `${STREAM_HOST}/dl/6adc96176e979983cdce61ae` },
            { title: "Oddbods Episode 27", url: `${STREAM_HOST}/dl/6adc96466e979983cdce61b5` },
            { title: "Oddbods Episode 28", url: `${STREAM_HOST}/dl/6adc96466e979983cdce61b4` },
            { title: "Oddbods Episode 29", url: `${STREAM_HOST}/dl/6adc96466e979983cdce61b6` },
            { title: "Oddbods Episode 30", url: `${STREAM_HOST}/dl/6adc96466e979983cdce61b7` },
            { title: "Oddbods Episode 31", url: `${STREAM_HOST}/dl/6adc967a6e979983cdce61ba` },
            { title: "Oddbods Episode 32", url: `${STREAM_HOST}/dl/6adc967a6e979983cdce61bc` },
            { title: "Oddbods Episode 33", url: `${STREAM_HOST}/dl/6adc967a6e979983cdce61bd` },
            { title: "Oddbods Episode 34", url: `${STREAM_HOST}/dl/6adc967a6e979983cdce61b9` },
            { title: "Popcorn Summer", url: `${STREAM_HOST}/dl/6adc967a6e979983cdce61b8` },
            { title: "Scream Apocalypse", url: `${STREAM_HOST}/dl/6adc967a6e979983cdce61bb` },
            { title: "Uninvited Guess", url: `${STREAM_HOST}/dl/6adc96876e979983cdce61bf` },
            { title: "The Festive Menace", url: `${STREAM_HOST}/dl/6adc96826e979983cdce61be` }
        ])
    },
    "baby_oddbods_catalog": {
        id: "baby_oddbods",
        catalogId: "baby_oddbods_catalog",
        name: "Baby Oddbods",
        poster: "https://i.postimg.cc/63ZJtjZF/Odd-Mini-DP.jpg",
        background: "https://i.postimg.cc/j5f0tgNK/Odd-Mini-WP.jpg",
        backgroundShape: "Landscape",
        description: "Welcome to the fantastical Land of Odd, home to the Minibods. Join six furry little friends as they get up to hilarious mayhem, turning everyday situations into unexpected, super silly events. Whatever life throws their way, the Minibods overcome hurdles the unconventional way, to better understand themselves and the world around them!.",
        episodes: createEpisodes([ 
            { title: "Breakfast In Bed - Mother's Day Special", url: `${STREAM_HOST}/dl/6adc98d36e979983cdce61c4` },
            { title: "First Day At Daycare - Oddbods Baby", url: `${STREAM_HOST}/dl/6adc98d36e979983cdce61c1` },
            { title: "Dad Knows Best - Father's Day Special", url: `${STREAM_HOST}/dl/6adc98d36e979983cdce61c2` },
            { title: "At School", url: `${STREAM_HOST}/dl/6adc98d36e979983cdce61c5` },
            { title: "Back To School", url: `${STREAM_HOST}/dl/6adc98d36e979983cdce61c0` },
            { title: "Easter Chocolate Bunnies", url: `${STREAM_HOST}/dl/6adc98d36e979983cdce61c3` },
            { title: "Go Fishing For The First Time", url: `${STREAM_HOST}/dl/6adc98db6e979983cdce61c6` },
            { title: "Jump", url: `${STREAM_HOST}/dl/6adc98db6e979983cdce61c7` },
            { title: "Karate", url: `${STREAM_HOST}/dl/6adc98db6e979983cdce61c8` },
            { title: "Learn Online", url: `${STREAM_HOST}/dl/6adc98db6e979983cdce61c9` },
            { title: "Lulu's Superhero", url: `${STREAM_HOST}/dl/6adc98ec6e979983cdce61ca` }
        ])
    },
    "oggy1_catalog": {
        id: "oggy1",
        catalogId: "oggy1_catalog",
        name: "Oggy and The Cockroaches Season 1",
        poster: "https://i.postimg.cc/dtpC19rv/oggy-s1.jpg",
        background: "https://i.postimg.cc/CLX814kS/Oggy-WP.jpg",
        backgroundShape: "Landscape",
        description: " Oggy, seekor kucing berwarna biru yang sangat gemar bersenang-lenang, menonton televisyen, dan menjaga kebersihan rumahnya. Namun, kehidupannya yang aman sentiasa huru-hara disebabkan oleh tiga ekor lipas yang tinggal di dalam rumahnya iaitu Joey, Dee Dee, dan Marky. Lipas-lipas ini sering mencuri makanan di dalam peti sejuk, merosakkan perabot, dan merancang pelbagai helah nakal untuk menyeksa Oggy.",
        episodes: createEpisodes([ 
            { title: "Episode 01" , url: `${STREAM_HOST}/dl/6ae3d6096e979983cdce64fe` },
            { title: "Episode 02" , url: `${STREAM_HOST}/dl/6ae3d68e6e979983cdce6516` },
            { title: "Episode 03" , url: `${STREAM_HOST}/dl/6ae3d7046e979983cdce6528` },
            { title: "Episode 04" , url: `${STREAM_HOST}/dl/6ae3d5d16e979983cdce64f3` },
            { title: "Episode 05" , url: `${STREAM_HOST}/dl/6ae3d58c6e979983cdce64e6` },
            { title: "Episode 06" , url: `${STREAM_HOST}/dl/6ae3d6886e979983cdce6513` },
            { title: "Episode 07" , url: `${STREAM_HOST}/dl/6ae3d6c26e979983cdce651c` },
            { title: "Episode 08" , url: `${STREAM_HOST}/dl/6ae3d60f6e979983cdce6500` },
            { title: "Episode 09" , url: `${STREAM_HOST}/dl/6ae3d6936e979983cdce6519` },
            { title: "Episode 10" , url: `${STREAM_HOST}/dl/6ae3d5d66e979983cdce64f7` },
            { title: "Episode 11" , url: `${STREAM_HOST}/dl/6ae3d6936e979983cdce6518` },
            { title: "Episode 12" , url: `${STREAM_HOST}/dl/6ae3d5d16e979983cdce64f4` },
            { title: "Episode 13" , url: `${STREAM_HOST}/dl/6ae3d7006e979983cdce6527` },
            { title: "Episode 14" , url: `${STREAM_HOST}/dl/6ae3d6826e979983cdce6511` },
            { title: "Episode 15" , url: `${STREAM_HOST}/dl/6ae3d6c26e979983cdce651b` },
            { title: "Episode 16" , url: `${STREAM_HOST}/dl/6ae3d5946e979983cdce64e9` },
            { title: "Episode 17" , url: `${STREAM_HOST}/dl/6ae3d6146e979983cdce6502` },
            { title: "Episode 18" , url: `${STREAM_HOST}/dl/6ae3d5e26e979983cdce64fa` },
            { title: "Episode 19" , url: `${STREAM_HOST}/dl/6ae3d6fa6e979983cdce6524` },
            { title: "Episode 20" , url: `${STREAM_HOST}/dl/6ae3d70f6e979983cdce652c` },
            { title: "Episode 21" , url: `${STREAM_HOST}/dl/6ae3d58c6e979983cdce64e8` },
            { title: "Episode 22" , url: `${STREAM_HOST}/dl/6ae3d58c6e979983cdce64e7` },
            { title: "Episode 23" , url: `${STREAM_HOST}/dl/6ae3d5e26e979983cdce64fb` },
            { title: "Episode 24" , url: `${STREAM_HOST}/dl/6ae3d6896e979983cdce6514` },
            { title: "Episode 25" , url: `${STREAM_HOST}/dl/6ae3d7066e979983cdce6529` },
            { title: "Episode 26" , url: `${STREAM_HOST}/dl/6ae3d58c6e979983cdce64e3` },
            { title: "Episode 27" , url: `${STREAM_HOST}/dl/6ae3d68d6e979983cdce6515` },
            { title: "Episode 28" , url: `${STREAM_HOST}/dl/6ae3d65a6e979983cdce650f` },
            { title: "Episode 29" , url: `${STREAM_HOST}/dl/6ae3d60f6e979983cdce64ff` },
            { title: "Episode 30" , url: `${STREAM_HOST}/dl/6ae3d6826e979983cdce6510` },
            { title: "Episode 31" , url: `${STREAM_HOST}/dl/6ae3d5dc6e979983cdce64f8` },
            { title: "Episode 32" , url: `${STREAM_HOST}/dl/6ae3d6496e979983cdce6507` },
            { title: "Episode 33" , url: `${STREAM_HOST}/dl/6ae3d68e6e979983cdce6517` },
            { title: "Episode 34" , url: `${STREAM_HOST}/dl/6ae3d58c6e979983cdce64e5` },
            { title: "Episode 35" , url: `${STREAM_HOST}/dl/6ae3d70a6e979983cdce652b` },
            { title: "Episode 36" , url: `${STREAM_HOST}/dl/6ae3d6cd6e979983cdce6520` },
            { title: "Episode 37" , url: `${STREAM_HOST}/dl/6ae3d6ff6e979983cdce6526` },
            { title: "Episode 38" , url: `${STREAM_HOST}/dl/6ae3d5956e979983cdce64ec` },
            { title: "Episode 39" , url: `${STREAM_HOST}/dl/6ae3d7366e979983cdce652e` },
            { title: "Episode 40" , url: `${STREAM_HOST}/dl/6ae3d58c6e979983cdce64e4` },
            { title: "Episode 41" , url: `${STREAM_HOST}/dl/6ae3d6cd6e979983cdce6522` },
            { title: "Episode 42" , url: `${STREAM_HOST}/dl/6ae3d59b6e979983cdce64ee` },
            { title: "Episode 43" , url: `${STREAM_HOST}/dl/6ae3d5a16e979983cdce64ef` },
            { title: "Episode 44" , url: `${STREAM_HOST}/dl/6ae3d5cc6e979983cdce64f1` },
            { title: "Episode 45" , url: `${STREAM_HOST}/dl/6ae3d5dc6e979983cdce64f9` },
            { title: "Episode 46" , url: `${STREAM_HOST}/dl/6ae3d6146e979983cdce6503` },
            { title: "Episode 47" , url: `${STREAM_HOST}/dl/6ae3d6196e979983cdce6505` },
            { title: "Episode 48" , url: `${STREAM_HOST}/dl/6ae3d6886e979983cdce6512` },
            { title: "Episode 49" , url: `${STREAM_HOST}/dl/6ae3d6c86e979983cdce651f` },
            { title: "Episode 50" , url: `${STREAM_HOST}/dl/6ae3d64f6e979983cdce650a` },
            { title: "Episode 51" , url: `${STREAM_HOST}/dl/6ae3d7376e979983cdce652f` },
            { title: "Episode 52" , url: `${STREAM_HOST}/dl/6ae3d5d66e979983cdce64f6` },
            { title: "Episode 53" , url: `${STREAM_HOST}/dl/6ae3d6086e979983cdce64fc` },
            { title: "Episode 54" , url: `${STREAM_HOST}/dl/6ae3d6c76e979983cdce651e` },
            { title: "Episode 55" , url: `${STREAM_HOST}/dl/6ae3d6936e979983cdce651a` },
            { title: "Episode 56" , url: `${STREAM_HOST}/dl/6ae3d5956e979983cdce64eb` },
            { title: "Episode 57" , url: `${STREAM_HOST}/dl/6ae3d5956e979983cdce64ea` },
            { title: "Episode 58" , url: `${STREAM_HOST}/dl/6ae3d5d16e979983cdce64f5` },
            { title: "Episode 59" , url: `${STREAM_HOST}/dl/6ae3d59b6e979983cdce64ed` },
            { title: "Episode 60" , url: `${STREAM_HOST}/dl/6ae3d5a16e979983cdce64f0` },
            { title: "Episode 61" , url: `${STREAM_HOST}/dl/6ae3d5d06e979983cdce64f2` },
            { title: "Episode 62" , url: `${STREAM_HOST}/dl/6ae3d6086e979983cdce64fd` },
            { title: "Episode 63" , url: `${STREAM_HOST}/dl/6ae3d6496e979983cdce6506` },
            { title: "Episode 64" , url: `${STREAM_HOST}/dl/6ae3d6546e979983cdce650e` },
            { title: "Episode 65" , url: `${STREAM_HOST}/dl/6ae3d6c76e979983cdce651d` },
            { title: "Episode 66" , url: `${STREAM_HOST}/dl/6ae3d6fe6e979983cdce6525` },
            { title: "Episode 67" , url: `${STREAM_HOST}/dl/6ae3d6196e979983cdce6504` },
            { title: "Episode 68" , url: `${STREAM_HOST}/dl/6ae3d6136e979983cdce6501` },
            { title: "Episode 69" , url: `${STREAM_HOST}/dl/6ae3d64e6e979983cdce6508` },
            { title: "Episode 70" , url: `${STREAM_HOST}/dl/6ae3d6546e979983cdce650b` },
            { title: "Episode 71" , url: `${STREAM_HOST}/dl/6ae3d6546e979983cdce650c` },
            { title: "Episode 72" , url: `${STREAM_HOST}/dl/6ae3d6546e979983cdce650d` },
            { title: "Episode 73" , url: `${STREAM_HOST}/dl/6ae3d6cd6e979983cdce6521` },
            { title: "Episode 74" , url: `${STREAM_HOST}/dl/6ae3d6d26e979983cdce6523` },
            { title: "Episode 75" , url: `${STREAM_HOST}/dl/6ae3d70a6e979983cdce652a` },
            { title: "Episode 76" , url: `${STREAM_HOST}/dl/6ae3d70f6e979983cdce652d` },
            { title: "Episode 77" , url: `${STREAM_HOST}/dl/6ae3d64f6e979983cdce6509` }

        ])
    },
    "oggy2_catalog": {
        id: "oggy2",
        catalogId: "oggy2_catalog",
        name: "Oggy and The Cockroaches Season 2",
        poster: "https://i.postimg.cc/qMSKRGyH/oggy2.jpg",
        background: "https://i.postimg.cc/CLX814kS/Oggy-WP.jpg",
        backgroundShape: "Landscape",
        description: " Oggy, seekor kucing berwarna biru yang sangat gemar bersenang-lenang, menonton televisyen, dan menjaga kebersihan rumahnya. Namun, kehidupannya yang aman sentiasa huru-hara disebabkan oleh tiga ekor lipas yang tinggal di dalam rumahnya iaitu Joey, Dee Dee, dan Marky. Lipas-lipas ini sering mencuri makanan di dalam peti sejuk, merosakkan perabot, dan merancang pelbagai helah nakal untuk menyeksa Oggy.",
        episodes: createEpisodes([ 
            { title: "Episode 01" , url: `${STREAM_HOST}/dl/6ae3db7b6e979983cdce6555` },
            { title: "Episode 02" , url: `${STREAM_HOST}/dl/6ae3db866e979983cdce655b` },
            { title: "Episode 03" , url: `${STREAM_HOST}/dl/6ae3dac76e979983cdce6539` },
            { title: "Episode 04" , url: `${STREAM_HOST}/dl/6ae3dc306e979983cdce6573` },
            { title: "Episode 05" , url: `${STREAM_HOST}/dl/6ae3dad26e979983cdce653c` },
            { title: "Episode 06" , url: `${STREAM_HOST}/dl/6ae3dbef6e979983cdce6567` },
            { title: "Episode 07" , url: `${STREAM_HOST}/dl/6ae3dbf56e979983cdce656a` },
            { title: "Episode 08" , url: `${STREAM_HOST}/dl/6ae3db096e979983cdce6543` },
            { title: "Episode 09" , url: `${STREAM_HOST}/dl/6ae3db406e979983cdce654b` },
            { title: "Episode 10" , url: `${STREAM_HOST}/dl/6ae3dc3b6e979983cdce657a` },
            { title: "Episode 11" , url: `${STREAM_HOST}/dl/6ae3db4b6e979983cdce6551` },
            { title: "Episode 12" , url: `${STREAM_HOST}/dl/6ae3db096e979983cdce6546` },
            { title: "Episode 13" , url: `${STREAM_HOST}/dl/6ae3dc6d6e979983cdce657c` },
            { title: "Episode 14" , url: `${STREAM_HOST}/dl/6ae3dac76e979983cdce6537` },
            { title: "Episode 15" , url: `${STREAM_HOST}/dl/6ae3db816e979983cdce6558` },
            { title: "Episode 16" , url: `${STREAM_HOST}/dl/6ae3db4b6e979983cdce6550` },
            { title: "Episode 17" , url: `${STREAM_HOST}/dl/6ae3dc3b6e979983cdce6579` },
            { title: "Episode 18" , url: `${STREAM_HOST}/dl/6ae3dbfa6e979983cdce656c` },
            { title: "Episode 19" , url: `${STREAM_HOST}/dl/6ae3db7b6e979983cdce6556` },
            { title: "Episode 20" , url: `${STREAM_HOST}/dl/6ae3dac76e979983cdce6538` },
            { title: "Episode 21" , url: `${STREAM_HOST}/dl/6ae3dacd6e979983cdce653a` },
            { title: "Episode 22" , url: `${STREAM_HOST}/dl/6ae3dbb96e979983cdce655f` },
            { title: "Episode 23" , url: `${STREAM_HOST}/dl/6ae3dbb36e979983cdce655d` },
            { title: "Episode 24" , url: `${STREAM_HOST}/dl/6ae3dbf46e979983cdce6568` },
            { title: "Episode 25" , url: `${STREAM_HOST}/dl/6ae3dbc46e979983cdce6563` },
            { title: "Episode 26" , url: `${STREAM_HOST}/dl/6ae3db0e6e979983cdce6548` },
            { title: "Episode 27" , url: `${STREAM_HOST}/dl/6ae3db776e979983cdce6553` },
            { title: "Episode 28" , url: `${STREAM_HOST}/dl/6ae3dbc96e979983cdce6566` },
            { title: "Episode 29" , url: `${STREAM_HOST}/dl/6ae3dc686e979983cdce657b` },
            { title: "Episode 30" , url: `${STREAM_HOST}/dl/6ae3dc2b6e979983cdce6571` },
            { title: "Episode 31" , url: `${STREAM_HOST}/dl/6ae3db3f6e979983cdce6549` },
            { title: "Episode 32" , url: `${STREAM_HOST}/dl/6ae3db036e979983cdce6542` },
            { title: "Episode 33" , url: `${STREAM_HOST}/dl/6ae3db816e979983cdce6557` },
            { title: "Episode 34" , url: `${STREAM_HOST}/dl/6ae3dc306e979983cdce6574` },
            { title: "Episode 35" , url: `${STREAM_HOST}/dl/6ae3dbf56e979983cdce6569` },
            { title: "Episode 36" , url: `${STREAM_HOST}/dl/6ae3dc3b6e979983cdce6578` },
            { title: "Episode 37" , url: `${STREAM_HOST}/dl/6ae3dafe6e979983cdce6540` },
            { title: "Episode 38" , url: `${STREAM_HOST}/dl/6ae3db406e979983cdce654c` },
            { title: "Episode 39" , url: `${STREAM_HOST}/dl/6ae3dbf66e979983cdce656b` },
            { title: "Episode 40" , url: `${STREAM_HOST}/dl/6ae3db4a6e979983cdce654f` },
            { title: "Episode 41" , url: `${STREAM_HOST}/dl/6ae3db866e979983cdce655a` },
            { title: "Episode 42" , url: `${STREAM_HOST}/dl/6ae3dc016e979983cdce656f` },
            { title: "Episode 43" , url: `${STREAM_HOST}/dl/6ae3dafe6e979983cdce653f` },
            { title: "Episode 44" , url: `${STREAM_HOST}/dl/6ae3db506e979983cdce6552` },
            { title: "Episode 45" , url: `${STREAM_HOST}/dl/6ae3dad36e979983cdce653d` },
            { title: "Episode 46" , url: `${STREAM_HOST}/dl/6ae3dc366e979983cdce6575` },
            { title: "Episode 47" , url: `${STREAM_HOST}/dl/6ae3dbc56e979983cdce6565` },
            { title: "Episode 48" , url: `${STREAM_HOST}/dl/6ae3dc6e6e979983cdce657d` },
            { title: "Episode 49" , url: `${STREAM_HOST}/dl/6ae3dacd6e979983cdce653b` },
            { title: "Episode 50" , url: `${STREAM_HOST}/dl/6ae3dc366e979983cdce6576` },
            { title: "Episode 51" , url: `${STREAM_HOST}/dl/6ae3db3f6e979983cdce654a` },
            { title: "Episode 52" , url: `${STREAM_HOST}/dl/6ae3db776e979983cdce6554` },
            { title: "Episode 53" , url: `${STREAM_HOST}/dl/6ae3dc2b6e979983cdce6572` },
            { title: "Episode 54" , url: `${STREAM_HOST}/dl/6ae3dafe6e979983cdce653e` },
            { title: "Episode 55" , url: `${STREAM_HOST}/dl/6ae3db096e979983cdce6545` },
            { title: "Episode 56" , url: `${STREAM_HOST}/dl/6ae3dc006e979983cdce656e` },
            { title: "Episode 57" , url: `${STREAM_HOST}/dl/6ae3db096e979983cdce6544` },
            { title: "Episode 58" , url: `${STREAM_HOST}/dl/6ae3db456e979983cdce654d` },
            { title: "Episode 59" , url: `${STREAM_HOST}/dl/6ae3dbb96e979983cdce6560` },
            { title: "Episode 60" , url: `${STREAM_HOST}/dl/6ae3db876e979983cdce655c` },
            { title: "Episode 61" , url: `${STREAM_HOST}/dl/6ae3dbbf6e979983cdce6561` },
            { title: "Episode 62" , url: `${STREAM_HOST}/dl/6ae3dbfa6e979983cdce656d` },
            { title: "Episode 63" , url: `${STREAM_HOST}/dl/6ae3dc2b6e979983cdce6570` },
            { title: "Episode 64" , url: `${STREAM_HOST}/dl/6ae3dc3b6e979983cdce6577` },
            { title: "Episode 65" , url: `${STREAM_HOST}/dl/6ae3dbbf6e979983cdce6562` },
            { title: "Episode 66" , url: `${STREAM_HOST}/dl/6ae3dafe6e979983cdce6541` },
            { title: "Episode 67" , url: `${STREAM_HOST}/dl/6ae3db866e979983cdce6559` },
            { title: "Episode 68" , url: `${STREAM_HOST}/dl/6ae3dbb36e979983cdce655e` },
            { title: "Episode 69" , url: `${STREAM_HOST}/dl/6ae3db456e979983cdce654e` },
            { title: "Episode 70" , url: `${STREAM_HOST}/dl/6ae3dac76e979983cdce6536` },
            { title: "Episode 71" , url: `${STREAM_HOST}/dl/6ae3db0e6e979983cdce6547` },
            { title: "Episode 72" , url: `${STREAM_HOST}/dl/6ae3dbc56e979983cdce6564` }
        ])
    },
    "oggy3_catalog": {
        id: "oggy3",
        catalogId: "oggy3_catalog",
        name: "Oggy and The Cockroaches Season 3",
        poster: "https://i.postimg.cc/rF34m9xL/oggy3.jpg",
        background: "https://i.postimg.cc/CLX814kS/Oggy-WP.jpg",
        backgroundShape: "Landscape",
        description: " Oggy, seekor kucing berwarna biru yang sangat gemar bersenang-lenang, menonton televisyen, dan menjaga kebersihan rumahnya. Namun, kehidupannya yang aman sentiasa huru-hara disebabkan oleh tiga ekor lipas yang tinggal di dalam rumahnya iaitu Joey, Dee Dee, dan Marky. Lipas-lipas ini sering mencuri makanan di dalam peti sejuk, merosakkan perabot, dan merancang pelbagai helah nakal untuk menyeksa Oggy.",
        episodes: createEpisodes([ 
            { title: "Episode 01" , url: `${STREAM_HOST}/dl/6ae3de6f6e979983cdce657e` },
            { title: "Episode 02" , url: `${STREAM_HOST}/dl/6ae3de6f6e979983cdce6581` },
            { title: "Episode 03" , url: `${STREAM_HOST}/dl/6ae3deec6e979983cdce6598` },
            { title: "Episode 04" , url: `${STREAM_HOST}/dl/6ae3de6f6e979983cdce6583` },
            { title: "Episode 05" , url: `${STREAM_HOST}/dl/6ae3deb96e979983cdce6591` },
            { title: "Episode 06" , url: `${STREAM_HOST}/dl/6ae3de786e979983cdce6585` },
            { title: "Episode 07" , url: `${STREAM_HOST}/dl/6ae3def26e979983cdce659a` },
            { title: "Episode 08" , url: `${STREAM_HOST}/dl/6ae3def76e979983cdce659e` },
            { title: "Episode 09" , url: `${STREAM_HOST}/dl/6ae3df2e6e979983cdce65a1` },
            { title: "Episode 10" , url: `${STREAM_HOST}/dl/6ae3debf6e979983cdce6594` },
            { title: "Episode 11" , url: `${STREAM_HOST}/dl/6ae3dec56e979983cdce6596` },
            { title: "Episode 12" , url: `${STREAM_HOST}/dl/6ae3de6f6e979983cdce657f` },
            { title: "Episode 13" , url: `${STREAM_HOST}/dl/6ae3deb96e979983cdce6590` },
            { title: "Episode 14" , url: `${STREAM_HOST}/dl/6ae3df2e6e979983cdce65a2` },
            { title: "Episode 15" , url: `${STREAM_HOST}/dl/6ae3de816e979983cdce6588` },
            { title: "Episode 16" , url: `${STREAM_HOST}/dl/6ae3dec46e979983cdce6595` },
            { title: "Episode 17" , url: `${STREAM_HOST}/dl/6ae3de6f6e979983cdce6580` },
            { title: "Episode 18" , url: `${STREAM_HOST}/dl/6ae3def26e979983cdce6599` },
            { title: "Episode 19" , url: `${STREAM_HOST}/dl/6ae3deeb6e979983cdce6597` },
            { title: "Episode 20" , url: `${STREAM_HOST}/dl/6ae3deb46e979983cdce658e` },
            { title: "Episode 21" , url: `${STREAM_HOST}/dl/6ae3de786e979983cdce6587` },
            { title: "Episode 22" , url: `${STREAM_HOST}/dl/6ae3de846e979983cdce658a` },
            { title: "Episode 23" , url: `${STREAM_HOST}/dl/6ae3df2e6e979983cdce65a3` },
            { title: "Episode 24" , url: `${STREAM_HOST}/dl/6ae3def76e979983cdce659d` },
            { title: "Episode 25" , url: `${STREAM_HOST}/dl/6ae3defd6e979983cdce659f` },
            { title: "Episode 26" , url: `${STREAM_HOST}/dl/6ae3de846e979983cdce658b` },
            { title: "Episode 27" , url: `${STREAM_HOST}/dl/6ae3de6f6e979983cdce6582` },
            { title: "Episode 28" , url: `${STREAM_HOST}/dl/6ae3debe6e979983cdce6593` },
            { title: "Episode 29" , url: `${STREAM_HOST}/dl/6ae3deb46e979983cdce658f` },
            { title: "Episode 30" , url: `${STREAM_HOST}/dl/6ae3de816e979983cdce6589` },
            { title: "Episode 31" , url: `${STREAM_HOST}/dl/6ae3deaf6e979983cdce658c` },
            { title: "Episode 32" , url: `${STREAM_HOST}/dl/6ae3deb96e979983cdce6592` },
            { title: "Episode 33" , url: `${STREAM_HOST}/dl/6ae3def36e979983cdce659b` },
            { title: "Episode 34" , url: `${STREAM_HOST}/dl/6ae3def76e979983cdce659c` },
            { title: "Episode 35" , url: `${STREAM_HOST}/dl/6ae3df2d6e979983cdce65a0` },
            { title: "Episode 36" , url: `${STREAM_HOST}/dl/6ae3de786e979983cdce6586` },
            { title: "Episode 37" , url: `${STREAM_HOST}/dl/6ae3de786e979983cdce6584` },
            { title: "Episode 38" , url: `${STREAM_HOST}/dl/6ae3deb36e979983cdce658d` }
        ])
    },
    "oggy4_catalog": {
        id: "oggy4",
        catalogId: "oggy4_catalog",
        name: "Oggy and The Cockroaches Season 4",
        poster: "https://i.postimg.cc/MKNBTYRC/oggy4.jpg",
        background: "https://i.postimg.cc/CLX814kS/Oggy-WP.jpg",
        backgroundShape: "Landscape",
        description: " Oggy, seekor kucing berwarna biru yang sangat gemar bersenang-lenang, menonton televisyen, dan menjaga kebersihan rumahnya. Namun, kehidupannya yang aman sentiasa huru-hara disebabkan oleh tiga ekor lipas yang tinggal di dalam rumahnya iaitu Joey, Dee Dee, dan Marky. Lipas-lipas ini sering mencuri makanan di dalam peti sejuk, merosakkan perabot, dan merancang pelbagai helah nakal untuk menyeksa Oggy.",
        episodes: createEpisodes([
            { title: "Episode 01" , url: `${STREAM_HOST}/dl/6ae3e27c6e979983cdce65a5` },
            { title: "Episode 02" , url: `${STREAM_HOST}/dl/6ae3e34a6e979983cdce65c3` },
            { title: "Episode 03" , url: `${STREAM_HOST}/dl/6ae3e27c6e979983cdce65a6` },
            { title: "Episode 04" , url: `${STREAM_HOST}/dl/6ae3e2946e979983cdce65af` },
            { title: "Episode 05" , url: `${STREAM_HOST}/dl/6ae3e27c6e979983cdce65a9` },
            { title: "Episode 06" , url: `${STREAM_HOST}/dl/6ae3e2856e979983cdce65ab` },
            { title: "Episode 07" , url: `${STREAM_HOST}/dl/6ae3e2856e979983cdce65ae` },
            { title: "Episode 08" , url: `${STREAM_HOST}/dl/6ae3e4126e979983cdce65e6` },
            { title: "Episode 09" , url: `${STREAM_HOST}/dl/6ae3e3ef6e979983cdce65df` },
            { title: "Episode 10" , url: `${STREAM_HOST}/dl/6ae3e3b06e979983cdce65d6` },
            { title: "Episode 11" , url: `${STREAM_HOST}/dl/6ae3e3176e979983cdce65c0` },
            { title: "Episode 12" , url: `${STREAM_HOST}/dl/6ae3e30e6e979983cdce65ba` },
            { title: "Episode 13" , url: `${STREAM_HOST}/dl/6ae3e2946e979983cdce65b2` },
            { title: "Episode 14" , url: `${STREAM_HOST}/dl/6ae3e34a6e979983cdce65c6` },
            { title: "Episode 15" , url: `${STREAM_HOST}/dl/6ae3e30f6e979983cdce65be` },
            { title: "Episode 16" , url: `${STREAM_HOST}/dl/6ae3e2c16e979983cdce65b6` },
            { title: "Episode 17" , url: `${STREAM_HOST}/dl/6ae3e2c16e979983cdce65b7` },
            { title: "Episode 18" , url: `${STREAM_HOST}/dl/6ae3e3586e979983cdce65ca` },
            { title: "Episode 19" , url: `${STREAM_HOST}/dl/6ae3e4126e979983cdce65e1` },
            { title: "Episode 20" , url: `${STREAM_HOST}/dl/6ae3e45f6e979983cdce65eb` },
            { title: "Episode 21" , url: `${STREAM_HOST}/dl/6ae3e2946e979983cdce65b0` },
            { title: "Episode 22" , url: `${STREAM_HOST}/dl/6ae3e3d86e979983cdce65da` },
            { title: "Episode 23" , url: `${STREAM_HOST}/dl/6ae3e3a86e979983cdce65d1` },
            { title: "Episode 24" , url: `${STREAM_HOST}/dl/6ae3e3ed6e979983cdce65dd` },
            { title: "Episode 25" , url: `${STREAM_HOST}/dl/6ae3e4126e979983cdce65e5` },
            { title: "Episode 26" , url: `${STREAM_HOST}/dl/6ae3e30e6e979983cdce65b9` },
            { title: "Episode 27" , url: `${STREAM_HOST}/dl/6ae3e4336e979983cdce65ea` },
            { title: "Episode 28" , url: `${STREAM_HOST}/dl/6ae3e3d86e979983cdce65d9` },
            { title: "Episode 29" , url: `${STREAM_HOST}/dl/6ae3e34a6e979983cdce65c5` },
            { title: "Episode 30" , url: `${STREAM_HOST}/dl/6ae3e3526e979983cdce65c9` },
            { title: "Episode 31" , url: `${STREAM_HOST}/dl/6ae3e3b06e979983cdce65d5` },
            { title: "Episode 32" , url: `${STREAM_HOST}/dl/6ae3e3a86e979983cdce65d0` },
            { title: "Episode 33" , url: `${STREAM_HOST}/dl/6ae3e30f6e979983cdce65bb` },
            { title: "Episode 34" , url: `${STREAM_HOST}/dl/6ae3e34a6e979983cdce65c7` },
            { title: "Episode 35" , url: `${STREAM_HOST}/dl/6ae3e4296e979983cdce65e7` },
            { title: "Episode 36" , url: `${STREAM_HOST}/dl/6ae3e27c6e979983cdce65a7` },
            { title: "Episode 37" , url: `${STREAM_HOST}/dl/6ae3e2856e979983cdce65ad` },
            { title: "Episode 38" , url: `${STREAM_HOST}/dl/6ae3e2946e979983cdce65b4` },
            { title: "Episode 39" , url: `${STREAM_HOST}/dl/6ae3e30f6e979983cdce65bc` },
            { title: "Episode 40" , url: `${STREAM_HOST}/dl/6ae3e34a6e979983cdce65c8` },
            { title: "Episode 41" , url: `${STREAM_HOST}/dl/6ae3e35e6e979983cdce65cc` },
            { title: "Episode 42" , url: `${STREAM_HOST}/dl/6ae3e3d86e979983cdce65d7` },
            { title: "Episode 43" , url: `${STREAM_HOST}/dl/6ae3e4126e979983cdce65e4` },
            { title: "Episode 44" , url: `${STREAM_HOST}/dl/6ae3e3596e979983cdce65cb` },
            { title: "Episode 45" , url: `${STREAM_HOST}/dl/6ae3e3d86e979983cdce65d8` },
            { title: "Episode 46" , url: `${STREAM_HOST}/dl/6ae3e2946e979983cdce65b3` },
            { title: "Episode 47" , url: `${STREAM_HOST}/dl/6ae3e30f6e979983cdce65bd` },
            { title: "Episode 48" , url: `${STREAM_HOST}/dl/6ae3e3ef6e979983cdce65e0` },
            { title: "Episode 49" , url: `${STREAM_HOST}/dl/6ae3e3b06e979983cdce65d3` },
            { title: "Episode 50" , url: `${STREAM_HOST}/dl/6ae3e3196e979983cdce65c2` },
            { title: "Episode 51" , url: `${STREAM_HOST}/dl/6ae3e3176e979983cdce65bf` },
            { title: "Episode 52" , url: `${STREAM_HOST}/dl/6ae3e42e6e979983cdce65e8` },
            { title: "Episode 53" , url: `${STREAM_HOST}/dl/6ae3e3176e979983cdce65c1` },
            { title: "Episode 54" , url: `${STREAM_HOST}/dl/6ae3e45f6e979983cdce65ee` },
            { title: "Episode 55" , url: `${STREAM_HOST}/dl/6ae3e27c6e979983cdce65aa` },
            { title: "Episode 56" , url: `${STREAM_HOST}/dl/6ae3e4126e979983cdce65e2` },
            { title: "Episode 57" , url: `${STREAM_HOST}/dl/6ae3e27c6e979983cdce65a8` },
            { title: "Episode 58" , url: `${STREAM_HOST}/dl/6ae3e2946e979983cdce65b1` },
            { title: "Episode 59" , url: `${STREAM_HOST}/dl/6ae3e2c16e979983cdce65b8` },
            { title: "Episode 60" , url: `${STREAM_HOST}/dl/6ae3e3a86e979983cdce65cd` },
            { title: "Episode 61" , url: `${STREAM_HOST}/dl/6ae3e3a86e979983cdce65cf` },
            { title: "Episode 62" , url: `${STREAM_HOST}/dl/6ae3e3a86e979983cdce65ce` },
            { title: "Episode 63" , url: `${STREAM_HOST}/dl/6ae3e3b06e979983cdce65d4` },
            { title: "Episode 64" , url: `${STREAM_HOST}/dl/6ae3e3d86e979983cdce65dc` },
            { title: "Episode 65" , url: `${STREAM_HOST}/dl/6ae3e4126e979983cdce65e3` },
            { title: "Episode 66" , url: `${STREAM_HOST}/dl/6ae3e42e6e979983cdce65e9` },
            { title: "Episode 67" , url: `${STREAM_HOST}/dl/6ae3e45f6e979983cdce65ec` },
            { title: "Episode 68" , url: `${STREAM_HOST}/dl/6ae3e34a6e979983cdce65c4` },
            { title: "Episode 69" , url: `${STREAM_HOST}/dl/6ae3e45f6e979983cdce65ed` },
            { title: "Episode 70" , url: `${STREAM_HOST}/dl/6ae3e3d86e979983cdce65db` },
            { title: "Episode 71" , url: `${STREAM_HOST}/dl/6ae3e3ef6e979983cdce65de` },
            { title: "Episode 72" , url: `${STREAM_HOST}/dl/6ae3e2c16e979983cdce65b5` },
            { title: "Episode 73" , url: `${STREAM_HOST}/dl/6ae3e3a86e979983cdce65d2` },
            { title: "Episode 74" , url: `${STREAM_HOST}/dl/6ae3e2856e979983cdce65ac` }
        ])
    },
    "oggy5_catalog": {
        id: "oggy5",
        catalogId: "oggy5_catalog",
        name: "Oggy and The Cockroaches Season 5",
        poster: "https://i.postimg.cc/02FSQCDv/oggy5.jpg",
        background: "https://i.postimg.cc/CLX814kS/Oggy-WP.jpg",
        backgroundShape: "Landscape",
        description: " Oggy, seekor kucing berwarna biru yang sangat gemar bersenang-lenang, menonton televisyen, dan menjaga kebersihan rumahnya. Namun, kehidupannya yang aman sentiasa huru-hara disebabkan oleh tiga ekor lipas yang tinggal di dalam rumahnya iaitu Joey, Dee Dee, dan Marky. Lipas-lipas ini sering mencuri makanan di dalam peti sejuk, merosakkan perabot, dan merancang pelbagai helah nakal untuk menyeksa Oggy.",
        episodes: createEpisodes([ 
            { title: "Episode 01" , url: `${STREAM_HOST}/dl/6ae3eb486e979983cdce6621` },
            { title: "Episode 02" , url: `${STREAM_HOST}/dl/6ae3eba26e979983cdce662c` },
            { title: "Episode 03" , url: `${STREAM_HOST}/dl/6ae3e9e86e979983cdce65f2` },
            { title: "Episode 04" , url: `${STREAM_HOST}/dl/6ae3ebeb6e979983cdce663c` },
            { title: "Episode 05" , url: `${STREAM_HOST}/dl/6ae3ea116e979983cdce65fd` },
            { title: "Episode 06" , url: `${STREAM_HOST}/dl/6ae3ebe66e979983cdce663b` },
            { title: "Episode 07" , url: `${STREAM_HOST}/dl/6ae3ea116e979983cdce65fe` },
            { title: "Episode 08" , url: `${STREAM_HOST}/dl/6ae3e9e86e979983cdce65f1` },
            { title: "Episode 09" , url: `${STREAM_HOST}/dl/6ae3ebac6e979983cdce6631` },
            { title: "Episode 10" , url: `${STREAM_HOST}/dl/6ae3ea2b6e979983cdce65ff` },
            { title: "Episode 11" , url: `${STREAM_HOST}/dl/6ae3e9e86e979983cdce65f3` },
            { title: "Episode 12" , url: `${STREAM_HOST}/dl/6ae3eaae6e979983cdce6614` },
            { title: "Episode 13" , url: `${STREAM_HOST}/dl/6ae3ea986e979983cdce6611` },
            { title: "Episode 14" , url: `${STREAM_HOST}/dl/6ae3eb486e979983cdce6626` },
            { title: "Episode 15" , url: `${STREAM_HOST}/dl/6ae3eaae6e979983cdce6615` },
            { title: "Episode 16" , url: `${STREAM_HOST}/dl/6ae3eb566e979983cdce6629` },
            { title: "Episode 17" , url: `${STREAM_HOST}/dl/6ae3eb486e979983cdce6622` },
            { title: "Episode 18" , url: `${STREAM_HOST}/dl/6ae3ea986e979983cdce660f` },
            { title: "Episode 19" , url: `${STREAM_HOST}/dl/6ae3ea6f6e979983cdce660c` },
            { title: "Episode 20" , url: `${STREAM_HOST}/dl/6ae3eb106e979983cdce661c` },
            { title: "Episode 21" , url: `${STREAM_HOST}/dl/6ae3ebc86e979983cdce6638` },
            { title: "Episode 22" , url: `${STREAM_HOST}/dl/6ae3eb106e979983cdce661b` },
            { title: "Episode 23" , url: `${STREAM_HOST}/dl/6ae3ebac6e979983cdce6634` },
            { title: "Episode 24" , url: `${STREAM_HOST}/dl/6ae3ebc86e979983cdce6639` },
            { title: "Episode 25" , url: `${STREAM_HOST}/dl/6ae3ea5f6e979983cdce6605` },
            { title: "Episode 26" , url: `${STREAM_HOST}/dl/6ae3ea5f6e979983cdce6607` },
            { title: "Episode 27" , url: `${STREAM_HOST}/dl/6ae3eb486e979983cdce6625` },
            { title: "Episode 28" , url: `${STREAM_HOST}/dl/6ae3e9e86e979983cdce65f0` },
            { title: "Episode 29" , url: `${STREAM_HOST}/dl/6ae3e9e86e979983cdce65f4` },
            { title: "Episode 30" , url: `${STREAM_HOST}/dl/6ae3e9f06e979983cdce65f6` },
            { title: "Episode 31" , url: `${STREAM_HOST}/dl/6ae3e9f06e979983cdce65f7` },
            { title: "Episode 32" , url: `${STREAM_HOST}/dl/6ae3ea116e979983cdce65fc` },
            { title: "Episode 33" , url: `${STREAM_HOST}/dl/6ae3ea116e979983cdce65fb` },
            { title: "Episode 34" , url: `${STREAM_HOST}/dl/6ae3ea316e979983cdce6600` },
            { title: "Episode 35" , url: `${STREAM_HOST}/dl/6ae3ea5f6e979983cdce6608` },
            { title: "Episode 36" , url: `${STREAM_HOST}/dl/6ae3ea5f6e979983cdce6604` },
            { title: "Episode 37" , url: `${STREAM_HOST}/dl/6ae3ea6f6e979983cdce660a` },
            { title: "Episode 38" , url: `${STREAM_HOST}/dl/6ae3ea986e979983cdce660d` },
            { title: "Episode 39" , url: `${STREAM_HOST}/dl/6ae3ea986e979983cdce660e` },
            { title: "Episode 40" , url: `${STREAM_HOST}/dl/6ae3eb1a6e979983cdce661e` },
            { title: "Episode 41" , url: `${STREAM_HOST}/dl/6ae3eb1a6e979983cdce6620` },
            { title: "Episode 42" , url: `${STREAM_HOST}/dl/6ae3eb106e979983cdce6619` },
            { title: "Episode 43" , url: `${STREAM_HOST}/dl/6ae3eb516e979983cdce6627` },
            { title: "Episode 44" , url: `${STREAM_HOST}/dl/6ae3eb566e979983cdce6628` },
            { title: "Episode 45" , url: `${STREAM_HOST}/dl/6ae3eba26e979983cdce662d` },
            { title: "Episode 46" , url: `${STREAM_HOST}/dl/6ae3ebac6e979983cdce6632` },
            { title: "Episode 47" , url: `${STREAM_HOST}/dl/6ae3ebc86e979983cdce663a` },
            { title: "Episode 48" , url: `${STREAM_HOST}/dl/6ae3ea116e979983cdce65f9` },
            { title: "Episode 49" , url: `${STREAM_HOST}/dl/6ae3eaae6e979983cdce6616` },
            { title: "Episode 50" , url: `${STREAM_HOST}/dl/6ae3ebc86e979983cdce6637` },
            { title: "Episode 51" , url: `${STREAM_HOST}/dl/6ae3eba26e979983cdce6630` },
            { title: "Episode 52" , url: `${STREAM_HOST}/dl/6ae3eb486e979983cdce6623` },
            { title: "Episode 53" , url: `${STREAM_HOST}/dl/6ae3e9f06e979983cdce65f5` },
            { title: "Episode 54" , url: `${STREAM_HOST}/dl/6ae3eb186e979983cdce661d` },
            { title: "Episode 55" , url: `${STREAM_HOST}/dl/6ae3e9e86e979983cdce65ef` },
            { title: "Episode 56" , url: `${STREAM_HOST}/dl/6ae3e9f06e979983cdce65f8` },
            { title: "Episode 57" , url: `${STREAM_HOST}/dl/6ae3ea116e979983cdce65fa` },
            { title: "Episode 58" , url: `${STREAM_HOST}/dl/6ae3ea316e979983cdce6601` },
            { title: "Episode 59" , url: `${STREAM_HOST}/dl/6ae3ea366e979983cdce6602` },
            { title: "Episode 60" , url: `${STREAM_HOST}/dl/6ae3ea6d6e979983cdce6609` },
            { title: "Episode 61" , url: `${STREAM_HOST}/dl/6ae3ea996e979983cdce6612` },
            { title: "Episode 62" , url: `${STREAM_HOST}/dl/6ae3ea986e979983cdce6610` },
            { title: "Episode 63" , url: `${STREAM_HOST}/dl/6ae3eaa96e979983cdce6613` },
            { title: "Episode 64" , url: `${STREAM_HOST}/dl/6ae3eb106e979983cdce661a` },
            { title: "Episode 65" , url: `${STREAM_HOST}/dl/6ae3eb106e979983cdce6618` },
            { title: "Episode 66" , url: `${STREAM_HOST}/dl/6ae3eb1a6e979983cdce661f` },
            { title: "Episode 67" , url: `${STREAM_HOST}/dl/6ae3eb486e979983cdce6624` },
            { title: "Episode 68" , url: `${STREAM_HOST}/dl/6ae3eba26e979983cdce662b` },
            { title: "Episode 69" , url: `${STREAM_HOST}/dl/6ae3eba26e979983cdce662e` },
            { title: "Episode 70" , url: `${STREAM_HOST}/dl/6ae3eba26e979983cdce662f` },
            { title: "Episode 71" , url: `${STREAM_HOST}/dl/6ae3ebac6e979983cdce6633` },
            { title: "Episode 72" , url: `${STREAM_HOST}/dl/6ae3ebc86e979983cdce6635` },
            { title: "Episode 73" , url: `${STREAM_HOST}/dl/6ae3ebeb6e979983cdce663d` },
            { title: "Episode 74" , url: `${STREAM_HOST}/dl/6ae3eb106e979983cdce6617` },
            { title: "Episode 75" , url: `${STREAM_HOST}/dl/6ae3eb5b6e979983cdce662a` },
            { title: "Episode 76" , url: `${STREAM_HOST}/dl/6ae3ea5f6e979983cdce6606` },
            { title: "Episode 77" , url: `${STREAM_HOST}/dl/6ae3ea5f6e979983cdce6603` },
            { title: "Episode 78" , url: `${STREAM_HOST}/dl/6ae3ebc86e979983cdce6636` },
            { title: "Episode 79" , url: `${STREAM_HOST}/dl/6ae3ea6f6e979983cdce660b` }
        ])
    },
    "felix_catalog": {
        id: "felix",
        catalogId: "felix_catalog",
        name: "Felix The Cat",
        poster: "https://i.postimg.cc/Y9WWhQNQ/FTC-DP.jpg",
        background: "https://i.postimg.cc/d1yyLGRj/FTC-WP.jpg",
        backgroundShape: "Landscape",
        description: "Beg Ajaib (Magic Bag): Dalam versi moden, Felix sering membawa sebuah beg galas kecil berwarna kuning dengan corak petak-petak hitam. Beg ini boleh bertukar bentuk menjadi apa sahaja objek yang dia perlukan.",
        episodes: createEpisodes([ 
            { title: "A Cat Scared of a Mouse", url: `${STREAM_HOST}/dl/6ae14b637186b1bccd4e50f0` },
            { title: "Cleopatra's Chamber", url: `${STREAM_HOST}/dl/6ae14b637186b1bccd4e50f1` },
            { title: "Can't Felix get any Peace and Quiet!", url: `${STREAM_HOST}/dl/6ae14b637186b1bccd4e50f2` },
            { title: "A Disappearing Act", url: `${STREAM_HOST}/dl/6ae14b637186b1bccd4e50f3` },
            { title: "Breaking In To a Bank", url: `${STREAM_HOST}/dl/6ae14b637186b1bccd4e50f4` },
            { title: "Captured by the Enemy", url: `${STREAM_HOST}/dl/6ae14b637186b1bccd4e50f5` },
            { title: "Digging for Gold", url: `${STREAM_HOST}/dl/6ae14b647186b1bccd4e50f6` },
            { title: "Felix Captures a Rare Bird", url: `${STREAM_HOST}/dl/6ae14b697186b1bccd4e50f7` },
            { title: "Felix Battles The Professor in a Duel", url: `${STREAM_HOST}/dl/6ae14b697186b1bccd4e50f8` },
            { title: "Felix Comes Face to Face with the Abominable Snowman", url: `${STREAM_HOST}/dl/6ae14b697186b1bccd4e50f9` },
            { title: "Felix Gets Hypnotised", url: `${STREAM_HOST}/dl/6ae14c217186b1bccd4e50fa` },
            { title: "Felix on the Run", url: `${STREAM_HOST}/dl/6ae14c217186b1bccd4e50fb` },
            { title: "Felix Meets the King Leprechaun", url: `${STREAM_HOST}/dl/6ae14c217186b1bccd4e50fc` },
            { title: "Felix Hits the Jackpot", url: `${STREAM_HOST}/dl/6ae14c217186b1bccd4e50fd` },
            { title: "Felix gets Arrested on Mars", url: `${STREAM_HOST}/dl/6ae14c217186b1bccd4e50fe` },
            { title: "Felix Is In Control!", url: `${STREAM_HOST}/dl/6ae14c217186b1bccd4e50ff` },
            { title: "Felix Saves Earth from a Meteor", url: `${STREAM_HOST}/dl/6ae14c277186b1bccd4e5100` },
            { title: "Felix Travels Back in Time", url: `${STREAM_HOST}/dl/6ae14c277186b1bccd4e5101` },
            { title: "Felix Unlocks the Secret to Everlasting Beauty", url: `${STREAM_HOST}/dl/6ae14c277186b1bccd4e5102` },
            { title: "Felix Unlocks Treasure", url: `${STREAM_HOST}/dl/6ae14c277186b1bccd4e5103` },
            { title: "Felix's Art Hijinx", url: `${STREAM_HOST}/dl/6ae14ca97186b1bccd4e5104` },
            { title: "Felix Wins the Lottery", url: `${STREAM_HOST}/dl/6ae14ca97186b1bccd4e5105` },
            { title: "Felix's Escape Plan Compilation", url: `${STREAM_HOST}/dl/6ae14ca97186b1bccd4e5106` },
            { title: "Felix Wins the Race", url: `${STREAM_HOST}/dl/6ae14ca97186b1bccd4e5107` },
            { title: "Felix's Ski Competition", url: `${STREAM_HOST}/dl/6ae14ca97186b1bccd4e5108` },
            { title: "Finding the Treasure Mines", url: `${STREAM_HOST}/dl/6ae14ca97186b1bccd4e5109` },
            { title: "Genie In A Bottle", url: `${STREAM_HOST}/dl/6ae14cae7186b1bccd4e510a` },
            { title: "Laboratory Lift Off", url: `${STREAM_HOST}/dl/6ae14caf7186b1bccd4e510b` },
            { title: "Nap Time for Felix Compilation", url: `${STREAM_HOST}/dl/6ae14caf7186b1bccd4e510c` },
            { title: "One Smart Mouse", url: `${STREAM_HOST}/dl/6ae14cb47186b1bccd4e510d` },
            { title: "Something Smells Fishy", url: `${STREAM_HOST}/dl/6ae14d587186b1bccd4e510e` },
            { title: "Stealing the Bag of Tricks", url: `${STREAM_HOST}/dl/6ae14d587186b1bccd4e510f` },
            { title: "The Case of the Stolen Elephants", url: `${STREAM_HOST}/dl/6ae14d587186b1bccd4e5110` },
            { title: "Stealing a Diamond Tree", url: `${STREAM_HOST}/dl/6ae14d587186b1bccd4e5111` },
            { title: "Sheriff Felix Reporting For Duty", url: `${STREAM_HOST}/dl/6ae14d587186b1bccd4e5112` },
            { title: "The Art Thief", url: `${STREAM_HOST}/dl/6ae14d587186b1bccd4e5113` },
            { title: "The Cat-Eating Plant", url: `${STREAM_HOST}/dl/6ae14d5e7186b1bccd4e5114` },
            { title: "The Mistaken Identity Compilation", url: `${STREAM_HOST}/dl/6ae14d5e7186b1bccd4e5115` },
            { title: "The Magic Tablet", url: `${STREAM_HOST}/dl/6ae14d5e7186b1bccd4e5116` },
            { title: "The Laboratory is in Orbit! Compilation", url: `${STREAM_HOST}/dl/6ae14d5e7186b1bccd4e5117` },
            { title: "The Professor's Snowy Disguise", url: `${STREAM_HOST}/dl/6ae14d997186b1bccd4e5118` },
            { title: "The Time Machine Plan", url: `${STREAM_HOST}/dl/6ae14d997186b1bccd4e5119` },
            { title: "The Search for the Egyptian Treasure", url: `${STREAM_HOST}/dl/6ae14d997186b1bccd4e511a` },
            { title: "Vavoom The Almighty", url: `${STREAM_HOST}/dl/6ae14d9e7186b1bccd4e511b` },
            { title: "When the Babysitter turns into the Baby", url: `${STREAM_HOST}/dl/6ae14d9e7186b1bccd4e511c` }
        ])
    },
    "sakura_catalog": {
        id: "sakura",
        catalogId: "sakura_catalog",
        name: "Cardcaptor Sakura",
        poster: "https://i.postimg.cc/xCzzcLGp/CCS-DP.jpg",
        background: "https://i.postimg.cc/LX11njk0/CCS-WP.jpg",
        backgroundShape: "Landscape",
        description: "Sakura secara tidak sengaja telah membuka sebuah buku misteri di perpustakaan bapanya dan melepaskan satu set kad ajaib yang dipanggil Clow Cards. Kad-kad ini mempunyai kuasa luar biasa dan boleh mendatangkan bahaya jika dibiarkan bebas. Sakura kemudiannya dilantik oleh Cerberus (Kero-chan), penjaga kad tersebut, untuk menjadi seorang Cardcaptor (Penangkap Kad) bagi mengumpul semula semua kad yang hilang.",
        episodes: createEpisodes([ 
            { title: "Cardcaptor Sakura Episode 1", url: `${STREAM_HOST}/dl/6ae142e86e979983cdce6431` },
            { title: "Cardcaptor Sakura Episode 2", url: `${STREAM_HOST}/dl/6ae142e86e979983cdce6430` },
            { title: "Cardcaptor Sakura Episode 3", url: `${STREAM_HOST}/dl/6ae142e86e979983cdce642f` },
            { title: "Cardcaptor Sakura Episode 4", url: `${STREAM_HOST}/dl/6ae142e86e979983cdce642c` },
            { title: "Cardcaptor Sakura Episode 5", url: `${STREAM_HOST}/dl/6ae142e86e979983cdce642e` },
            { title: "Cardcaptor Sakura Episode 6", url: `${STREAM_HOST}/dl/6ae142e86e979983cdce642d` },
            { title: "Cardcaptor Sakura Episode 7", url: `${STREAM_HOST}/dl/6ae142ee7186b1bccd4e50b0` },
            { title: "Cardcaptor Sakura Episode 8", url: `${STREAM_HOST}/dl/6ae142f37186b1bccd4e50b1` },
            { title: "Cardcaptor Sakura Episode 9", url: `${STREAM_HOST}/dl/6ae142f37186b1bccd4e50b2` },
            { title: "Cardcaptor Sakura Episode 10", url: `${STREAM_HOST}/dl/6ae142f87186b1bccd4e50b3` },
            { title: "Cardcaptor Sakura Episode 11", url: `${STREAM_HOST}/dl/6ae1440a7186b1bccd4e50b7` },
            { title: "Cardcaptor Sakura Episode 12", url: `${STREAM_HOST}/dl/6ae1440a7186b1bccd4e50b4` },
            { title: "Cardcaptor Sakura Episode 13", url: `${STREAM_HOST}/dl/6ae1440a7186b1bccd4e50b5` },
            { title: "Cardcaptor Sakura Episode 14", url: `${STREAM_HOST}/dl/6ae1440a7186b1bccd4e50b6` },
            { title: "Cardcaptor Sakura Episode 15", url: `${STREAM_HOST}/dl/6ae1440a7186b1bccd4e50b8` },
            { title: "Cardcaptor Sakura Episode 16", url: `${STREAM_HOST}/dl/6ae1440a7186b1bccd4e50b9` },
            { title: "Cardcaptor Sakura Episode 17", url: `${STREAM_HOST}/dl/6ae144157186b1bccd4e50bc` },
            { title: "Cardcaptor Sakura Episode 18", url: `${STREAM_HOST}/dl/6ae144157186b1bccd4e50ba` },
            { title: "Cardcaptor Sakura Episode 19", url: `${STREAM_HOST}/dl/6ae144157186b1bccd4e50bb` },
            { title: "Cardcaptor Sakura Episode 20", url: `${STREAM_HOST}/dl/6ae144157186b1bccd4e50bd` },
            { title: "Cardcaptor Sakura Episode 21", url: `${STREAM_HOST}/dl/6ae145577186b1bccd4e50c2` },
            { title: "Cardcaptor Sakura Episode 22", url: `${STREAM_HOST}/dl/6ae145577186b1bccd4e50c1` },
            { title: "Cardcaptor Sakura Episode 23", url: `${STREAM_HOST}/dl/6ae145577186b1bccd4e50be` },
            { title: "Cardcaptor Sakura Episode 24", url: `${STREAM_HOST}/dl/6ae145577186b1bccd4e50c0` },
            { title: "Cardcaptor Sakura Episode 25", url: `${STREAM_HOST}/dl/6ae145577186b1bccd4e50c3` },
            { title: "Cardcaptor Sakura Episode 26", url: `${STREAM_HOST}/dl/6ae145577186b1bccd4e50bf` },
            { title: "Cardcaptor Sakura Episode 27", url: `${STREAM_HOST}/dl/6ae145627186b1bccd4e50c4` },
            { title: "Cardcaptor Sakura Episode 28", url: `${STREAM_HOST}/dl/6ae145627186b1bccd4e50c7` },
            { title: "Cardcaptor Sakura Episode 29", url: `${STREAM_HOST}/dl/6ae145627186b1bccd4e50c6` },
            { title: "Cardcaptor Sakura Episode 30", url: `${STREAM_HOST}/dl/6ae145627186b1bccd4e50c5` },
            { title: "Cardcaptor Sakura Episode 31", url: `${STREAM_HOST}/dl/6ae1467f7186b1bccd4e50cc` },
            { title: "Cardcaptor Sakura Episode 32", url: `${STREAM_HOST}/dl/6ae1467f7186b1bccd4e50c9` },
            { title: "Cardcaptor Sakura Episode 33", url: `${STREAM_HOST}/dl/6ae1467f7186b1bccd4e50ca` },
            { title: "Cardcaptor Sakura Episode 34", url: `${STREAM_HOST}/dl/6ae1467f7186b1bccd4e50c8` },
            { title: "Cardcaptor Sakura Episode 35", url: `${STREAM_HOST}/dl/6ae1467f7186b1bccd4e50cb` },
            { title: "Cardcaptor Sakura Episode 36", url: `${STREAM_HOST}/dl/6ae146807186b1bccd4e50cd` },
            { title: "Cardcaptor Sakura Episode 37", url: `${STREAM_HOST}/dl/6ae146857186b1bccd4e50ce` },
            { title: "Cardcaptor Sakura Episode 38", url: `${STREAM_HOST}/dl/6ae146857186b1bccd4e50cf` },
            { title: "Cardcaptor Sakura Episode 39", url: `${STREAM_HOST}/dl/6ae146857186b1bccd4e50d0` },
            { title: "Cardcaptor Sakura Episode 40", url: `${STREAM_HOST}/dl/6ae146857186b1bccd4e50d1` },
            { title: "Cardcaptor Sakura Episode 41", url: `${STREAM_HOST}/dl/6ae147887186b1bccd4e50d6` },
            { title: "Cardcaptor Sakura Episode 42", url: `${STREAM_HOST}/dl/6ae147887186b1bccd4e50d5` },
            { title: "Cardcaptor Sakura Episode 43", url: `${STREAM_HOST}/dl/6ae147887186b1bccd4e50d4` },
            { title: "Cardcaptor Sakura Episode 44", url: `${STREAM_HOST}/dl/6ae147887186b1bccd4e50d3` },
            { title: "Cardcaptor Sakura Episode 45", url: `${STREAM_HOST}/dl/6ae147887186b1bccd4e50d2` },
            { title: "Cardcaptor Sakura Episode 46", url: `${STREAM_HOST}/dl/6ae147887186b1bccd4e50d7` },
            { title: "Cardcaptor Sakura Episode 47", url: `${STREAM_HOST}/dl/6ae1478d7186b1bccd4e50d8` },
            { title: "Cardcaptor Sakura Episode 48", url: `${STREAM_HOST}/dl/6ae147927186b1bccd4e50d9` },
            { title: "Cardcaptor Sakura Episode 49", url: `${STREAM_HOST}/dl/6ae147927186b1bccd4e50da` },
            { title: "Cardcaptor Sakura Episode 50", url: `${STREAM_HOST}/dl/6ae147927186b1bccd4e50db` },
            { title: "Cardcaptor Sakura Episode 51", url: `${STREAM_HOST}/dl/6ae148817186b1bccd4e50dc` },
            { title: "Cardcaptor Sakura Episode 52", url: `${STREAM_HOST}/dl/6ae148817186b1bccd4e50e1` },
            { title: "Cardcaptor Sakura Episode 53", url: `${STREAM_HOST}/dl/6ae148817186b1bccd4e50e0` },
            { title: "Cardcaptor Sakura Episode 54", url: `${STREAM_HOST}/dl/6ae148817186b1bccd4e50de` },
            { title: "Cardcaptor Sakura Episode 55", url: `${STREAM_HOST}/dl/6ae148817186b1bccd4e50df` },
            { title: "Cardcaptor Sakura Episode 56", url: `${STREAM_HOST}/dl/6ae148817186b1bccd4e50dd` },
            { title: "Cardcaptor Sakura Episode 57", url: `${STREAM_HOST}/dl/6ae148867186b1bccd4e50e2` },
            { title: "Cardcaptor Sakura Episode 58", url: `${STREAM_HOST}/dl/6ae148867186b1bccd4e50e3` },
            { title: "Cardcaptor Sakura Episode 59", url: `${STREAM_HOST}/dl/6ae148867186b1bccd4e50e5` },
            { title: "Cardcaptor Sakura Episode 60", url: `${STREAM_HOST}/dl/6ae148867186b1bccd4e50e4` },
            { title: "Cardcaptor Sakura Episode 61", url: `${STREAM_HOST}/dl/6ae1496a7186b1bccd4e50e6` },
            { title: "Cardcaptor Sakura Episode 62", url: `${STREAM_HOST}/dl/6ae1496a7186b1bccd4e50e7` },
            { title: "Cardcaptor Sakura Episode 63", url: `${STREAM_HOST}/dl/6ae1496b7186b1bccd4e50eb` },
            { title: "Cardcaptor Sakura Episode 64", url: `${STREAM_HOST}/dl/6ae1496a7186b1bccd4e50e8` },
            { title: "Cardcaptor Sakura Episode 65", url: `${STREAM_HOST}/dl/6ae1496a7186b1bccd4e50e9` },
            { title: "Cardcaptor Sakura Episode 66", url: `${STREAM_HOST}/dl/6ae1496a7186b1bccd4e50ea` },
            { title: "Cardcaptor Sakura Episode 67", url: `${STREAM_HOST}/dl/6ae149757186b1bccd4e50ec` },
            { title: "Cardcaptor Sakura Episode 68", url: `${STREAM_HOST}/dl/6ae149757186b1bccd4e50ee` },
            { title: "Cardcaptor Sakura Episode 69", url: `${STREAM_HOST}/dl/6ae149757186b1bccd4e50ed` },
            { title: "Cardcaptor Sakura Episode 70", url: `${STREAM_HOST}/dl/6ae1497a7186b1bccd4e50ef` }
        ])
    },
    "clear_card_catalog": {
        id: "clear_card",
        catalogId: "clear_card_catalog",
        name: "Cardcaptor Sakura - Clear Card",
        poster: "https://i.postimg.cc/x14SwHPZ/c-LEARCARD.jpg",
        background: "https://i.postimg.cc/Y9WWhQNn/CCS-CC-WP.jpg",
        backgroundShape: "Landscape",
        description: "Sakura kini sudah meningkat usia dan menjadi pelajar tahun pertama di sekolah menengah rendah. Sakura memperoleh kunci baharu yang membolehkannya menangkap Clear Card — sejenis kad ajaib lut sinar yang menjelma secara tidak sedar daripada kekuatan sihir Sakura sendiri yang semakin memuncak.",
        episodes: createEpisodes([ 
            { title: "Episode 01", url: `${STREAM_HOST}/dl/6ae20eb46e979983cdce6436` },
            { title: "Episode 02", url: `${STREAM_HOST}/dl/6ae20eb46e979983cdce6437` },
            { title: "Episode 03", url: `${STREAM_HOST}/dl/6ae20eb46e979983cdce6435` },
            { title: "Episode 04", url: `${STREAM_HOST}/dl/6ae20eb46e979983cdce6433` },
            { title: "Episode 05", url: `${STREAM_HOST}/dl/6ae20eb46e979983cdce6434` },
            { title: "Episode 06", url: `${STREAM_HOST}/dl/6ae20eb46e979983cdce6432` },
            { title: "Episode 07", url: `${STREAM_HOST}/dl/6ae20ebf6e979983cdce6438` },
            { title: "Episode 08", url: `${STREAM_HOST}/dl/6ae20ebf6e979983cdce6439` },
            { title: "Episode 09", url: `${STREAM_HOST}/dl/6ae20ebf6e979983cdce643a` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6ae20ebf6e979983cdce643b` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6ae20f216e979983cdce643c` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6ae20f216e979983cdce643d` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6ae20f216e979983cdce643e` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6ae20f216e979983cdce6441` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6ae20f216e979983cdce643f` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6ae20f216e979983cdce6440` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6ae20f2a6e979983cdce6442` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6ae20f2a6e979983cdce6444` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6ae20f2a6e979983cdce6443` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6ae20f2a6e979983cdce6445` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6ae20f316e979983cdce6446` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6ae20f366e979983cdce6447` }
        ])
    },
    "mumul_zzumul_catalog": {
        id: "mumul_zzumul",
        catalogId: "mumul_zzumul_catalog",
        name: "Mumul Zzumul",
        poster: "https://i.postimg.cc/SsnDxnf2/Mumul-Zzumul.jpg",
        background: "https://i.postimg.cc/W3y3fHvC/MZ-WP.jpg",
        backgroundShape: "Landscape",
        description: "The series is based on true stories submitted by viewers. It depicts the realistic, everyday anxieties and relatable struggles faced by modern high school teenagers. Instead of a singular continuous plotline, each episode acts as a standalone story focusing on different social pressures.",
        episodes: createEpisodes([
            { title: "Mumul Zzumul Episode 1.mp4", url: `${STREAM_HOST}/dl/6ad6314f6e979983cdce5f0c` },
            { title: "Mumul Zzumul Episode 2.mp4", url: `${STREAM_HOST}/dl/6ad6314f6e979983cdce5f0f` },
            { title: "Mumul Zzumul Episode 3.mp4", url: `${STREAM_HOST}/dl/6ad6314f6e979983cdce5f0d` },
            { title: "Mumul Zzumul Episode 4.mp4", url: `${STREAM_HOST}/dl/6ad6314f6e979983cdce5f11` },
            { title: "Mumul Zzumul Episode 5.mp4", url: `${STREAM_HOST}/dl/6ad6314f6e979983cdce5f0e` },
            { title: "Mumul Zzumul Episode 6.mp4", url: `${STREAM_HOST}/dl/6ad6314f6e979983cdce5f10` },
            { title: "Mumul Zzumul Episode 7.mp4", url: `${STREAM_HOST}/dl/6ad631576e979983cdce5f15` },
            { title: "Mumul Zzumul Episode 8.mp4", url: `${STREAM_HOST}/dl/6ad631576e979983cdce5f12` },
            { title: "Mumul Zzumul Episode 9.mp4", url: `${STREAM_HOST}/dl/6ad631576e979983cdce5f13` },
            { title: "Mumul Zzumul Episode 10.mp4", url: `${STREAM_HOST}/dl/6ad631576e979983cdce5f14` },
            { title: "Mumul Zzumul Episode 11.mp4", url: `${STREAM_HOST}/dl/6ad6315c6e979983cdce5f17` },
            { title: "Mumul Zzumul Episode 12.mp4", url: `${STREAM_HOST}/dl/6ad6315c6e979983cdce5f16` },
            { title: "Mumul Zzumul Episode 13.mp4", url: `${STREAM_HOST}/dl/6ad631626e979983cdce5f18` },
            { title: "Mumul Zzumul Episode 14.mp4", url: `${STREAM_HOST}/dl/6ad631626e979983cdce5f19` },
            { title: "Mumul Zzumul Episode Vlog.mp4", url: `${STREAM_HOST}/dl/6ad631c86e979983cdce5f1c` }
        ])
    },
    "ma_boy_catalog": {
        id: "ma_boy",
        catalogId: "ma_boy_catalog",
        name: "Ma Boy",
        poster: "https://i.postimg.cc/SsnDxnfz/Ma-Boy.webp",
        background: "https://i.postimg.cc/jdcjp2tL/MB-WP.jpg",
        backgroundShape: "Landscape",
        description: "Geu-rim agrees to keep his secret. Complications arise as school life unfolds, including school crush/idol Tae-joon getting entangled in the mix, leading to a lighthearted story of friendship, identity, and young romance.",
        episodes: createEpisodes([
            { title: "Episode 1-1", url: `${STREAM_HOST}/dl/6ad648bf6e979983cdce5f3c` },
            { title: "Episode 1-2", url: `${STREAM_HOST}/dl/6ad648bf6e979983cdce5f40` },
            { title: "Episode 1-3", url: `${STREAM_HOST}/dl/6ad648bf6e979983cdce5f3f` },
            { title: "Episode 1-4", url: `${STREAM_HOST}/dl/6ad648bf6e979983cdce5f3d` },
            { title: "Episode 2-1", url: `${STREAM_HOST}/dl/6ad648bf6e979983cdce5f3b` },
            { title: "Episode 2-2", url: `${STREAM_HOST}/dl/6ad648bf6e979983cdce5f3e` },
            { title: "Episode 2-3", url: `${STREAM_HOST}/dl/6ad648c76e979983cdce5f41` },
            { title: "Episode 2-4", url: `${STREAM_HOST}/dl/6ad648c76e979983cdce5f42` },
            { title: "Episode 3-1", url: `${STREAM_HOST}/dl/6ad648c76e979983cdce5f43` },
            { title: "Episode 3-2", url: `${STREAM_HOST}/dl/6ad648c76e979983cdce5f44` },
            { title: "Episode 3-3", url: `${STREAM_HOST}/dl/6ad648cd6e979983cdce5f45` },
            { title: "Episode 3-4", url: `${STREAM_HOST}/dl/6ad648d26e979983cdce5f46` }
        ])
    },
    "iloveyou_loser_catalog": {
        id: "iloveyou_loser",
        catalogId: "iloveyou_loser_catalog",
        name: "I Love You, Loser!",
        poster: "https://i.postimg.cc/QtF0dFJ7/I-Love-You-Loser.jpg",
        backgroundShape: "Landscape",
        description: "A web drama about a dark history that you were embarrassed about resurfacing with the arrival of a new recruit.",
        episodes: createEpisodes([
            { title: "I Love You, Loser Episode 1", url: `${STREAM_HOST}/dl/6ad650366e979983cdce5f53` },
            { title: "I Love You, Loser Episode 2", url: `${STREAM_HOST}/dl/6ad650366e979983cdce5f57` },
            { title: "I Love You, Loser Episode 3", url: `${STREAM_HOST}/dl/6ad650366e979983cdce5f55` },
            { title: "I Love You, Loser Episode 4", url: `${STREAM_HOST}/dl/6ad650366e979983cdce5f56` },
            { title: "I Love You, Loser Episode 5", url: `${STREAM_HOST}/dl/6ad650366e979983cdce5f54` },
            { title: "I Love You, Loser Episode 6", url: `${STREAM_HOST}/dl/6ad650366e979983cdce5f58` }
        ])
    },
    "blue_birthday_catalog": {
        id: "blue_birthday",
        catalogId: "blue_birthday_catalog",
        name: "Blue Birthday",
        poster: "https://i.postimg.cc/XYhX9m12/BB.jpg",
        background: "https://i.postimg.cc/gcf5GHk2/BB-WP.jpg",
        backgroundShape: "Landscape",
        description: "Ten years later, while sorting through Seo-joon's belongings, Ha-rin finds eight hidden photos he left behind. When she burns one of the photos out of pain, she is magically transported back to the exact moment that picture was taken 10 years ago..",
        episodes: createEpisodes([
            { title: "Blue Birthday Episode 1", url: `${STREAM_HOST}/dl/6ad64f3f6e979983cdce5f4d` },
            { title: "Blue Birthday Episode 2", url: `${STREAM_HOST}/dl/6ad64f3e6e979983cdce5f48` },
            { title: "Blue Birthday Episode 3", url: `${STREAM_HOST}/dl/6ad64f3e6e979983cdce5f4b` },
            { title: "Blue Birthday Episode 4", url: `${STREAM_HOST}/dl/6ad64f3e6e979983cdce5f49` },
            { title: "Blue Birthday Episode 5", url: `${STREAM_HOST}/dl/6ad64f3e6e979983cdce5f4a` },
            { title: "Blue Birthday Episode 6", url: `${STREAM_HOST}/dl/6ad64f3e6e979983cdce5f4c` },
            { title: "Blue Birthday Episode 7", url: `${STREAM_HOST}/dl/6ad64f476e979983cdce5f4e` },
            { title: "Blue Birthday Episode 8", url: `${STREAM_HOST}/dl/6ad64f476e979983cdce5f4f` },
            { title: "Blue Birthday Episode 9", url: `${STREAM_HOST}/dl/6ad64f476e979983cdce5f50` },
            { title: "Blue Birthday Episode 10", url: `${STREAM_HOST}/dl/6ad64f476e979983cdce5f52` },
            { title: "Blue Birthday Episode 11", url: `${STREAM_HOST}/dl/6ad64f476e979983cdce5f51` }            
        ])
    },
    "daebaking_catalog": {
        id: "daebaking",
        catalogId: "daebaking_catalog",
        name: "DaebaKing",
        poster: "https://i.postimg.cc/SsnDxnfK/Daeba-King.jpg",
        description: "Koleksi DaebaKing.",
        episodes: createEpisodes([
            { title: "Boyfriend Expert.mp4", url: `${STREAM_HOST}/dl/6ad6335c6e979983cdce5f26` },
            { title: "Boyfriend Handsome.mp4", url: `${STREAM_HOST}/dl/6ad6335c6e979983cdce5f28` },
            { title: "Childish Boyfriend.mp4", url: `${STREAM_HOST}/dl/6ad6335c6e979983cdce5f2b` },
            { title: "Boyfriend Copy Paste.mp4", url: `${STREAM_HOST}/dl/6ad6335c6e979983cdce5f27` },
            { title: "Goblin Gemok 1.mp4", url: `${STREAM_HOST}/dl/6ad6335c6e979983cdce5f2a` },
            { title: "Goblin Gemok 2.mp4", url: `${STREAM_HOST}/dl/6ad633646e979983cdce5f2c` },
            { title: "Goblin Gemok 3.mp4", url: `${STREAM_HOST}/dl/6ad633646e979983cdce5f2d` },
            { title: "Boyfriend Cool.mp4", url: `${STREAM_HOST}/dl/6ad6335c6e979983cdce5f29` },
            { title: "My Other Half.mp4", url: `${STREAM_HOST}/dl/6ad633646e979983cdce5f2e` },
            { title: "Savage Dr Strange 1.mp4", url: `${STREAM_HOST}/dl/6ad6336f6e979983cdce5f32` },
            { title: "Savage Dr Strange 2.mp4", url: `${STREAM_HOST}/dl/6ad6336f6e979983cdce5f33` },
            { title: "Savage Dr Strange 3.mp4", url: `${STREAM_HOST}/dl/6ad6336f6e979983cdce5f34` },
            { title: "Savage Dr Strange 4.mp4", url: `${STREAM_HOST}/dl/6ad633996e979983cdce5f35` },
            { title: "Savage Dr Strange 5.mp4", url: `${STREAM_HOST}/dl/6ad633996e979983cdce5f36` },
            { title: "Overly Attached Boyfriend.mp4", url: `${STREAM_HOST}/dl/6ad633696e979983cdce5f31` },
            { title: "Romantic Boyfriend.mp4", url: `${STREAM_HOST}/dl/6ad633696e979983cdce5f30` },
            { title: "My Pet Boyfriend.mp4", url: `${STREAM_HOST}/dl/6ad633646e979983cdce5f2f` },
            { title: "The Perfect BF B1A4 Baro.mp4", url: `${STREAM_HOST}/dl/6ad633996e979983cdce5f37` },
            { title: "The Perfect Boyfriend.mp4", url: `${STREAM_HOST}/dl/6ad633996e979983cdce5f38` },
            { title: "The Weird Ex Boyfriend.mp4", url: `${STREAM_HOST}/dl/6ad6339f6e979983cdce5f39` },
            { title: "Godaan Siti.mp4", url: `${STREAM_HOST}/dl/6ad6339f6e979983cdce5f3a` }
        ])
    },
    "playful_kiss_catalog": {
        id: "playful_kiss",
        catalogId: "playful_kiss_catalog",
        name: "Playful Kiss",
        poster: "https://i.postimg.cc/zBfXpkzt/Playful-Kiss-DP.jpg",
        background: "https://i.postimg.cc/76LYXNHt/Playful-Kiss-WP.jpg",
        backgroundShape: "Landscape",
        description: "Oh Ha Ni (lakonan Jung So Min): Seorang pelajar perempuan yang ceria, lurus bendul, dan berada di kelas tercorot sekolah, tetapi sangat gigih manakala • Baek Seung Jo (lakonan Kim Hyun Joong): Pelajar lelaki genius, kacak, sangat pandai, tetapi bersifat dingin, sombong, dan acuh tak acuh.Hubungan mereka berkembang dari sekolah menengah hinggalah ke peringkat universiti dan alam kerjaya, mengharungi pelbagai saingan cinta sepertimana kehadiran Baek Do-gu atau watak pencabar lain, sebelum akhirnya menjadi pasangan suami isteri.",
        episodes: createEpisodes([
            { title: "Episode 01", url: `${STREAM_HOST}/dl/6ae2141a6e979983cdce6461` },
            { title: "Episode 02", url: `${STREAM_HOST}/dl/6ae2141a6e979983cdce645d` },
            { title: "Episode 03", url: `${STREAM_HOST}/dl/6ae2141a6e979983cdce6462` },
            { title: "Episode 04", url: `${STREAM_HOST}/dl/6ae2141a6e979983cdce645f` },
            { title: "Episode 05", url: `${STREAM_HOST}/dl/6ae2141a6e979983cdce645e` },
            { title: "Episode 06", url: `${STREAM_HOST}/dl/6ae2141a6e979983cdce6460` },
            { title: "Episode 07", url: `${STREAM_HOST}/dl/6ae214226e979983cdce6463` },
            { title: "Episode 08", url: `${STREAM_HOST}/dl/6ae214256e979983cdce6465` },
            { title: "Episode 09", url: `${STREAM_HOST}/dl/6ae214256e979983cdce6464` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6ae214256e979983cdce6466` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6ae2149e6e979983cdce646b` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6ae2149e6e979983cdce6469` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6ae2149e6e979983cdce646c` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6ae2149e6e979983cdce6467` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6ae2149e6e979983cdce646a` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6ae2149e6e979983cdce6468` }
        ])
    },
    "7_firstkissed_catalog": {
        id: "7_firstkissed",
        catalogId: "7_firstkissed_catalog",
        name: "7 First Kissed",
        poster: "https://i.postimg.cc/XJrQYrkX/7-First-Kisses.jpg",
        background: "https://i.postimg.cc/7ZCfSDrs/7fk-WP.jpg",
        backgroundShape: "Landscape",
        description: "Min Soo-jin (Lee Cho-hee) is a 25-year-old employee at the Lotte Duty Free store who has never had a boyfriend or her first kiss. While working, she helps a mysterious, angelic goddess (Choi Ji-woo). In return for her kindness, the goddess grants Soo-jin a magical chance to meet seven different handsome men and pick the perfect partner for her first kiss.",
        episodes: createEpisodes([
            { title: "7 First Kissed Episode 1.mp4", url: `${STREAM_HOST}/dl/6ad632c36e979983cdce5f1e` },
            { title: "7 First Kissed Episode 2.mp4", url: `${STREAM_HOST}/dl/6ad632c36e979983cdce5f1d` },
            { title: "7 First Kissed Episode 3.mp4", url: `${STREAM_HOST}/dl/6ad632c36e979983cdce5f20` },
            { title: "7 First Kissed Episode 4.mp4", url: `${STREAM_HOST}/dl/6ad632c36e979983cdce5f1f` },
            { title: "7 First Kissed Episode 5.mp4", url: `${STREAM_HOST}/dl/6ad632c36e979983cdce5f21` },
            { title: "7 First Kissed Episode 6.mp4", url: `${STREAM_HOST}/dl/6ad632c36e979983cdce5f22` },
            { title: "7 First Kissed Episode 7.mp4", url: `${STREAM_HOST}/dl/6ad632cc6e979983cdce5f23` },
            { title: "7 First Kissed Episode 8.mp4", url: `${STREAM_HOST}/dl/6ad632cc6e979983cdce5f24` }
        ])
    },
    "like_catalog": {
        id: "like",
        catalogId: "like_catalog",
        name: "Like 2019",
        poster: "https://i.postimg.cc/DzjxhrLL/Like.jpg",
        description: "Koleksi Like.",
        episodes: createEpisodes([
            { title: "[Like] Episode 1", url: `${STREAM_HOST}/dl/6ad656f76e979983cdce5f76` },
            { title: "[Like] Episode 2", url: `${STREAM_HOST}/dl/6ad656f76e979983cdce5f72` },
            { title: "[Like] Episode 3", url: `${STREAM_HOST}/dl/6ad656f76e979983cdce5f74` },
            { title: "[Like] Episode 4", url: `${STREAM_HOST}/dl/6ad656f76e979983cdce5f73` },
            { title: "[Like] Episode 5", url: `${STREAM_HOST}/dl/6ad656f76e979983cdce5f75` },
            { title: "[Like] Episode 6", url: `${STREAM_HOST}/dl/6ad656f76e979983cdce5f77` },
            { title: "[Like] Episode 7", url: `${STREAM_HOST}/dl/6ad656ff6e979983cdce5f78` },
            { title: "[Like] Episode 8", url: `${STREAM_HOST}/dl/6ad657016e979983cdce5f7a` },
            { title: "[Like] Episode 9", url: `${STREAM_HOST}/dl/6ad657016e979983cdce5f79` },
            { title: "[Like] Episode 10", url: `${STREAM_HOST}/dl/6ad657016e979983cdce5f7b` },
            { title: "[Like] Episode 11", url: `${STREAM_HOST}/dl/6ad657506e979983cdce5f7d` },
            { title: "[Like] Episode 12", url: `${STREAM_HOST}/dl/6ad657506e979983cdce5f7c` },
            { title: "[Like] Episode 13", url: `${STREAM_HOST}/dl/6ad657506e979983cdce5f80` },
            { title: "[Like] Episode 14", url: `${STREAM_HOST}/dl/6ad657506e979983cdce5f81` },
            { title: "[Like] Episode 15", url: `${STREAM_HOST}/dl/6ad657506e979983cdce5f7e` },
            { title: "[Like] Episode 16", url: `${STREAM_HOST}/dl/6ad657506e979983cdce5f7f` },
            { title: "[Like] Episode 17", url: `${STREAM_HOST}/dl/6ad657586e979983cdce5f82` },
            { title: "[Like] Episode 18", url: `${STREAM_HOST}/dl/6ad65e136e979983cdce5f83` },
            { title: "[Like] Episode 19", url: `${STREAM_HOST}/dl/6ad65e136e979983cdce5f84` },
            { title: "[Like] Episode 20", url: `${STREAM_HOST}/dl/6ad65e136e979983cdce5f87` },
            { title: "[Like] Episode 21", url: `${STREAM_HOST}/dl/6ad65e136e979983cdce5f88` },
            { title: "[Like] Episode 22", url: `${STREAM_HOST}/dl/6ad65e136e979983cdce5f85` },
            { title: "[Like] Episode 23", url: `${STREAM_HOST}/dl/6ad65e136e979983cdce5f86` }
        ])
    },
    "a_teen_catalog": {
        id: "a_teen",
        catalogId: "a_teen_catalog",
        name: "A-Teen",
        poster: "https://i.postimg.cc/XvHsWfdp/A-Teen.jpg",
        background: "https://i.postimg.cc/pXMHsHj9/AT-WP.jpg",
        backgroundShape: "Landscape",
        description: "This sparks intense gossip because the group features two best friends who share the exact same given name but possess completely contrasting identities: Do Ha-na, a quiet, straightforward aspiring illustrator, and Kim Ha-na, a bubbly, warm overachiever and the school beauty. As the school tries to guess who the mystery crush is, secrets begin to surface. The season explores deep-seated insecurities, intense academic pressures, hidden family expectations, and the chaotic web of real and imagined high school love triangles.",
        episodes: createEpisodes([
            { title: "Episode 1: Unordinary,_In_Truth,_Not_Wanting_To_Be_Ordinary", url: `${STREAM_HOST}/dl/6ad738446e979983cdce5fab` },
            { title: "Episode 2: When_Someone_Talks_Behind_My_Back", url: `${STREAM_HOST}/dl/6ad739e76e979983cdce5fad` },
            { title: "Episode 3: Getting_Over_An_Ex_Who_Cheated_On_You", url: `${STREAM_HOST}/dl/6ad736086e979983cdce5f9b` },
            { title: "Episode 4: I_Was_Asked_Out_During_Finals", url: `${STREAM_HOST}/dl/6ad736116e979983cdce5fa0` },
            { title: "Episode 5: Reason_Why_Friends_Fight_During_Finals", url: `${STREAM_HOST}/dl/6ad7383b6e979983cdce5fa5` },
            { title: "Episode 6: Reason_Why_It's_Scary_When_A_Quiet_One_Gets_Upset", url: `${STREAM_HOST}/dl/6ad7383b6e979983cdce5fa6` },
            { title: "Episode 7: Signs_That_Mean_He's_Into_Her", url: `${STREAM_HOST}/dl/6ad738446e979983cdce5fa9` },
            { title: "Episode 8: When_You_Feel_Left_Out_By_Your_Friends", url: `${STREAM_HOST}/dl/6ad739ef6e979983cdce5fb2` },
            { title: "Episode 9: When_Close_Friends_Are_About_To_Cut_Ties", url: `${STREAM_HOST}/dl/6ad739e76e979983cdce5fac` },
            { title: "Episode 10: When_Someone_Makes_A_Move_On_My_Crush", url: `${STREAM_HOST}/dl/6ad739e76e979983cdce5fb1` },
            { title: "Episode 11: When_A_Man_Gets_Crazy_Jealous", url: `${STREAM_HOST}/dl/6ad739e76e979983cdce5fb0` },
            { title: "Episode 12: He_Makes_My_Heart_Flutter", url: `${STREAM_HOST}/dl/6ad736086e979983cdce5f98` },
            { title: "Episode 13: I_Stayed_Up_All_Night_With_My_Crush", url: `${STREAM_HOST}/dl/6ad736116e979983cdce5f9f` },
            { title: "Episode 14: Parents_That_Play_Favorites", url: `${STREAM_HOST}/dl/6ad7383b6e979983cdce5fa7` },
            { title: "Episode 15: A_Close_Friend_That_I_Can't_Stand", url: `${STREAM_HOST}/dl/6ad736086e979983cdce5f9d` },
            { title: "Episode 16: How_To_Tell_If_A_Guy_Likes_You", url: `${STREAM_HOST}/dl/6ad736116e979983cdce5f9e` },
            { title: "Episode 17: When_You_Confess_Your_Feelings_About_Her", url: `${STREAM_HOST}/dl/6ad739e76e979983cdce5fae` },
            { title: "Episode 18: My_Closest_Friend_Has_Lied_To_Me", url: `${STREAM_HOST}/dl/6ad7383b6e979983cdce5fa2` },
            { title: "Episode 19: It_Makes_Me_Hate_You,_When_I_Love_You_So_Much", url: `${STREAM_HOST}/dl/6ad736116e979983cdce5fa1` },
            { title: "Episode 20: When_My_Friend_Suspects_Me_In_Front_Of_Others", url: `${STREAM_HOST}/dl/6ad739e76e979983cdce5faf` },
            { title: "Episode 21: My_School_Life_Is_Falling_Apart", url: `${STREAM_HOST}/dl/6ad7383b6e979983cdce5fa3` },
            { title: "Episode 22: Can_We_Be_Friends_Again_After_Having_A_Big_Fight", url: `${STREAM_HOST}/dl/6ad736086e979983cdce5f9c` },
            { title: "Episode 23: Unforgettable_First_Kiss_Txt", url: `${STREAM_HOST}/dl/6ad738446e979983cdce5faa` },
            { title: "Episode 24: The_One_And_Only_People_In_My_Eighteen", url: `${STREAM_HOST}/dl/6ad738446e979983cdce5fa8` },
        ])
    },
    "a_teen2_catalog": {
        id: "a_teen2",
        catalogId: "a_teen2_catalog",
        name: "A-Teen Season 2",
        poster: "https://i.postimg.cc/s26TzY7X/A-Teen-2.jpg",
        background: "https://i.postimg.cc/L41SkXJL/AT-2-WP.jpg",
        backgroundShape: "Landscape",
        description: "The story transitions into their senior year as the group turns 19. The focus shifts toward the heavy realities of the fast-approaching college entrance exams and preparation for the future. Alongside the original crew, the introduction of new transfer students shakes up the group dynamic. The second season takes a deeper, more grounded look at teen angst, classmate jealousy, career goal searching, and the fear of moving into the adult world while trying to preserve their core friendships.",
        episodes: createEpisodes([
            { title: "Episode 1 - Rumors Spread About Me At School", url: `${STREAM_HOST}/dl/6ad89a2a6e979983cdce60a5` },
            { title: "Episode 2 - I Made My Friend Cry", url: `${STREAM_HOST}/dl/6ad89a2a6e979983cdce60a6` },
            { title: "Episode 3 - A Total Stranger Cursed At Me", url: `${STREAM_HOST}/dl/6ad89a2a6e979983cdce60a7` },
            { title: "Episode 4 - My Worst Mistake", url: `${STREAM_HOST}/dl/6ad89a2a6e979983cdce60a8` },
            { title: "Episode 5 - Two People Want The Same Person", url: `${STREAM_HOST}/dl/6ad89a2b6e979983cdce60a9` },
            { title: "Episode 6 - Why Lies Aren't So Bad", url: `${STREAM_HOST}/dl/6ad89a2b6e979983cdce60aa` },
            { title: "Episode 7 - The Two Of Them Had A Secret Date", url: `${STREAM_HOST}/dl/6ad89a2d6e979983cdce60ab` },
            { title: "Episode 8 - A Guy Only I Want To Know", url: `${STREAM_HOST}/dl/6ad89a2d6e979983cdce60ac` },
            { title: "Episode 9 - My Close Friend Has Become My Competitor", url: `${STREAM_HOST}/dl/6ad89a336e979983cdce60ad` },
            { title: "Episode 10 - Someone Who Makes Me Anxious", url: `${STREAM_HOST}/dl/6ad89a336e979983cdce60ae` },
            { title: "Episode 11 - I Pretended To Be A Couple With Someone I Like", url: `${STREAM_HOST}/dl/6ad89a816e979983cdce60b1` },
            { title: "Episode 12 - My Girlfriend Talked Badly About My Family", url: `${STREAM_HOST}/dl/6ad89a816e979983cdce60b2` },
            { title: "Episode 13 - The Reason My Friend Fainted In A Classroom", url: `${STREAM_HOST}/dl/6ad89a816e979983cdce60b0` },
            { title: "Episode 14 - My Video Got Tons Of Malicious Comments", url: `${STREAM_HOST}/dl/6ad89a816e979983cdce60af` },
            { title: "Episode 15 - When You Find Out How The Other Person Really Feels", url: `${STREAM_HOST}/dl/6ad89a836e979983cdce60b4` },
            { title: "Episode 16 - My Secret Crush Finally Ended", url: `${STREAM_HOST}/dl/6ad89a836e979983cdce60b3` },
            { title: "Episode 17 - My Friend Wanted To See Me The Day Before The Exam", url: `${STREAM_HOST}/dl/6ad89a846e979983cdce60b5` },
            { title: "Episode 18 - A Friend I Trusted Betrayed Me", url: `${STREAM_HOST}/dl/6ad89a8a6e979983cdce60b6` },
            { title: "Episode 19 - I Talked Rudely To A Senior I Met For The First Time", url: `${STREAM_HOST}/dl/6ad89a8a6e979983cdce60b7` },
            { title: "Episode 20 - Thank You For Being A Part Of Our 19", url: `${STREAM_HOST}/dl/6ad89a8a6e979983cdce60b8` }
        ])
    },
    "handmade_love_catalog": {
        id: "handmade_love",
        catalogId: "handmade_love_catalog",
        name: "Handmade Love",
        poster: "https://i.postimg.cc/cJ9FWRws/Handmade-Love.jpg",
        background: "https://i.postimg.cc/02VVbG9n/HM-WP.jpg",
        backgroundShape: "Landscape",
        description: "Upon receiving a magically comforting outfit from Woo-bon, Sa-rang experiences profound emotional healing and subsequently joins the tailor shop as a part-time employee. Together, the trio operates the shop, accepting sentimental objects filled with memories as payment. As Woo-bon listens to the diverse, heartbreaking stories of his clients and weaves their remedies into custom clothing, the arrogant god slowly begins to experience true human warmth, empathy, and personal growth.",
        episodes: createEpisodes([
            { title: "Handmade Love Part1", url: `${STREAM_HOST}/dl/6ad736086e979983cdce5f99` },
            { title: "Handmade Love Part2", url: `${STREAM_HOST}/dl/6ad736086e979983cdce5f9a` }
        ])
    },
    "17_special_catalog": {
        id: "17_special",
        catalogId: "17_special_catalog",
        name: "Seventeen Special",
        poster: "https://i.postimg.cc/jdJNWf9w/Seventeen-Special.jpg",
        posterShape: "poster",
        description: "Koleksi Seventeen Special.",
        episodes: createEpisodes([
            { title: "Seventeen - Special Edition", url: `${STREAM_HOST}/dl/6ad73e726e979983cdce5fb3` }
        ])
    },
    "ending_again_catalog": {
        id: "ending_again",
        catalogId: "ending_again_catalog",
        name: "Ending Again",
        poster: "https://i.postimg.cc/25c0YQh5/Ending-Again.jpg",
        background: "https://i.postimg.cc/htxQHgZW/EA-WP.jpg",
        backgroundShape: "Landscape",
        description: "A year later, disaster strikes when she falls victim to a major real estate scam, losing her entire housing deposit and facing eviction. At the exact same time, her ex-boyfriend Chan-hee returns to Korea as a famous artist and begins working directly with her gallery.",
        episodes: createEpisodes([
            { title: "Ending Again 1-12", url: `${STREAM_HOST}/dl/6ad74fff6e979983cdce5fb4` }
        ])
    },
    "be_my_boyfriend_catalog": {
        id: "be_my_boyfriend",
        catalogId: "be_my_boyfriend_catalog",
        name: "Be My Boyfriend",
        poster: "https://i.postimg.cc/g0SgpV8b/Be-My-Boyfriend.jpg",
        background: "https://i.postimg.cc/5t49nMZK/BMB-WP.jpg",
        backgroundShape: "Landscape",
        description: "When Ji-na seeks a way to handle her complicated social circles and push back against her neglectful ex-boyfriend—the star baseball player Ku Hyung-tak—she grabs a random photo off the school bulletin board to claim she has a new boyfriend. That photo happens to be Seung-min. Ji-na unexpectedly offers Seung-min a 50-day contract relationship.",
        episodes: createEpisodes([
            { title: "Be My Boyfriend Episode 1", url: `${STREAM_HOST}/dl/6ad790ca6e979983cdce6094` },
            { title: "Be My Boyfriend Episode 2", url: `${STREAM_HOST}/dl/6ad790ca6e979983cdce6091` },
            { title: "Be My Boyfriend Episode 3", url: `${STREAM_HOST}/dl/6ad790ca6e979983cdce6092` },
            { title: "Be My Boyfriend Episode 4", url: `${STREAM_HOST}/dl/6ad790ca6e979983cdce6095` },
            { title: "Be My Boyfriend Episode 5", url: `${STREAM_HOST}/dl/6ad790ca6e979983cdce6093` },
            { title: "Be My Boyfriend Episode 6", url: `${STREAM_HOST}/dl/6ad790ca6e979983cdce6090` },
            { title: "Be My Boyfriend Episode 7", url: `${STREAM_HOST}/dl/6ad790cd6e979983cdce6096` },
            { title: "Be My Boyfriend Episode 8", url: `${STREAM_HOST}/dl/6ad790d36e979983cdce6097` },
            { title: "Be My Boyfriend Episode 9", url: `${STREAM_HOST}/dl/6ad790d36e979983cdce6098` },
            { title: "Be My Boyfriend Episode 10", url: `${STREAM_HOST}/dl/6ad790d36e979983cdce6099` },
            { title: "Be My Boyfriend Episode 11", url: `${STREAM_HOST}/dl/6ad790ee6e979983cdce609e` },
            { title: "Be My Boyfriend Episode 12", url: `${STREAM_HOST}/dl/6ad790ee6e979983cdce609d` },
            { title: "Be My Boyfriend Episode 13", url: `${STREAM_HOST}/dl/6ad790ee6e979983cdce609c` },
            { title: "Be My Boyfriend Episode 14", url: `${STREAM_HOST}/dl/6ad790ee6e979983cdce609b` },
            { title: "Be My Boyfriend Episode 15", url: `${STREAM_HOST}/dl/6ad790ee6e979983cdce609a` }   
        ])
    },
    "mermaid_prince_catalog": {
        id: "mermaid_prince",
        catalogId: "mermaid_prince_catalog",
        name: "Mermaid prince",
        poster: "https://i.postimg.cc/8CKZGRW2/Mermaid-Prince.jpg",
        background: "https://i.postimg.cc/gjWGLFqy/MP-WP.jpg",
        backgroundShape: "Landscape",
        description: "When she wakes up, she discovers that the man is Choi Woo-hyuk (Moon Bin), a striking yet highly enigmatic individual who operates the local beachside guesthouse where she and her friends are staying. Woo-hyuk exhibits highly unusual behavior: he constantly has wet hair, refuses physical boundaries due to tactile agnosia, and holds a deeply dreamy, ocean-bound aura. Captivated by his secrets and intense connection to the sea, Hye-ri and her friends affectionately nickname him the Mermaid Prince. As the two grow closer, a fantasy-tinged romantic mystery unfolds as Hye-ri tries to uncover his true identity and the secrets hidden in his room.",
        episodes: createEpisodes([
            { title: "Mermaid Prince Episode 1", url: `${STREAM_HOST}/dl/6ad794af6e979983cdce60a1` },
            { title: "Mermaid Prince Episode 2", url: `${STREAM_HOST}/dl/6ad794af6e979983cdce60a3` },
            { title: "Mermaid Prince Episode 3", url: `${STREAM_HOST}/dl/6ad794af6e979983cdce60a0` },
            { title: "Mermaid Prince Episode 4", url: `${STREAM_HOST}/dl/6ad794af6e979983cdce60a2` },
            { title: "Mermaid Prince Episode 5", url: `${STREAM_HOST}/dl/6ad794af6e979983cdce609f` },
            { title: "Mermaid Prince Episode 6", url: `${STREAM_HOST}/dl/6ad794af6e979983cdce60a4` },
            { title: "Mermaid Prince Episode 7", url: `${STREAM_HOST}/dl/6ad8a0e46e979983cdce60ba` },
            { title: "Mermaid Prince Episode 8", url: `${STREAM_HOST}/dl/6ad8a0e46e979983cdce60bb` },
            { title: "Mermaid Prince Episode 9", url: `${STREAM_HOST}/dl/6ad8a0e46e979983cdce60b9` },
            { title: "Mermaid Prince Episode 10", url: `${STREAM_HOST}/dl/6ad8a0e46e979983cdce60bc` }
        ])
    },
    "dalgona_catalog": {
        id: "dalgona",
        catalogId: "dalgona_catalog",
        name: "Dalgona",
        poster: "https://i.postimg.cc/q7b1rsyC/Dalgona.jpg",
        posterShape: "poster",
        description: "Koleksi Dalgona.",
        episodes: createEpisodes([
            { title: "Dalgona", url: `${STREAM_HOST}/dl/6ad768f26e979983cdce5ffc` }
        ])
    },
    "flower_catalog": {
        id: "flower",
        catalogId: "flower_catalog",
        name: "Flower Ever After",
        poster: "https://i.postimg.cc/7LsK430q/Flower-Ever-After.jpg",
        posterShape: "poster",
        description: "Koleksi Flower Ever After.",
        episodes: createEpisodes([
            { title: "Flower Ever After", url: `${STREAM_HOST}/dl/6ad768f26e979983cdce5ffb` }
        ])
    },
    "dash_catalog": {
        id: "dash",
        catalogId: "dash_catalog",
        name: "Dash Yonkuro",
        poster: "https://i.postimg.cc/wvs4kwbM/Dash-Yonkuro.jpg",
        posterShape: "poster",
        description: "Koleksi Dash Yonkuro.",
        episodes: createEpisodes([ 
            { title: "Dash Yonkuro Episode 1", url: `${STREAM_HOST}/dl/6ad6535b6e979983cdce5f5c` },
            { title: "Dash Yonkuro Episode 2", url: `${STREAM_HOST}/dl/6ad6535b6e979983cdce5f5b` },
            { title: "Dash Yonkuro Episode 3", url: `${STREAM_HOST}/dl/6ad6535b6e979983cdce5f5e` },
            { title: "Dash Yonkuro Episode 4", url: `${STREAM_HOST}/dl/6ad6535b6e979983cdce5f5d` },
            { title: "Dash Yonkuro Episode 5", url: `${STREAM_HOST}/dl/6ad6535b6e979983cdce5f5a` },
            { title: "Dash Yonkuro Episode 6", url: `${STREAM_HOST}/dl/6ad6535b6e979983cdce5f59` },
            { title: "Dash Yonkuro Episode 7", url: `${STREAM_HOST}/dl/6ad653636e979983cdce5f5f` },
            { title: "Dash Yonkuro Episode 8", url: `${STREAM_HOST}/dl/6ad653636e979983cdce5f60` },
            { title: "Dash Yonkuro Episode 9", url: `${STREAM_HOST}/dl/6ad653646e979983cdce5f61` },
            { title: "Dash Yonkuro Episode 10", url: `${STREAM_HOST}/dl/6ad653646e979983cdce5f62` },
            { title: "Dash Yonkuro Episode 11", url: `${STREAM_HOST}/dl/6ad653696e979983cdce5f63` },
            { title: "Dash Yonkuro Episode 12", url: `${STREAM_HOST}/dl/6ad653696e979983cdce5f64` },
            { title: "Dash Yonkuro Episode 13", url: `${STREAM_HOST}/dl/6ad6536e6e979983cdce5f65` },
            { title: "Dash Yonkuro Episode 14", url: `${STREAM_HOST}/dl/6ad6536e6e979983cdce5f66` },
            { title: "Dash Yonkuro Episode 15", url: `${STREAM_HOST}/dl/6ad6536e6e979983cdce5f67` },
            { title: "Dash Yonkuro Episode 16", url: `${STREAM_HOST}/dl/6ad6536e6e979983cdce5f68` },
            { title: "Dash Yonkuro Episode 17", url: `${STREAM_HOST}/dl/6ad653a06e979983cdce5f69` },
            { title: "Dash Yonkuro Episode 18", url: `${STREAM_HOST}/dl/6ad653a06e979983cdce5f6a` },
            { title: "Dash Yonkuro Episode 19", url: `${STREAM_HOST}/dl/6ad653a06e979983cdce5f6b` },
            { title: "Dash Yonkuro Episode 20", url: `${STREAM_HOST}/dl/6ad653a06e979983cdce5f6c` },
            { title: "Dash Yonkuro Episode 21", url: `${STREAM_HOST}/dl/6ad653a66e979983cdce5f6d` },
            { title: "Dash Yonkuro Episode 22", url: `${STREAM_HOST}/dl/6ad653ac6e979983cdce5f6e` },
            { title: "Dash Yonkuro Episode 23", url: `${STREAM_HOST}/dl/6ad653ac6e979983cdce5f70` },
            { title: "Dash Yonkuro Episode 24", url: `${STREAM_HOST}/dl/6ad653ac6e979983cdce5f71` },
            { title: "Dash Yonkuro Episode 25", url: `${STREAM_HOST}/dl/6ad653ac6e979983cdce5f6f` }
        ])
    },
    "satria_7pahlawan_catalog": {
        id: "satria_7pahlawan",
        catalogId: "satria_7pahlawan_catalog",
        name: "Satria 7 Pahlawan",
        poster: "https://i.postimg.cc/RZbQgHSb/SATRIA.jpg",
        posterShape: "poster",
        description: "Koleksi Siri Satria 7 Pahlawan.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6accb2bf6e979983cdce5a7f` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6accb2bf6e979983cdce5a7d` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6accb2bf6e979983cdce5a7b` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6accb2bf6e979983cdce5a7e` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6accb2bf6e979983cdce5a7a` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6accb2bf6e979983cdce5a7c` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6accb2c76e979983cdce5a80` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6accb2c76e979983cdce5a81` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6accb2c76e979983cdce5a82` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6accb2c76e979983cdce5a83` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6accb2cd6e979983cdce5a84` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6accb2cd6e979983cdce5a85` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6accb2d26e979983cdce5a86` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6accb2d26e979983cdce5a87` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6accb2fe6e979983cdce5a88` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6accb2fe6e979983cdce5a89` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6accb2fe6e979983cdce5a8a` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6accb2ff6e979983cdce5a8b` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6accb3036e979983cdce5a8c` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6accb3036e979983cdce5a8d` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6accb3096e979983cdce5a8e` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6accb3096e979983cdce5a8f` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6accb3096e979983cdce5a90` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6accb30e6e979983cdce5a91` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6accb30e6e979983cdce5a92` },
            { title: "Episode 26", url: `${STREAM_HOST}/dl/6accb33a6e979983cdce5a93` }
        ])
    },
    "tiny_planet_catalog": {
        id: "tiny_planet",
        catalogId: "tiny_planet_catalog",
        name: "Tiny Planet",
        poster: "https://i.postimg.cc/jjTp9pGj/Tiny-Planets-Cover.webp",
        posterShape: "poster",
        description: "Koleksi Siri Tiny Planet.",
        episodes: createEpisodes([
            { title: "Tiny Planets Winter Warm Ups", url: "https://files.catbox.moe/tkfroo.mp4" },
            { title: "Tiny Planets Mixing Colors", url: "https://files.catbox.moe/ri884d.mp4" },
            { title: "Tiny Planets Moving & Grooving", url: "https://files.catbox.moe/mjltuz.mp4" },
            { title: "Tiny Planets Night Light Sleep Tight", url: "https://files.catbox.moe/q25qc5.mp4" },
            { title: "Tiny Planets Odd Bing Out", url: "https://files.catbox.moe/3u0fed.mp4" },
            { title: "Tiny Planets On The Right Track", url: "https://files.catbox.moe/8kcud8.mp4" },
            { title: "Tiny Planets Patterns on Parade", url: "https://files.catbox.moe/mrkdi5.mp4" },
            { title: "Tiny Planets Pedal Meddle", url: "https://files.catbox.moe/e6lid7.mp4" },
            { title: "Tiny Planets Picnic Poser", url: "https://files.catbox.moe/drsurg.mp4" },
            { title: "Tiny Planets Pivotal Points", url: "https://files.catbox.moe/73stip.mp4" },
            { title: "Tiny Planets Pooling Resources", url: "https://files.catbox.moe/wftp4a.mp4" },
            { title: "Tiny Planets Ramping Up", url: "https://files.catbox.moe/3ntjos.mp4" },
            { title: "Tiny Planets Rhythm & Moods", url: "https://files.catbox.moe/yiqeho.mp4" },
            { title: "Tiny Planets Road Block", url: "https://files.catbox.moe/lnwavw.mp4" },
            { title: "Tiny Planets Seasons Machine", url: "https://files.catbox.moe/6sqqla.mp4" },
            { title: "Tiny Planets Shadow Showdown", url: "https://files.catbox.moe/4gkqzh.mp4" },
            { title: "Tiny Planets Shapes Alive", url: "https://files.catbox.moe/9rhxgn.mp4" },
            { title: "Tiny Planets Shapes and Ladders", url: "https://files.catbox.moe/7zyf1w.mp4" },
            { title: "Tiny Planets Shower Power", url: "https://files.catbox.moe/sg6k6g.mp4" },
            { title: "Tiny Planets Slippery Slope", url: "https://files.catbox.moe/zrjtmf.mp4" },
            { title: "Tiny Planets Making Rainbows", url: "https://files.catbox.moe/h3tsda.mp4" },
            { title: "Tiny Planets Mirror Magic", url: "https://files.catbox.moe/ybuwrr.mp4" },
            { title: "Body Talk", url: "https://files.catbox.moe/t0ez6w.mp4" },
            { title: "Shadow Showdown", url: "https://files.catbox.moe/pa8rjw.mp4" },
            { title: "The Fisher Bing", url: "https://files.catbox.moe/elfpdv.mp4" },
            { title: "Tiny Planets - Tools, Glorious Tools", url: "https://files.catbox.moe/66fc5e.mp4" },
            { title: "Tiny Planets 3D or not 3D", url: "https://files.catbox.moe/219k9e.mp4" },
            { title: "Tiny Planets A Chorus Line", url: "https://files.catbox.moe/mhgpv3.mp4" },
            { title: "Tiny Planets A Place For Everything", url: "https://files.catbox.moe/f60qsl.mp4" },
            { title: "Tiny Planets Be a Sport", url: "https://files.catbox.moe/i19tg8.mp4" },
            { title: "Tiny Planets Big and Small", url: "https://files.catbox.moe/un4mgn.mp4" },
            { title: "Tiny Planets Bing Bong Bell", url: "https://files.catbox.moe/4yh70l.mp4" },
            { title: "Tiny Planets Birthday Build-Up", url: "https://files.catbox.moe/a7kzqi.mp4" },
            { title: "Tiny Planets Blown Away", url: "https://files.catbox.moe/1rcrzk.mp4" },
            { title: "Tiny Planets Body Talk", url: "https://files.catbox.moe/swz7o1.mp4" },
            { title: "Tiny Planets Box of Tricks", url: "https://files.catbox.moe/wsknbw.mp4" },
            { title: "Tiny Planets Color Clues", url: "https://files.catbox.moe/k77602.mp4" },
            { title: "Tiny Planets Contrasting Views", url: "https://files.catbox.moe/qydao9.mp4" },
            { title: "Tiny Planets Desperately Seeking Silence", url: "https://files.catbox.moe/zhiact.mp4" },
            { title: "Tiny Planets Easy Rider", url: "https://files.catbox.moe/9xzewy.mp4" },
            { title: "Tiny Planets Egg-stra Large", url: "https://files.catbox.moe/bn2x6g.mp4" },
            { title: "Tiny Planets Everyone's a Winner", url: "https://files.catbox.moe/kl50uk.mp4" },
            { title: "Tiny Planets Flocker Flicker", url: "https://files.catbox.moe/smav68.mp4" },
            { title: "Tiny Planets Flockercise", url: "https://files.catbox.moe/4bii9q.mp4" },
            { title: "Tiny Planets Flower Power", url: "https://files.catbox.moe/dkwhml.mp4" },
            { title: "Tiny Planets Found Sound Orchestra", url: "https://files.catbox.moe/czqp43.mp4" },
            { title: "Tiny Planets Free Wheeling", url: "https://files.catbox.moe/j34367.mp4" },
            { title: "Tiny Planets Give Me Five", url: "https://files.catbox.moe/t75h0n.mp4" },
            { title: "Tiny Planets Snow Problem", url: "https://files.catbox.moe/1pa76q.mp4" },
            { title: "Tiny Planets Spring Cleaning", url: "https://files.catbox.moe/i7sw72.mp4" },
            { title: "Tiny Planets Strength in Girders", url: "https://files.catbox.moe/5viypg.mp4" },
            { title: "Tiny Planets Suits You", url: "https://files.catbox.moe/lmm65v.mp4" },
            { title: "Tiny Planets Sweet Temptations", url: "https://files.catbox.moe/oh0hth.mp4" },
            { title: "Tiny Planets That's What Friends Are For", url: "https://files.catbox.moe/my9sgi.mp4" },
            { title: "Tiny Planets The Fisher Bing", url: "https://files.catbox.moe/es2ka2.mp4" },
            { title: "Tiny Planets The Light Fantastic", url: "https://files.catbox.moe/xnwr58.mp4" },
            { title: "Tiny Planets The Right Angle", url: "https://files.catbox.moe/x3riwb.mp4" },
            { title: "Tiny Planets Tip The Scales", url: "https://files.catbox.moe/czshhb.mp4" },
            { title: "Tiny Planets Tools Glorious Tools", url: "https://files.catbox.moe/5o1nd5.mp4" },
            { title: "Tiny Planets Tuba Trouble", url: "https://files.catbox.moe/lbcicr.mp4" },
            { title: "Tiny Planets What's Cooking", url: "https://files.catbox.moe/6rqgg7.mp4" },
            { title: "Tiny Planets Hear My Song", url: "https://files.catbox.moe/ah2nxd.mp4" },
            { title: "Tiny Planets Highs & Lows", url: "https://files.catbox.moe/59s0ju.mp4" },
            { title: "Tiny Planets It's Raining Bongs", url: "https://files.catbox.moe/vd7hhf.mp4" },
            { title: "Tiny Planets Jammin' Session", url: "https://files.catbox.moe/fbbpgt.mp4" },
            { title: "Tiny Planets Keep Your Head", url: "https://files.catbox.moe/jzp0u7.mp4" },
            { title: "Tiny Planets Love is All You Need", url: "https://files.catbox.moe/84imda.mp4" },
            { title: "Tiny Planets Magnificent Seven", url: "https://files.catbox.moe/cyqamo.mp4" }
        ])
    },
    "mr_bean_s1_catalog": {
        id: "mr_bean_s1",
        catalogId: "mr_bean_s1_catalog",
        name: "Mr Bean Animation S1",
        poster: "https://i.postimg.cc/ZqmGgG10/Mr-Bean-S1.jpg",
        posterShape: "poster",
        description: "Koleksi Siri Mr Bean S1.",
        episodes: createEpisodes([
            { title: "Mr. Bean - S01E01 - In the Wild", url: "https://files.catbox.moe/44v4el.mp4" },
            { title: "Mr. Bean - S01E02 - Missing Teddy", url: "https://files.catbox.moe/4xmrb3.mp4" },
            { title: "Mr. Bean - S01E03 - No Parking", url: "https://files.catbox.moe/wv66n9.mp4" },
            { title: "Mr. Bean - S01E04 - Bean's Bounty", url: "https://files.catbox.moe/r3oblz.mp4" },
            { title: "Mr. Bean - S01E05 - Mime Games", url: "https://files.catbox.moe/wk6vlw.mp4" },
            { title: "Mr. Bean - S01E06 - Spring Clean", url: "https://files.catbox.moe/9z767a.mp4" },
            { title: "Mr. Bean - S01E07 - Birthday Bear", url: "https://files.catbox.moe/0a9ag7.mp4" },
            { title: "Mr. Bean - S01E08 - The Mole", url: "https://files.catbox.moe/c269on.mp4" },
            { title: "Mr. Bean - S01E09 - Roadworks", url: "https://files.catbox.moe/p1d56u.mp4" },
            { title: "Mr. Bean - S01E10 - The Sofa", url: "https://files.catbox.moe/g1lm39.mp4" },
            { title: "Mr. Bean - S01E11 - Treasure", url: "https://files.catbox.moe/wwl6nw.mp4" },
            { title: "Mr. Bean - S01E12 - Homeless", url: "https://files.catbox.moe/ze1wbc.mp4" },
            { title: "Mr. Bean - S01E13 - Nurse", url: "https://files.catbox.moe/6p4owm.mp4" },
            { title: "Mr. Bean - S01E14 - Dead Cat", url: "https://files.catbox.moe/j9d2wg.mp4" },
            { title: "Mr. Bean - S01E15 - Super Trolley", url: "https://files.catbox.moe/bwaylb.mp4" },
            { title: "Mr. Bean - S01E16 - Magpie", url: "https://files.catbox.moe/ukt669.mp4" },
            { title: "Mr. Bean - S01E17 - Cat Sitting", url: "https://files.catbox.moe/19hpfc.mp4" },
            { title: "Mr. Bean - S01E18 - The Bottle", url: "https://files.catbox.moe/6zd18w.mp4" }
        ])
    },
    "mr_bean_s2_catalog": {
        id: "mr_bean_s2",
        catalogId: "mr_bean_s2_catalog",
        name: "Mr Bean Animation S2",
        poster: "https://i.postimg.cc/CK03t3WF/Mr-Bean-S2.jpg",
        posterShape: "poster",
        description: "Koleksi Siri Mr Bean S2.",
        episodes: createEpisodes([
            { title: "Mr. Bean - S02E01 - Goldfish", url: "https://files.catbox.moe/rflcq0.mp4" },
            { title: "Mr. Bean - S02E02 - Inventor", url: "https://files.catbox.moe/ffozh7.mp4" },
            { title: "Mr. Bean - S02E03 - Royal Bean", url: "https://files.catbox.moe/4qvurx.mp4" },
            { title: "Mr. Bean - S02E04 - Young Bean", url: "https://files.catbox.moe/9ok2yv.mp4" },
            { title: "Mr. Bean - S02E05 - In the Pink", url: "https://files.catbox.moe/1igune.mp4" },
            { title: "Mr. Bean - S02E06 - Dinner for Two", url: "https://files.catbox.moe/2mdrg1.mp4" },
            { title: "Mr. Bean - S02E07 - The Ball", url: "https://files.catbox.moe/7usn90.mp4" },
            { title: "Mr. Bean - S02E08 - Toothache", url: "https://files.catbox.moe/2frkte.mp4" },
            { title: "Mr. Bean - S02E09 - Haircut", url: "https://files.catbox.moe/5e2c15.mp4" },
            { title: "Mr. Bean - S02E10 - Neighbourly Bean", url: "https://files.catbox.moe/t22frs.mp4" },
            { title: "Mr. Bean - S02E11 - Car Trouble", url: "https://files.catbox.moe/ahqxc7.mp4" },
            { title: "Mr. Bean - S02E12 - Restaurant", url: "https://files.catbox.moe/u24kxo.mp4" },
            { title: "Mr. Bean - S02E13 - Art Thief", url: "https://files.catbox.moe/c7awhx.mp4" },
            { title: "Mr. Bean - S02E14 - Scaredy Bean", url: "https://files.catbox.moe/3s86o9.mp4" },
            { title: "Mr. Bean - S02E15 - Hot Date", url: "https://files.catbox.moe/ht4s88.mp4" },
            { title: "Mr. Bean - S02E16 - Wanted", url: "https://files.catbox.moe/1drr6q.mp4" }
        ])
    },
    "mr_bean_s3_catalog": {
        id: "mr_bean_s3",
        catalogId: "mr_bean_s3_catalog",
        name: "Mr Bean Animation S3",
        poster: "https://i.postimg.cc/43GDMDrd/Mr-Bean-S3.jpg",
        posterShape: "poster",
        description: "Koleksi Siri Mr Bean S3.",
        episodes: createEpisodes([
            { title: "Mr. Bean - S03E01 - Gadget Kid", url: "https://files.catbox.moe/l0g3f8.mp4" },
            { title: "Mr. Bean - S03E02 - The Visitor", url: "https://files.catbox.moe/aqq6li.mp4" },
            { title: "Mr. Bean - S03E03 - Big TV", url: "https://files.catbox.moe/x1c2qr.mp4" },
            { title: "Mr. Bean - S03E04 - Keyboard Capers", url: "https://files.catbox.moe/g7ht03.mp4" },
            { title: "Mr. Bean - S03E05 - Artful Bean", url: "https://files.catbox.moe/xha6yt.mp4" },
            { title: "Mr. Bean - S03E06 - The Fly", url: "https://files.catbox.moe/83xltd.mp4" },
            { title: "Mr. Bean - S03E07 - A Royal Makeover", url: "https://files.catbox.moe/4ooc6h.mp4" },
            { title: "Mr. Bean - S03E08 - SuperMarrow", url: "https://files.catbox.moe/d6pzs4.mp4" },
            { title: "Mr. Bean - S03E09 - A Running Battle", url: "https://files.catbox.moe/sdf0f3.mp4" },
            { title: "Mr. Bean - S03E10 - Egg And Bean", url: "https://files.catbox.moe/7234su.mp4" },
            { title: "Mr. Bean - S03E11 - Camping", url: "https://files.catbox.moe/tg8rtr.mp4" },
            { title: "Mr. Bean - S03E12 - Chocks Away", url: "https://files.catbox.moe/523jwl.mp4" },
            { title: "Mr. Bean - S03E13 - Hopping Mad!", url: "https://files.catbox.moe/9fj0q6.mp4" },
            { title: "Mr. Bean - S03E14 - A Grand Invitation", url: "https://files.catbox.moe/srq53r.mp4" },
            { title: "Mr. Bean - S03E15 - No Pets", url: "https://files.catbox.moe/hos9u7.mp4" },
            { title: "Mr. Bean - S03E16 - Ray of Sunshine", url: "https://files.catbox.moe/64card.mp4" },
            { title: "Mr. Bean - S03E17 - Bean in Love", url: "https://files.catbox.moe/pftui1.mp4" },
            { title: "Mr. Bean - S03E18 - Double Trouble", url: "https://files.catbox.moe/53549o.mp4" }
        ])
    },
    "mr_bean_s4_catalog": {
        id: "mr_bean_s4",
        catalogId: "mr_bean_s4_catalog",
        name: "Mr Bean Animation S4",
        poster: "https://i.postimg.cc/q7rPYP9J/Mr-Bean-S4.jpg",
        posterShape: "poster",
        description: "Koleksi Siri Mr Bean S4.",
        episodes: createEpisodes([
            { title: "Mr. Bean - S04E01 - Home Movie", url: "https://files.catbox.moe/tu7s7n.mp4" },
            { title: "Mr. Bean S04E02 - Fish Sitting", url: "https://files.catbox.moe/1mqjyv.mp4" },
            { title: "Mr. Bean S04E03 - The Cruise", url: "https://files.catbox.moe/5sgq8x.mp4" },
            { title: "Mr. Bean S04E04 - Coconut Shy", url: "https://files.catbox.moe/uidojc.mp4" },
            { title: "Mr. Bean S04E05 - Green Bean", url: "https://files.catbox.moe/kcg2iz.mp4" },
            { title: "Mr. Bean S04E06 - Cash Machine", url: "https://files.catbox.moe/56vjp9.mp4" },
            { title: "Mr. Bean S04E07 - Litterbugs", url: "https://files.catbox.moe/f78q3k.mp4" },
            { title: "Mr. Bean S04E08 - Rat Trap", url: "https://files.catbox.moe/o239en.mp4" },
            { title: "Mr. Bean S04E09 - Valentine's Bean", url: "https://files.catbox.moe/9bk4jf.mp4" },
            { title: "Mr. Bean S04E10 - All You Can Eat", url: "https://files.catbox.moe/jitdnc.mp4" },
            { title: "Mr. Bean S04E11 - Flat Pack", url: "https://files.catbox.moe/lad40v.mp4" },
            { title: "Mr. Bean S04E12 - Holiday for Teddy", url: "https://files.catbox.moe/zo8nbd.mp4" },
            { title: "Mr. Bean S04E13 - The Newspaper", url: "https://files.catbox.moe/3h9le4.mp4" },
            { title: "Mr. Bean S04E14 - Viral Bean", url: "https://files.catbox.moe/gsv8at.mp4" },
            { title: "Mr. Bean S04E15 - Super Spy", url: "https://files.catbox.moe/o9ye92.mp4" },
            { title: "Mr. Bean S04E16 - Scout Bean", url: "https://files.catbox.moe/c0la7u.mp4" },
            { title: "Mr. Bean S04E17 - Back to School", url: "https://files.catbox.moe/ub3wcd.mp4" },
            { title: "Mr. Bean S04E18 - Lord Bean", url: "https://files.catbox.moe/njyuxn.mp4" },
            { title: "Mr. Bean S04E19 - Car Wars", url: "https://files.catbox.moe/rdy8aa.mp4" },
            { title: "Mr. Bean S04E20 - Wedding Day", url: "https://files.catbox.moe/0r92uv.mp4" },
            { title: "Mr. Bean S04E40 - A Round of Golf", url: "https://files.catbox.moe/jzpfyc.mp4" },
            { title: "Mr. Bean S04E41 - Superhero Bean", url: "https://files.catbox.moe/zzpzw1.mp4" },
            { title: "Mr. Bean S04E42 - What A Load of Rubbish", url: "https://files.catbox.moe/atyot7.mp4" },
            { title: "Mr. Bean S04E43 - The Robot", url: "https://files.catbox.moe/rsu7xy.mp4" },
            { title: "Mr. Bean S04E44 - Ice Cream", url: "https://files.catbox.moe/advhjm.mp4" },
            { title: "Mr. Bean S04E45 - Birthday Party", url: "https://files.catbox.moe/geol55.mp4" },
            { title: "Mr. Bean S04E46 - In the Garden", url: "https://files.catbox.moe/ww0w5s.mp4" },
            { title: "Mr. Bean S04E47 - A Magic Day Out", url: "https://files.catbox.moe/5blz1b.mp4" },
            { title: "Mr. Bean S04E48 - Ball Pool", url: "https://files.catbox.moe/1tyxzi.mp4" },
            { title: "Mr. Bean S04E49 -  Pizza Bean", url: "https://files.catbox.moe/pq7mhc.mp4" },
            { title: "Mr. Bean S04E50 - The Photograph", url: "https://files.catbox.moe/o6sxf9.mp4" },
            { title: "Mr. Bean S04E51 - Dancing Bean", url: "https://files.catbox.moe/8q6fep.mp4" },
            { title: "Mr. Bean S04E52 - Bean Shopping", url: "https://files.catbox.moe/fyb0kn.mp4" }
        ])
    },
    "mahsyar_catalog": {
        id: "mahsyar",
        catalogId: "mahsyar_catalog",
        name: "Mahsyar",
        poster: "https://i.postimg.cc/nVR03TYz/Mahsyar.jpg",
        posterShape: "poster",
        description: "Koleksi Siri Mahsyar (Episod 1 - 7).",
        episodes: createEpisodes([
            { title: "Mahsyar 1 - Kalau Binatang Sahaja Pun Dah Sesak", url: `${STREAM_HOST}/dl/6acbf4e66e979983cdce554a` },
            { title: "Mahsyar 2 - Berselisih Dengan Ahli Keluarga, Tidak Bertegur", url: "https://files.catbox.moe/5mgrcm.mp4" },
            { title: "Mahsyar 3 - Berapa Kumpulan Manusia Di Mahsyar", url: `${STREAM_HOST}/dl/6acbf4f36e979983cdce554b` },
            { title: "Mahsyar 4 - Beliau Empunya Syafaat Teragung", url: `${STREAM_HOST}/dl/6acbf4fe6e979983cdce554c` },
            { title: "Mahsyar 5 - Mizan, Mesti Canggih Alat Timbangan Amal", url: "https://files.catbox.moe/x9i1ns.mp4" },
            { title: "Mahsyar 6 - Tak Terbayang 1000 Tahun Di Dalam Api", url: `${STREAM_HOST}/dl/6acbf5076e979983cdce554d` },
            { title: "Mahsyar 7 - Syurga Atau Neraka Semuanya Pilihan Diri", url: "https://files.catbox.moe/oxfje5.mp4" }
        ])
    },
    "ustaz_azhar_catalog": {
        id: "ustaz_azhar_catalog",
        isMulti: true,
        items: [
            { id: "ustaz_azhar_nabi_muhammad_bangsa_arab", name: "Nabi Muhammad & Bangsa Arab", poster: "https://i.postimg.cc/JhMv8mhT/Nabi-Muhammad-amp-Bangsa-Arab.jpg", url: `${STREAM_HOST}/dl/6ae343bb6e979983cdce64e0` },
            { id: "ustaz_azhar_tiada_lagi_nabi_selepas_aku", name: "Tiada Lagi Nabi Selepas Aku", poster: "https://i.postimg.cc/7Lwd4DLK/Tiada-Lagi-Nabi-Selepas-Aku.jpg", url: `${STREAM_HOST}/dl/6ae343bb6e979983cdce64de` },
            { id: "ustaz_azhar_idrus_mengenal_allah", name: "MENGENAL ALLAH", poster: "https://i.postimg.cc/pdC7X79K/MENGENAL-ALLAH.jpg", url: `${STREAM_HOST}/dl/6ae343bb6e979983cdce64dd` },
            { id: "ustaz_azhar_kenali_rasulullah_1", name: "Kenali Rasulullah 1", poster: "https://i.postimg.cc/CMrg4ZKg/Kenali-Rasulullah-1.jpg", url: `${STREAM_HOST}/dl/6ae343bb6e979983cdce64e1` },
            { id: "ustaz_azhar_kenali_rasulullah_2", name: "Kenali Rasulullah 2", poster: "https://i.postimg.cc/nL25c5sk/Kenali-Rasulullah-2.jpg", url: `${STREAM_HOST}/dl/6ae343bb6e979983cdce64df` },
            { id: "ustaz_azhar_sahabat_nabi", name: "Sahabat Nabi", poster: "https://i.postimg.cc/QMhwDsM0/Sahabat-Nabi.jpg", url: `${STREAM_HOST}/dl/6ae343bb6e979983cdce64e2` }
        ]
    },
    "filem_dakwah_sengketa_catalog": {
        id: "filem_dakwah_sengketa",
        catalogId: "filem_dakwah_sengketa_catalog",
        name: "Filem Dakwah - Sengketa",
        poster: "https://i.postimg.cc/SQTDgV7K/Sengketa.jpg",
        posterShape: "poster",
        description: "Koleksi Filem Dakwah - Sengketa.",
        episodes: createEpisodes([
            { title: "Sengketa 1", url: "https://files.catbox.moe/6qk9eh.mp4" },
            { title: "Sengketa 2", url: "https://files.catbox.moe/4uiyst.mp4" }
        ])
    },
    "sirah_nabawiyyah_catalog": {
        id: "sirah_nabawiyyah",
        catalogId: "sirah_nabawiyyah_catalog",
        name: "Sirah Nabawiyyah",
        poster: "https://i.postimg.cc/9Qp02k9d/Ustaz-Azlan-Shah.jpg",
        posterShape: "poster",
        description: "Koleksi Sirah Nabawiyyah - UAS.",
        episodes: createEpisodes([
            { title: "Episode 1 - Serangan Tentera Bergajah", url: "https://files.catbox.moe/wuyth6.mp4" },
            { title: "Episode 2 - Kisah Luar Biasa Moyang, Datuk dan Ayah kepada Nabi Muhammad SAW", url: "https://files.catbox.moe/lk3joi.mp4" },
            { title: "Episode 3 - Kisah Ghulam Pendakwah Muda (Ashabul Ukhdud)", url: "https://files.catbox.moe/s8p8mo.mp4" },
            { title: "Episode 4 - Kelahiran Dan Penyusuan Nabi Muhammad Saw", url: "https://files.catbox.moe/h4mkh9.mp4" },
            { title: "Episode 5 - Kehilangan Ibu Dan Datuk Kesayangan", url: "https://files.catbox.moe/hd3byi.mp4" },
            { title: "Episode 6 - Hidup Bersama Abu Talib Sekeluarga", url: "https://files.catbox.moe/kn13zo.mp4" },
            { title: "Episode 7 - Nabi Muhammad Ke Syam Bersama Abu Talib", url: "https://files.catbox.moe/o8t06x.mp4" },
            { title: "Episode 8 - Perperangan Al-Fijar & Perjanjian Al-Fudhul", url: "https://files.catbox.moe/dwrjz7.mp4" },
            { title: "Episode 9 - Perkahwinan Dengan Khadijah Ra & Anak-Anak Nabi Muhammad Saw", url: "https://files.catbox.moe/a0szcs.mp4" },
            { title: "Episode 10 - Pembinaan Semula Ka’Bah & Sejarah Hajar Al-Aswad", url: "https://files.catbox.moe/mcfkeg.mp4" },
            { title: "Episode 11 - Penerimaan Wahyu Pertama", url: "https://files.catbox.moe/tphs40.mp4" },
            { title: "Episode 12 - Kisah Berhala Pertama di Ka'bah (Khas Ramadan)", url: "https://files.catbox.moe/ql3neh.mp4" },
            { title: "Episode 13 - Tadabbur Surah Al-‘Alaq (Wahyu Pertama yang diterima Nabi Muhammad SAW)", url: "https://files.catbox.moe/dut76v.mp4" },
            { title: "Episode 14 - Tadabbur Surah Al-Qadr (Kisah Nabi Muhammad dilindungi Malaikat Jibril AS)", url: "https://files.catbox.moe/2yai4n.mp4" },
            { title: "Episode 15 - Kisah Nabi Muhammad Terima Wahyu Pertama", url: "https://files.catbox.moe/3zb7rk.mp4" },
            { title: "Episode 16 - Nabi Saw Sedih Wahyu Terputus", url: "https://files.catbox.moe/d7i68q.mp4" },
            { title: "Episode 17 - Nabi Muhammad Saw Mulakan Dakwah Secara Terbuka", url: "https://files.catbox.moe/ijw5tk.mp4" },
            { title: "Episode 18 - Ejekkan Dan Cacian Menghujani Nabi Muhammad Saw", url: "https://files.catbox.moe/wmy0rp.mp4" },
            { title: "Episode 19 - Penyiksaan Terhadap Sahabat Nabi Muhammad Saw", url: "https://files.catbox.moe/dd3tao.mp4" },
            { title: "Episode 20 - Penyiksaan Terhadap Golongan Berharta & Berpangkat", url: "https://files.catbox.moe/vog0ep.mp4" },
            { title: "Episode 21 - Para Sahabat Hijrah Ke Habasyah", url: "https://files.catbox.moe/zv3ncn.mp4" },
            { title: "Episode 22 - Kisah Lelaki Paling Kaya Di Mekkah", url: "https://files.catbox.moe/fcpund.mp4" },
            { title: "Episode 23 - Kisah Hamzah RA Memeluk Islam", url: "https://files.catbox.moe/awju0v.mp4" },
            { title: "Episode 24 - Kisah Umar Al Khattab RA Peluk Islam", url: "https://files.catbox.moe/e89gou.mp4" },
            { title: "Episode 25 - Boikot ke atas Keluarga Nabi SAW dan Umat Islam", url: "https://files.catbox.moe/fimsdu.mp4" },
            { title: "Episode 26 - Tahun Kesedihan Nabi Muhammad SAW", url: "https://files.catbox.moe/8fp87z.mp4" },
            { title: "Episode 27 - Nabi SAW berdakwah di Kota Taif", url: "https://files.catbox.moe/h5fy6k.mp4" },
            { title: "Episode 28 - Dari Taif Ke Langit Tertinggi", url: "https://files.catbox.moe/xqwkr5.mp4" }
        ])
    },
    "courage1_catalog": {
        id: "courage1",
        catalogId: "courage1_catalog",
        name: "Courage The Cowardly Dog S1",
        poster: "https://i.postimg.cc/3wsZHN14/Courage-DP-1.webp",
        background: "https://i.postimg.cc/QM2qrCmT/Courage-WP-1.png",
        backgroundShape: "Landscape",
        description: "Seekor anjing kecil berwarna merah jambu yang sangat penakut, tetapi sanggup berdepan dengan pelbagai bahaya demi menyelamatkan pemiliknya. Seorang wanita tua yang baik hati berketurunan Scotland dan sangat menyayangi Courage. Suami Muriel yang pemarah, sering melayan Courage dengan kasar, dan suka menakut-nakutkan anjing tersebut.",
        episodes: createEpisodes([
            { title: "Courage The Cowardly Dog Episode 1 - A Night at the Katz Motel", url: `${STREAM_HOST}/dl/6ae0a00d6e979983cdce635e` },
            { title: "Courage The Cowardly Dog Episode 2 - Cajun Granny Stew", url: `${STREAM_HOST}/dl/6ae0a00d6e979983cdce6360` },
            { title: "Courage The Cowardly Dog Episode 3 - The Shadow of Courage", url: `${STREAM_HOST}/dl/6ae0a00d6e979983cdce635c` },
            { title: "Courage The Cowardly Dog Episode 4 - Dr Le Quack, Amnesia Specialist", url: `${STREAM_HOST}/dl/6ae0a00d6e979983cdce635d` },
            { title: "Courage The Cowardly Dog Episode 5 - Courage Meets Bigfoot", url: `${STREAM_HOST}/dl/6ae0a00d6e979983cdce635f` },
            { title: "Courage The Cowardly Dog Episode 6 - Hothead", url: `${STREAM_HOST}/dl/6ae0a00d6e979983cdce6361` },
            { title: "Courage The Cowardly Dog Episode 7 - The Demon in the Mattress", url: `${STREAM_HOST}/dl/6ae0a0166e979983cdce6362` },
            { title: "Courage The Cowardly Dog Episode 8 - Freaky Fred", url: `${STREAM_HOST}/dl/6ae0a0166e979983cdce6363` },
            { title: "Courage The Cowardly Dog Episode 9 - Night of the Weremole", url: `${STREAM_HOST}/dl/6ae0a0166e979983cdce6364` },
            { title: "Courage The Cowardly Dog Episode 10 - Mother's Day", url: `${STREAM_HOST}/dl/6ae0a0166e979983cdce6365` },
            { title: "Courage The Cowardly Dog Episode 11 - The Duck Brothers", url: `${STREAM_HOST}/dl/6ae0a11b6e979983cdce636a` },
            { title: "Courage The Cowardly Dog Episode 12 - Shirley the Medium", url: `${STREAM_HOST}/dl/6ae0a11b6e979983cdce6369` },
            { title: "Courage The Cowardly Dog Episode 13 - King Ramses' Curse", url: `${STREAM_HOST}/dl/6ae0a11b6e979983cdce6366` },
            { title: "Courage The Cowardly Dog Episode 14 - The Clutching Foot", url: `${STREAM_HOST}/dl/6ae0a11b6e979983cdce6368` },
            { title: "Courage The Cowardly Dog Episode 15 - The Hunchback of Nowhere 1", url: `${STREAM_HOST}/dl/6ae0a11b6e979983cdce6367` },
            { title: "Courage The Cowardly Dog Episode 16 - The Gods Must Be Goosey", url: `${STREAM_HOST}/dl/6ae0a11b6e979983cdce636b` },
            { title: "Courage The Cowardly Dog Episode 17 - Queen of the Black Puddle", url: `${STREAM_HOST}/dl/6ae0a1246e979983cdce636c` },
            { title: "Courage The Cowardly Dog Episode 18 - Everyone Wants to Direct", url: `${STREAM_HOST}/dl/6ae0a1246e979983cdce636d` },
            { title: "Courage The Cowardly Dog Episode 19 - The Snowman Cometh", url: `${STREAM_HOST}/dl/6ae0a1246e979983cdce636e` },
            { title: "Courage The Cowardly Dog Episode 20 - The Precious, Wonderful, Adorable", url: `${STREAM_HOST}/dl/6ae0a1246e979983cdce636f` },
            { title: "Courage The Cowardly Dog Episode 21 - Heads of Beef", url: `${STREAM_HOST}/dl/6ae0a1d76e979983cdce6372` },
            { title: "Courage The Cowardly Dog Episode 22 - Klub Katz", url: `${STREAM_HOST}/dl/6ae0a1d86e979983cdce6375` },
            { title: "Courage The Cowardly Dog Episode 23 - Revenge of the Chicken from", url: `${STREAM_HOST}/dl/6ae0a1d76e979983cdce6373` },
            { title: "Courage The Cowardly Dog Episode 24 - Journey to the Center of Nowhere", url: `${STREAM_HOST}/dl/6ae0a1d76e979983cdce6370` },
            { title: "Courage The Cowardly Dog Episode 25 - Little Muriel", url: `${STREAM_HOST}/dl/6ae0a1d86e979983cdce6374` },
            { title: "Courage The Cowardly Dog Episode 26 - The Great Fusilli", url: `${STREAM_HOST}/dl/6ae0a1d76e979983cdce6371` }
        ])
    },
    "courage2_catalog": {
        id: "courage2",
        catalogId: "courage_catalog",
        name: "Courage The Cowardly Dog S2",
        poster: "https://i.postimg.cc/FKMxQzpy/Courage-DP-2.jpg",
        background: "https://i.postimg.cc/3wsZHN1J/Courage-WP-2.jpg",
        backgroundShape: "Landscape",
        description: "Seekor anjing kecil berwarna merah jambu yang sangat penakut, tetapi sanggup berdepan dengan pelbagai bahaya demi menyelamatkan pemiliknya. Seorang wanita tua yang baik hati berketurunan Scotland dan sangat menyayangi Courage. Suami Muriel yang pemarah, sering melayan Courage dengan kasar, dan suka menakut-nakutkan anjing tersebut.",
        episodes: createEpisodes([
            { title: "Courage the Cowardly Dog - S02E01", url: `${STREAM_HOST}/dl/6ae0a92a6e979983cdce637b` },
            { title: "Courage the Cowardly Dog - S02E02", url: `${STREAM_HOST}/dl/6ae0a92a6e979983cdce6377` },
            { title: "Courage the Cowardly Dog - S02E03", url: `${STREAM_HOST}/dl/6ae0a92a6e979983cdce6376` },
            { title: "Courage the Cowardly Dog - S02E04", url: `${STREAM_HOST}/dl/6ae0a92a6e979983cdce637a` },
            { title: "Courage the Cowardly Dog - S02E05", url: `${STREAM_HOST}/dl/6ae0a92a6e979983cdce6379` },
            { title: "Courage the Cowardly Dog - S02E06", url: `${STREAM_HOST}/dl/6ae0a92a6e979983cdce6378` },
            { title: "Courage the Cowardly Dog - S02E07", url: `${STREAM_HOST}/dl/6ae0a9336e979983cdce637c` },
            { title: "Courage the Cowardly Dog - S02E08", url: `${STREAM_HOST}/dl/6ae0a9356e979983cdce637d` },
            { title: "Courage the Cowardly Dog - S02E09", url: `${STREAM_HOST}/dl/6ae0a9356e979983cdce637e` },
            { title: "Courage the Cowardly Dog - S02E10", url: `${STREAM_HOST}/dl/6ae0a9366e979983cdce637f` },
            { title: "Courage the Cowardly Dog - S02E11", url: `${STREAM_HOST}/dl/6ae0a97e6e979983cdce6381` },
            { title: "Courage the Cowardly Dog - S02E12", url: `${STREAM_HOST}/dl/6ae0a97e6e979983cdce6380` },
            { title: "Courage the Cowardly Dog - S02E13", url: `${STREAM_HOST}/dl/6ae0a97e6e979983cdce6382` }
        ])
    },
    "courage3_catalog": {
        id: "courage3",
        catalogId: "courage3_catalog",
        name: "Courage The Cowardly Dog S3",
        poster: "https://i.postimg.cc/PqgMkJym/Courage-DP-3.webp",
        background: "https://i.postimg.cc/25sxfyGn/Courage-WP-3.jpg",
        backgroundShape: "Landscape",
        description: "Seekor anjing kecil berwarna merah jambu yang sangat penakut, tetapi sanggup berdepan dengan pelbagai bahaya demi menyelamatkan pemiliknya. Seorang wanita tua yang baik hati berketurunan Scotland dan sangat menyayangi Courage. Suami Muriel yang pemarah, sering melayan Courage dengan kasar, dan suka menakut-nakutkan anjing tersebut.",
        episodes: createEpisodes([
            { title: "Courage the Cowardly Dog - S03E01", url: `${STREAM_HOST}/dl/6ae0aae56e979983cdce6385` },
            { title: "Courage the Cowardly Dog - S03E02", url: `${STREAM_HOST}/dl/6ae0aae56e979983cdce6384` },
            { title: "Courage the Cowardly Dog - S03E03", url: `${STREAM_HOST}/dl/6ae0aae56e979983cdce6386` },
            { title: "Courage the Cowardly Dog - S03E04", url: `${STREAM_HOST}/dl/6ae0aae56e979983cdce6383` },
            { title: "Courage the Cowardly Dog - S03E05", url: `${STREAM_HOST}/dl/6ae0aae56e979983cdce6387` },
            { title: "Courage the Cowardly Dog - S03E06", url: `${STREAM_HOST}/dl/6ae0aae56e979983cdce6388` },           
            { title: "Courage the Cowardly Dog - S03E07", url: `${STREAM_HOST}/dl/6ae0aaed6e979983cdce6389` },
            { title: "Courage the Cowardly Dog - S03E08", url: `${STREAM_HOST}/dl/6ae0aaf06e979983cdce638a` },
            { title: "Courage the Cowardly Dog - S03E09", url: `${STREAM_HOST}/dl/6ae0aaf06e979983cdce638b` },
            { title: "Courage the Cowardly Dog - S03E10", url: `${STREAM_HOST}/dl/6ae0aaf06e979983cdce638c` },
            { title: "Courage the Cowardly Dog - S03E11", url: `${STREAM_HOST}/dl/6ae0ab446e979983cdce638e` },
            { title: "Courage the Cowardly Dog - S03E12", url: `${STREAM_HOST}/dl/6ae0ab446e979983cdce638d` },
            { title: "Courage the Cowardly Dog - S03E13", url: `${STREAM_HOST}/dl/6ae0ab446e979983cdce638f` }
        ])
    },
    "courage4_catalog": {
        id: "courage4",
        catalogId: "courage4_catalog",
        name: "Courage The Cowardly Dog S4",
        poster: "https://i.postimg.cc/LscVM5Df/Courage-DP-4.jpg",
        background: "https://i.postimg.cc/d0b9K36Q/Courage-WP-4.jpg",
        backgroundShape: "Landscape",
        description: "Seekor anjing kecil berwarna merah jambu yang sangat penakut, tetapi sanggup berdepan dengan pelbagai bahaya demi menyelamatkan pemiliknya. Seorang wanita tua yang baik hati berketurunan Scotland dan sangat menyayangi Courage. Suami Muriel yang pemarah, sering melayan Courage dengan kasar, dan suka menakut-nakutkan anjing tersebut.",
        episodes: createEpisodes([
            { title: "Courage the Cowardly Dog - S04E01", url: `${STREAM_HOST}/dl/6ae0afca6e979983cdce6393` },
            { title: "Courage the Cowardly Dog - S04E02", url: `${STREAM_HOST}/dl/6ae0afca6e979983cdce6392` },
            { title: "Courage the Cowardly Dog - S04E03", url: `${STREAM_HOST}/dl/6ae0afca6e979983cdce6395` },         
            { title: "Courage the Cowardly Dog - S04E04", url: `${STREAM_HOST}/dl/6ae0afca6e979983cdce6394` },
            { title: "Courage the Cowardly Dog - S04E05", url: `${STREAM_HOST}/dl/6ae0afca6e979983cdce6391` },
            { title: "Courage the Cowardly Dog - S04E06", url: `${STREAM_HOST}/dl/6ae0afca6e979983cdce6390` },
            { title: "Courage the Cowardly Dog - S04E07", url: `${STREAM_HOST}/dl/6ae0afd36e979983cdce6397` },
            { title: "Courage the Cowardly Dog - S04E08", url: `${STREAM_HOST}/dl/6ae0afd36e979983cdce6396` },
            { title: "Courage the Cowardly Dog - S04E09", url: `${STREAM_HOST}/dl/6ae0afd36e979983cdce6398` },
            { title: "Courage the Cowardly Dog - S04E10", url: `${STREAM_HOST}/dl/6ae0afd36e979983cdce6399` },
            { title: "Courage the Cowardly Dog - S04E11", url: `${STREAM_HOST}/dl/6ae0b0256e979983cdce639a` },
            { title: "Courage the Cowardly Dog - S04E12", url: `${STREAM_HOST}/dl/6ae0b0256e979983cdce639b` },
            { title: "Courage the Cowardly Dog - S04E13", url: `${STREAM_HOST}/dl/6ae0b0256e979983cdce639c` }
        ])
    },
    "spies1_catalog": {
        id: "spies1",
        catalogId: "spies1_catalog",
        name: "Totally Spies S1",
        poster: "https://i.postimg.cc/zB02YWdQ/Totally-Spies-DP1.jpg",
        background: "https://i.postimg.cc/GtfMHRn6/Totally-Spies-1.jpg",
        backgroundShape: "Landscape",
        description: "Mereka bekerja untuk WOOHP (World Organization of Human Protection) yang diketuai oleh bos mereka, Jerry. Sam, ejen yang paling bijak, matang, dan sering menjadi ketua strategik kumpulan. Sering memakai sut intip berwarna hijau. Clover, ejen yang sangat mementingkan fesyen, populariti, dan lelaki kacak. Sering memakai sut intip berwarna merah & Alex, ejen yang paling bongsu, aktif dalam sukan, lurus bendul tetapi sangat setia kawan. Sering memakai sut intip berwarna kuning.",
        episodes: createEpisodes([
            { title: "S01E01 - A Thing for Musicians", url: `${STREAM_HOST}/dl/6ae0c38b6e979983cdce63e0` },
            { title: "S01E02 - Queen for a Day", url: `${STREAM_HOST}/dl/6ae0c38b6e979983cdce63e1` },
            { title: "S01E03 - The New Jerry", url: `${STREAM_HOST}/dl/6ae0c38b6e979983cdce63df` },
            { title: "S01E04 - The Getaway", url: `${STREAM_HOST}/dl/6ae0c38b6e979983cdce63e2` },
            { title: "S01E05 - The Eraser", url: `${STREAM_HOST}/dl/6ae0c38b6e979983cdce63e4` },
            { title: "S01E06 - Stuck in the Middle Ages with You", url: `${STREAM_HOST}/dl/6ae0c38b6e979983cdce63e3` },
            { title: "S01E07 - Abductions", url: `${STREAM_HOST}/dl/6ae0c3936e979983cdce63e5` },
            { title: "S01E08 - Child's Play", url: `${STREAM_HOST}/dl/6ae0c3956e979983cdce63e7` },
            { title: "S01E09 - The Fugitives", url: `${STREAM_HOST}/dl/6ae0c3956e979983cdce63e8` },
            { title: "S01E10 - Model Citizens", url: `${STREAM_HOST}/dl/6ae0c3956e979983cdce63e6` },
            { title: "S01E11 - Spy Gladiators", url: `${STREAM_HOST}/dl/6ae0c4a06e979983cdce63ed` },
            { title: "S01E12 - Silicon Valley Girls", url: `${STREAM_HOST}/dl/6ae0c4a06e979983cdce63ee` },
            { title: "S01E13 - Passion Patties", url: `${STREAM_HOST}/dl/6ae0c4a06e979983cdce63ec` },
            { title: "S01E14 - Shrinking", url: `${STREAM_HOST}/dl/6ae0c4a06e979983cdce63ea` },
            { title: "S01E15 - Aliens", url: `${STREAM_HOST}/dl/6ae0c4a06e979983cdce63e9` },
            { title: "S01E16 - Wild Style", url: `${STREAM_HOST}/dl/6ae0c4a06e979983cdce63eb` },
            { title: "S01E17 - Black Widows", url: `${STREAM_HOST}/dl/6ae0c4a96e979983cdce63f1` },
            { title: "S01E18 - Evil Boyfriend", url: `${STREAM_HOST}/dl/6ae0c4a96e979983cdce63ef` },
            { title: "S01E19 - Game Girls", url: `${STREAM_HOST}/dl/6ae0c4a96e979983cdce63f0` },
            { title: "S01E20 - Spies vs. Spies", url: `${STREAM_HOST}/dl/6ae0c4a96e979983cdce63f2` },
            { title: "S01E21 - Do You Believe in Magic", url: `${STREAM_HOST}/dl/6ae0c5286e979983cdce63f3` },
            { title: "S01E22 - Malled", url: `${STREAM_HOST}/dl/6ae0c5286e979983cdce63f6` },
            { title: "S01E23 - Soul Collector", url: `${STREAM_HOST}/dl/6ae0c5286e979983cdce63f7` },
            { title: "S01E24 - Man or Machine", url: `${STREAM_HOST}/dl/6ae0c5286e979983cdce63f4` },
            { title: "S01E25 - Ice Man Cometh", url: `${STREAM_HOST}/dl/6ae0c5286e979983cdce63f5` },
            { title: "S01E26 - A Spy Is Born Part 1", url: `${STREAM_HOST}/dl/6ae0c5286e979983cdce63f8` }
        ])
    },
    "spies2_catalog": {
        id: "spies2",
        catalogId: "spies2 _catalog",
        name: "Totally Spies S2",
        poster: "https://i.postimg.cc/k4fYP81d/Totally-Spies-DP2.jpg",
        background: "https://i.postimg.cc/sxx6jXqc/Totally-Spies-2.jpg",
        backgroundShape: "Landscape",
        description: "Mereka bekerja untuk WOOHP (World Organization of Human Protection) yang diketuai oleh bos mereka, Jerry. Sam, ejen yang paling bijak, matang, dan sering menjadi ketua strategik kumpulan. Sering memakai sut intip berwarna hijau. Clover, ejen yang sangat mementingkan fesyen, populariti, dan lelaki kacak. Sering memakai sut intip berwarna merah & Alex, ejen yang paling bongsu, aktif dalam sukan, lurus bendul tetapi sangat setia kawan. Sering memakai sut intip berwarna kuning.",
        episodes: createEpisodes([
            { title: "S02E01 - A Spy Is Born Part 2", url: `${STREAM_HOST}/dl/6ae0c6466e979983cdce63fe` },
            { title: "S02E02 - I Want my Mummy", url: `${STREAM_HOST}/dl/6ae0c6466e979983cdce63fb` },
            { title: "S02E03 - Evil Hair Salon", url: `${STREAM_HOST}/dl/6ae0c6466e979983cdce63f9` },
            { title: "S02E04 - The Yuck Factor", url: `${STREAM_HOST}/dl/6ae0c6466e979983cdce63fa` },
            { title: "S02E05 - It's How You Play the Game", url: `${STREAM_HOST}/dl/6ae0c6466e979983cdce63fc` },
            { title: "S02E06 - Here Comes The Sun", url: `${STREAM_HOST}/dl/6ae0c6466e979983cdce63fd` },
            { title: "S02E07 - Green with N.V.", url: `${STREAM_HOST}/dl/6ae0c64e6e979983cdce63ff` },
            { title: "S02E08 - Boys Bands Will Be Boys Bands", url: `${STREAM_HOST}/dl/6ae0c64e6e979983cdce6401` },
            { title: "S02E09 - I, Dude", url: `${STREAM_HOST}/dl/6ae0c64e6e979983cdce6400` },
            { title: "S02E10 - Mommies Dearest", url: `${STREAM_HOST}/dl/6ae0c64e6e979983cdce6402` },
            { title: "S02E11 - Zooney World", url: `${STREAM_HOST}/dl/6ae0c7616e979983cdce6405` },
            { title: "S02E12 - First Brat", url: `${STREAM_HOST}/dl/6ae0c7616e979983cdce6404` },
            { title: "S02E13 - W.O.W.", url: `${STREAM_HOST}/dl/6ae0c7616e979983cdce6406` },
            { title: "S02E14 - Stark Raving Mad", url: `${STREAM_HOST}/dl/6ae0c7616e979983cdce6403` },
            { title: "S02E15 - Starstruck", url: `${STREAM_HOST}/dl/6ae0c7616e979983cdce6407` },
            { title: "S02E16 - S.P.I.", url: `${STREAM_HOST}/dl/6ae0c7616e979983cdce6408` },
            { title: "S02E17 - Animal World", url: `${STREAM_HOST}/dl/6ae0c7696e979983cdce6409` },
            { title: "S02E18 - Nature Nightmare", url: `${STREAM_HOST}/dl/6ae0c76b6e979983cdce640a` },
            { title: "S02E19 - Alex Quits", url: `${STREAM_HOST}/dl/6ae0c76b6e979983cdce640b` },
            { title: "S02E20 - Totally Switched", url: `${STREAM_HOST}/dl/6ae0c76b6e979983cdce640c` },
            { title: "S02E21 - Ski Trip", url: `${STREAM_HOST}/dl/6ae0c7e96e979983cdce6412` },
            { title: "S02E22 - The Elevator", url: `${STREAM_HOST}/dl/6ae0c7e96e979983cdce640d` },
            { title: "S02E23 - Matchmaker", url: `${STREAM_HOST}/dl/6ae0c7e96e979983cdce6411` },
            { title: "S02E24 - Brain Drain", url: `${STREAM_HOST}/dl/6ae0c7e96e979983cdce640f` },
            { title: "S02E25 - Fashion Faux Pas", url: `${STREAM_HOST}/dl/6ae0c7e96e979983cdce640e` },
            { title: "S02E26 - Toying Around", url: `${STREAM_HOST}/dl/6ae0c7e96e979983cdce6410` }
        ])
    },
    "spies3_catalog": {
        id: "spies3",
        catalogId: "spies3_catalog",
        name: "Totally Spies S3",
        poster: "https://i.postimg.cc/1tJ716C1/Totally-Spies-DP3.jpg",
        background: "https://i.postimg.cc/J0FTG8C9/Totally-Spies-3.jpg",
        backgroundShape: "Landscape",
        description: "Mereka bekerja untuk WOOHP (World Organization of Human Protection) yang diketuai oleh bos mereka, Jerry. Sam, ejen yang paling bijak, matang, dan sering menjadi ketua strategik kumpulan. Sering memakai sut intip berwarna hijau. Clover, ejen yang sangat mementingkan fesyen, populariti, dan lelaki kacak. Sering memakai sut intip berwarna merah & Alex, ejen yang paling bongsu, aktif dalam sukan, lurus bendul tetapi sangat setia kawan. Sering memakai sut intip berwarna kuning.",
        episodes: createEpisodes([
            { title: "S03E01 - Physics 101 Much?", url: `${STREAM_HOST}/dl/6ae0c9866e979983cdce6417` },
            { title: "S03E02 - Freaky Circus Much?", url: `${STREAM_HOST}/dl/6ae0c9866e979983cdce6415` },
            { title: "S03E03 - Computer Creep Much?", url: `${STREAM_HOST}/dl/6ae0c9866e979983cdce6416` },
            { title: "S03E04 - Space Much?", url: `${STREAM_HOST}/dl/6ae0c9866e979983cdce6414` },
            { title: "S03E05 - Evil Coffee Shop Much?", url: `${STREAM_HOST}/dl/6ae0c9866e979983cdce6413` },
            { title: "S03E06 - Forward To The Past", url: `${STREAM_HOST}/dl/6ae0c9866e979983cdce6418` },
            { title: "S03E08 - Morphing Is Soooo 1987", url: `${STREAM_HOST}/dl/6ae0c98e6e979983cdce6419` },
            { title: "S03E09 - The Incredible Bulk", url: `${STREAM_HOST}/dl/6ae0c98e6e979983cdce641a` },
            { title: "S03E10 - Super Nerd Much?", url: `${STREAM_HOST}/dl/6ae0c98e6e979983cdce641b` },
            { title: "S03E11 - Dental More Like Mental", url: `${STREAM_HOST}/dl/6ae0c98e6e979983cdce641c` },
            { title: "S03E12 - Escape From WOOHP Island", url: `${STREAM_HOST}/dl/6ae0cb1a6e979983cdce6425` },
            { title: "S03E13 - Scam Camp Much?", url: `${STREAM_HOST}/dl/6ae0cb1a6e979983cdce6422` },
            { title: "S03E15 - Super Agent Much?", url: `${STREAM_HOST}/dl/6ae0cb1a6e979983cdce6424` },
            { title: "S03E16 - Evil Airlines Much?", url: `${STREAM_HOST}/dl/6ae0cb1a6e979983cdce6427` },
            { title: "S03E17 - Creepy Crawly Much?", url: `${STREAM_HOST}/dl/6ae0cb1a6e979983cdce6423` },
            { title: "S03E18 - Truth or Scare", url: `${STREAM_HOST}/dl/6ae0cb1a6e979983cdce6426` },
            { title: "S03E19 - Feng Shui Is Like Sooo Passe", url: `${STREAM_HOST}/dl/6ae0cb226e979983cdce6428` },
            { title: "S03E20 - Evil Valentine's Day", url: `${STREAM_HOST}/dl/6ae0cb246e979983cdce6429` },
            { title: "S03E21 - Halloween", url: `${STREAM_HOST}/dl/6ae0cb246e979983cdce642a` },
            { title: "S03E22 - Power Yoga Much?", url: `${STREAM_HOST}/dl/6ae0cade6e979983cdce641d` },
            { title: "S03E23 - Head Shrinker Much?", url: `${STREAM_HOST}/dl/6ae0cade6e979983cdce6421` },
            { title: "S03E24 - Evil Promotion Much? 1", url: `${STREAM_HOST}/dl/6ae0cade6e979983cdce6420` },
            { title: "S03E25 - Evil Promotion Much? 2", url: `${STREAM_HOST}/dl/6ae0cade6e979983cdce641f` },
            { title: "S03E26 - Evil Promotion Much? 3", url: `${STREAM_HOST}/dl/6ae0cade6e979983cdce641e` }
        ])
    },
    "martin_catalog": {
        id: "martin",
        catalogId: "martin_catalog",
        name: "Martin Mystery",
        poster: "https://i.postimg.cc/wxWJLFR8/MM-DP.jpg",
        background: "https://i.postimg.cc/Dz9cK062/Martin-Mystery-WP.webp",
        backgroundShape: "Landscape",
        description: "Martin Mystery ialah siri animasi televisyen bergenre komedi, seram, dan sci-fi yang mengisahkan tentang Martin dan saudara tirinya, Diana, yang bekerja secara rahsia sebagai penyiasat paranormal untuk agensi The Center. Bersama-sama dengan manusia gua Java, mereka melindungi Bumi daripada pelbagai ancaman makhluk asing dan fenomena ghaib.",
        episodes: createEpisodes([
            { title: "Martin Mystery - All I Want for X-mas", url: `${STREAM_HOST}/dl/6ae0b1256e979983cdce639e` },
            { title: "Martin Mystery - Attack of the Slime People", url: `${STREAM_HOST}/dl/6ae0b1256e979983cdce63a0` },
            { title: "Martin Mystery - Attack of the Sandman", url: `${STREAM_HOST}/dl/6ae0b1256e979983cdce63a1` },
            { title: "Martin Mystery - Attack of the Mothman", url: `${STREAM_HOST}/dl/6ae0b1256e979983cdce63a2` },
            { title: "Martin Mystery - Attack of the Evil Roomate", url: `${STREAM_HOST}/dl/6ae0b1256e979983cdce639f` },
            { title: "Martin Mystery - Attack of the Lawn Gnomes", url: `${STREAM_HOST}/dl/6ae0b1256e979983cdce639d` },
            { title: "Martin Mystery - Beast From Within", url: `${STREAM_HOST}/dl/6ae0b12d6e979983cdce63a3` },
            { title: "Martin Mystery - Crypt of the Djini", url: `${STREAM_HOST}/dl/6ae0b12d6e979983cdce63a4` },
            { title: "Martin Mystery - Curse of the Deep", url: `${STREAM_HOST}/dl/6ae0b12d6e979983cdce63a5` },
            { title: "Martin Mystery - Curse of the Looking Glass", url: `${STREAM_HOST}/dl/6ae0b12e6e979983cdce63a6` },
            { title: "Martin Mystery - Fright from the Ice", url: `${STREAM_HOST}/dl/6ae0b20e6e979983cdce63a7` },
            { title: "Martin Mystery - Curse of the Six String Serenade", url: `${STREAM_HOST}/dl/6ae0b20e6e979983cdce63a8` },
            { title: "Martin Mystery - Eternal Christmas", url: `${STREAM_HOST}/dl/6ae0b20e6e979983cdce63a9` },
            { title: "Martin Mystery - Curse of the Necklace", url: `${STREAM_HOST}/dl/6ae0b20e6e979983cdce63aa` },
            { title: "Martin Mystery - Day of the Shadows Part 1", url: `${STREAM_HOST}/dl/6ae0b20e6e979983cdce63ac` },
            { title: "Martin Mystery - Day of the Shadows Part 2", url: `${STREAM_HOST}/dl/6ae0b20e6e979983cdce63ab` },
            { title: "Martin Mystery - Germs from Beyond", url: `${STREAM_HOST}/dl/6ae0b2166e979983cdce63ad` },
            { title: "Martin Mystery - Hairier and Scarier", url: `${STREAM_HOST}/dl/6ae0b2166e979983cdce63ae` },
            { title: "Martin Mystery - It Came From Inside the Box", url: `${STREAM_HOST}/dl/6ae0b2166e979983cdce63af` },
            { title: "Martin Mystery - Haunting of the Blackwater", url: `${STREAM_HOST}/dl/6ae0b2166e979983cdce63b0` },
            { title: "Martin Mystery - Journey Into Terrorland", url: `${STREAM_HOST}/dl/6ae0b3226e979983cdce63b1` },
            { title: "Martin Mystery - Mark of the Shapeshifter", url: `${STREAM_HOST}/dl/6ae0b3226e979983cdce63b2` },
            { title: "Martin Mystery - Its Alive Part 2", url: `${STREAM_HOST}/dl/6ae0b3226e979983cdce63b3` },
            { title: "Martin Mystery - Lovespell from the Underworld", url: `${STREAM_HOST}/dl/6ae0b3226e979983cdce63b4` },
            { title: "Martin Mystery - Its Alive Part 1", url: `${STREAM_HOST}/dl/6ae0b3226e979983cdce63b5` },
            { title: "Martin Mystery - It Came From the Bog", url: `${STREAM_HOST}/dl/6ae0b3226e979983cdce63b6` },
            { title: "Martin Mystery - Monster Movie Mayhem", url: `${STREAM_HOST}/dl/6ae0b32a6e979983cdce63b7` },
            { title: "Martin Mystery - Mystery of the Hole Creature", url: `${STREAM_HOST}/dl/6ae0b32a6e979983cdce63b8` },
            { title: "Martin Mystery - Mystery of the Vanishing", url: `${STREAM_HOST}/dl/6ae0b32a6e979983cdce63b9` },
            { title: "Martin Mystery - Mystery of the Teen Town", url: `${STREAM_HOST}/dl/6ae0b32a6e979983cdce63ba` },
            { title: "Martin Mystery - Return of the Djini", url: `${STREAM_HOST}/dl/6ae0b38e6e979983cdce63bb` },
            { title: "Martin Mystery - Pirates of Doom", url: `${STREAM_HOST}/dl/6ae0b38e6e979983cdce63bc` },
            { title: "Martin Mystery - Nightmare of the Coven", url: `${STREAM_HOST}/dl/6ae0b38e6e979983cdce63bd` },
            { title: "Martin Mystery - Return of the Dark Druid", url: `${STREAM_HOST}/dl/6ae0b38e6e979983cdce63be` },
            { title: "Martin Mystery - Night of the Scarecrow", url: `${STREAM_HOST}/dl/6ae0b38e6e979983cdce63bf` },
            { title: "Martin Mystery - Rage of the Leprechaun", url: `${STREAM_HOST}/dl/6ae0b38e6e979983cdce63c0` },
            { title: "Martin Mystery - Return of the Imaginary Friend", url: `${STREAM_HOST}/dl/6ae0b3976e979983cdce63c1` },
            { title: "Martin Mystery - Revenge of the Doppelganger", url: `${STREAM_HOST}/dl/6ae0b3976e979983cdce63c2` },
            { title: "Martin Mystery - Scream from the Forest", url: `${STREAM_HOST}/dl/6ae0b3976e979983cdce63c3` },
            { title: "Martin Mystery - Rise of the Sea Mutants", url: `${STREAM_HOST}/dl/6ae0b3976e979983cdce63c4` },
            { title: "Martin Mystery - The Awakening", url: `${STREAM_HOST}/dl/6ae0b46b6e979983cdce63c5` },
            { title: "Martin Mystery - Summer Camp Nightmare", url: `${STREAM_HOST}/dl/6ae0b46b6e979983cdce63c6` },
            { title: "Martin Mystery - Terror From the Sky", url: `${STREAM_HOST}/dl/6ae0b46b6e979983cdce63c7` },
            { title: "Martin Mystery - Shriek From Beyond", url: `${STREAM_HOST}/dl/6ae0b46b6e979983cdce63c8` },
            { title: "Martin Mystery - Tale of the Enchanted Keys", url: `${STREAM_HOST}/dl/6ae0b46b6e979983cdce63c9` },
            { title: "Martin Mystery - The Amazon Vapor", url: `${STREAM_HOST}/dl/6ae0b46b6e979983cdce63ca` },
            { title: "Martin Mystery - The House of Zombies", url: `${STREAM_HOST}/dl/6ae0b4736e979983cdce63cb` },
            { title: "Martin Mystery - The Body Swapper", url: `${STREAM_HOST}/dl/6ae0b4736e979983cdce63cc` },
            { title: "Martin Mystery - The Creeping Slime", url: `${STREAM_HOST}/dl/6ae0b4736e979983cdce63cd` },
            { title: "Martin Mystery - The Lost Tribe", url: `${STREAM_HOST}/dl/6ae0b4736e979983cdce63ce` },
            { title: "Martin Mystery - The Third Eye", url: `${STREAM_HOST}/dl/6ae0b5176e979983cdce63cf` },
            { title: "Martin Mystery - The Rise of the Secret Society", url: `${STREAM_HOST}/dl/6ae0b5176e979983cdce63d0` },
            { title: "Martin Mystery - The Warlock Returns", url: `${STREAM_HOST}/dl/6ae0b5176e979983cdce63d1` },
            { title: "Martin Mystery - The Sewer Thing", url: `${STREAM_HOST}/dl/6ae0b5176e979983cdce63d2` },
            { title: "Martin Mystery - The Vampire Returns", url: `${STREAM_HOST}/dl/6ae0b5176e979983cdce63d3` },
            { title: "Martin Mystery - The Return of the Beasts", url: `${STREAM_HOST}/dl/6ae0b5176e979983cdce63d4` },         
            { title: "Martin Mystery - They Came From Outer Space part 2", url: `${STREAM_HOST}/dl/6ae0b5206e979983cdce63d5` },
            { title: "Martin Mystery - They Came From Outer Space Part 1", url: `${STREAM_HOST}/dl/6ae0b5206e979983cdce63d6` },
            { title: "Martin Mystery - They Came from the Gateway Part 2", url: `${STREAM_HOST}/dl/6ae0b5206e979983cdce63d7` },
            { title: "Martin Mystery - They Came from the Gateway Part 1", url: `${STREAM_HOST}/dl/6ae0b5206e979983cdce63d8` },
            { title: "Martin Mystery - You Do Voodoo", url: `${STREAM_HOST}/dl/6ae0b5b06e979983cdce63d9` },
            { title: "Martin Mystery - Zombie Island", url: `${STREAM_HOST}/dl/6ae0b5b06e979983cdce63da` },
            { title: "Martin Mystery - Web of the Spider Creature", url: `${STREAM_HOST}/dl/6ae0b5b06e979983cdce63db` },
            { title: "Martin Mystery - They Lurk Beneath", url: `${STREAM_HOST}/dl/6ae0b5b06e979983cdce63dc` },
            { title: "Martin Mystery - Wrath of the Venus Flytrap", url: `${STREAM_HOST}/dl/6ae0b5b06e979983cdce63dd` },
            { title: "Martin Mystery - Wrath of the Torrington Worm", url: `${STREAM_HOST}/dl/6ae0b5b06e979983cdce63de` }
        ])
    },
    "hagemaru_catalog": {
        id: "hagemaru",
        catalogId: "hagemaru_catalog",
        name: "Hagemaru",
        poster: "https://i.postimg.cc/8zS8nQF8/Hagemaru.jpg",
        posterShape: "poster",
        description: "Koleksi Episod Hagemaru Bahasa Melayu.",
        episodes: createEpisodes([
            { title: "Pasukan Bola Lisut Muda", url: "https://files.catbox.moe/05qmoa.mp4" },
            { title: "Hagemaru - Episode 01", url: `${STREAM_HOST}/dl/6acca6a96e979983cdce5a26` },
            { title: "Hagemaru - Episode 02", url: `${STREAM_HOST}/dl/6acca6a96e979983cdce5a24` },
            { title: "Hagemaru - Episode 03", url: `${STREAM_HOST}/dl/6acca6a96e979983cdce5a22` },
            { title: "Hagemaru - Episode 04", url: `${STREAM_HOST}/dl/6acca6a96e979983cdce5a23` },
            { title: "Hagemaru - Episode 05", url: `${STREAM_HOST}/dl/6acca6a96e979983cdce5a25` },
            { title: "Hagemaru - Episode 06", url: `${STREAM_HOST}/dl/6acca6a96e979983cdce5a27` },
            { title: "Hagemaru - Episode 07", url: `${STREAM_HOST}/dl/6acca6b16e979983cdce5a28` },
            { title: "Hagemaru - Episode 08", url: `${STREAM_HOST}/dl/6acca6b36e979983cdce5a2b` },
            { title: "Hagemaru - Episode 09", url: `${STREAM_HOST}/dl/6acca6b36e979983cdce5a29` },
            { title: "Hagemaru - Episode 10", url: `${STREAM_HOST}/dl/6acca6b36e979983cdce5a2a` },
            { title: "Hagemaru - Episode 11", url: `${STREAM_HOST}/dl/6acca6b66e979983cdce5a2c` },
            { title: "Hagemaru - Episode 12", url: `${STREAM_HOST}/dl/6acca6b66e979983cdce5a2d` },
            { title: "Hagemaru - Episode 13", url: `${STREAM_HOST}/dl/6acca6bc6e979983cdce5a2e` },
            { title: "Hagemaru - Episode 14", url: `${STREAM_HOST}/dl/6acca6bc6e979983cdce5a2f` },
            { title: "Hagemaru - Episode 15", url: `${STREAM_HOST}/dl/6acca6bc6e979983cdce5a30` },
            { title: "Hagemaru - Episode 16", url: `${STREAM_HOST}/dl/6acca6bc6e979983cdce5a31` },
            { title: "Hagemaru - Episode 17", url: `${STREAM_HOST}/dl/6acca6ef6e979983cdce5a32` },
            { title: "Hagemaru - Episode 18", url: `${STREAM_HOST}/dl/6acca6ef6e979983cdce5a33` },
            { title: "Hagemaru - Episode 19", url: `${STREAM_HOST}/dl/6acca6ef6e979983cdce5a34` },
            { title: "Hagemaru - Episode 20", url: `${STREAM_HOST}/dl/6acca6ef6e979983cdce5a35` },
            { title: "Hagemaru - Episode 21", url: `${STREAM_HOST}/dl/6acca6f66e979983cdce5a36` },
            { title: "Hagemaru - Episode 22", url: `${STREAM_HOST}/dl/6acca6fa6e979983cdce5a37` },
            { title: "Pasukan Bola Lisut Muda", url: "https://files.catbox.moe/05qmoa.mp4" }
        ])
    },
    "ninja_boy_catalog": {
        id: "ninja_boy",
        catalogId: "ninja_boy_catalog",
        name: "Ninja Boy",
        poster: "https://i.postimg.cc/NjchPqKZ/Ninja_Boy.jpg",
        posterShape: "poster",
        description: "Ketiga-tiga sahabat ini berada dalam kelas tahun pertama (Ichinen-hagumi) dan sering melalui pelbagai latihan ninja yang kelakar, insiden huru-hara, serta persaingan dengan pihak lawan seperti dari Istana Dokutake.",
        episodes: createEpisodes([
            { title: "Episode 01" , url: `${STREAM_HOST}/dl/6ae48fc56e979983cdce667d` },
            { title: "Episode 02" , url: `${STREAM_HOST}/dl/6ae48fc56e979983cdce667c` },
            { title: "Episode 03" , url: `${STREAM_HOST}/dl/6ae48fc56e979983cdce6680` },
            { title: "Episode 04" , url: `${STREAM_HOST}/dl/6ae48fc56e979983cdce667f` },
            { title: "Episode 05" , url: `${STREAM_HOST}/dl/6ae48fce6e979983cdce6682` },
            { title: "Episode 06" , url: `${STREAM_HOST}/dl/6ae48fce6e979983cdce6685` },
            { title: "Episode 07" , url: `${STREAM_HOST}/dl/6ae48fce6e979983cdce6684` },
            { title: "Episode 08" , url: `${STREAM_HOST}/dl/6ae48fc56e979983cdce6681` },
            { title: "Episode 09" , url: `${STREAM_HOST}/dl/6ae48fce6e979983cdce6683` },
            { title: "Episode 10" , url: `${STREAM_HOST}/dl/6ae48fc56e979983cdce667e` },
            { title: "Episode 11" , url: `${STREAM_HOST}/dl/6ae490526e979983cdce6687` },
            { title: "Episode 12" , url: `${STREAM_HOST}/dl/6ae490536e979983cdce6688` },
            { title: "Episode 13" , url: `${STREAM_HOST}/dl/6ae490536e979983cdce668b` },
            { title: "Episode 14" , url: `${STREAM_HOST}/dl/6ae490526e979983cdce6686` },
            { title: "Episode 15" , url: `${STREAM_HOST}/dl/6ae4905b6e979983cdce668c` },
            { title: "Episode 16" , url: `${STREAM_HOST}/dl/6ae4905b6e979983cdce668d` },
            { title: "Episode 17" , url: `${STREAM_HOST}/dl/6ae4905b6e979983cdce668f` },
            { title: "Episode 18" , url: `${STREAM_HOST}/dl/6ae4905b6e979983cdce668e` },
            { title: "Episode 19" , url: `${STREAM_HOST}/dl/6ae490536e979983cdce668a` },
            { title: "Episode 20" , url: `${STREAM_HOST}/dl/6ae490536e979983cdce6689` },
            { title: "Episode 21" , url: `${STREAM_HOST}/dl/6ae490a96e979983cdce6690` },
            { title: "Episode 22" , url: `${STREAM_HOST}/dl/6ae490a96e979983cdce6692` },
            { title: "Episode 23" , url: `${STREAM_HOST}/dl/6ae490a96e979983cdce6693` },
            { title: "Episode 24" , url: `${STREAM_HOST}/dl/6ae490a96e979983cdce6691` },
            "https://files.catbox.moe/eufzjd.mp4", "https://files.catbox.moe/gujt6g.mp4",
            "https://files.catbox.moe/tlvkbp.mp4", "https://files.catbox.moe/fzsduj.mp4",
            "https://files.catbox.moe/zmbbmq.mp4", "https://files.catbox.moe/o7bhaf.mp4",
            "https://files.catbox.moe/jmwdz9.mp4"
        ])
    },
    "edens_zero_catalog": {
        id: "edens_zero",
        catalogId: "edens_zero_catalog",
        name: "Edens Zero",
        poster: "https://i.postimg.cc/6p0qKPZv/Edens-Zero-DP.jpg",
        posterShape: "poster",
        description: "Koleksi Episod Edens Zero.",
        episodes: createEpisodes([
            { title: "Edens Zero Episode 01", url: "https://files.catbox.moe/2laihe.mkv" },
            { title: "Edens Zero Episode 02", url: "https://files.catbox.moe/komsry.mkv" },
            { title: "Edens Zero Episode 03", url: "https://files.catbox.moe/d6c7r4.mkv" },
            { title: "Edens Zero Episode 04", url: "https://files.catbox.moe/w9ajbt.mkv" },
            { title: "Edens Zero Episode 05", url: "https://files.catbox.moe/km8d05.mp4" },
            { title: "Edens Zero Episode 06", url: "https://files.catbox.moe/3p9v7l.mkv" },
            { title: "Edens Zero Episode 07", url: "https://files.catbox.moe/akdvft.mkv" },
            { title: "Edens Zero Episode 08", url: "https://files.catbox.moe/syosbk.mkv" },
            { title: "Edens Zero Episode 09", url: "https://files.catbox.moe/eomd9o.mkv" },
            { title: "Edens Zero Episode 10", url: "https://files.catbox.moe/yxkdsy.mkv" },
            { title: "Edens Zero Episode 11", url: "https://files.catbox.moe/tq2quk.mkv" },
            { title: "Edens Zero Episode 12", url: "https://files.catbox.moe/jw4w1t.mkv" },
            { title: "Edens Zero Episode 13", url: "https://files.catbox.moe/er5gdp.mkv" },
            { title: "Edens Zero Episode 14", url: "https://files.catbox.moe/90r0k5.mkv" },
            { title: "Edens Zero Episode 15", url: "https://files.catbox.moe/ej5cig.mkv" },
            { title: "Edens Zero Episode 16", url: "https://files.catbox.moe/kaapzs.mkv" },
            { title: "Edens Zero Episode 17", url: "https://files.catbox.moe/gig6yp.mkv" },
            { title: "Edens Zero Episode 18", url: "https://files.catbox.moe/vr2bke.mkv" },
            { title: "Edens Zero Episode 19", url: "https://files.catbox.moe/vvck1z.mkv" },
            { title: "Edens Zero Episode 20", url: "https://files.catbox.moe/plthwh.mkv" },
            { title: "Edens Zero Episode 21", url: "https://files.catbox.moe/ip1hxb.mkv" },
            { title: "Edens Zero Episode 22", url: "https://files.catbox.moe/ijw8tq.mkv" },
            { title: "Edens Zero Episode 23", url: "https://files.catbox.moe/wtouir.mkv" },
            { title: "Edens Zero Episode 24", url: "https://files.catbox.moe/hw8pq8.mkv" },
            { title: "Edens Zero Episode 25", url: "https://files.catbox.moe/3etz4x.mkv" }
        ])
    },
    "nisekoi_catalog": {
        id: "nisekoi",
        catalogId: "nisekoi_catalog",
        name: "Nisekoi",
        poster: "https://i.postimg.cc/523yJrzq/Nisekoi-DP.jpg",
        posterShape: "poster",
        description: "Koleksi Episod Nisekoi.",
        episodes: createEpisodes([
            { title: "Nisekoi 01.mkv", url: `${STREAM_HOST}/dl/6ad629eb6e979983cdce5efd` },
            { title: "Nisekoi 02.mkv", url: `${STREAM_HOST}/dl/6ad629eb6e979983cdce5ef8` },
            { title: "Nisekoi 03.mkv", url: `${STREAM_HOST}/dl/6ad629eb6e979983cdce5efb` },
            { title: "Nisekoi 04.mkv", url: `${STREAM_HOST}/dl/6ad629eb6e979983cdce5efa` },
            { title: "Nisekoi 05.mkv", url: `${STREAM_HOST}/dl/6ad629eb6e979983cdce5ef9` },
            { title: "Nisekoi 06.mkv", url: `${STREAM_HOST}/dl/6ad629eb6e979983cdce5efc` },
            { title: "Nisekoi 07.mkv", url: `${STREAM_HOST}/dl/6ad629f56e979983cdce5eff` },
            { title: "Nisekoi 08.mkv", url: `${STREAM_HOST}/dl/6ad629f56e979983cdce5efe` },
            { title: "Nisekoi 09.mkv", url: `${STREAM_HOST}/dl/6ad629f56e979983cdce5f00` },
            { title: "Nisekoi 10.mkv", url: `${STREAM_HOST}/dl/6ad629f56e979983cdce5f01` },
            { title: "Nisekoi 11.mkv", url: `${STREAM_HOST}/dl/6ad629fb6e979983cdce5f02` },
            { title: "Nisekoi 12.mkv", url: `${STREAM_HOST}/dl/6ad629fb6e979983cdce5f03` },
            { title: "Nisekoi 13.mkv", url: `${STREAM_HOST}/dl/6ad62a006e979983cdce5f06` },
            { title: "Nisekoi 14.mkv", url: `${STREAM_HOST}/dl/6ad62a006e979983cdce5f04` },
            { title: "Nisekoi 15.mkv", url: `${STREAM_HOST}/dl/6ad62a006e979983cdce5f05` },
            { title: "Nisekoi 16.mkv", url: `${STREAM_HOST}/dl/6ad62a2e6e979983cdce5f07` },
            { title: "Nisekoi 17.mkv", url: `${STREAM_HOST}/dl/6ad62a356e979983cdce5f08` },
            { title: "Nisekoi 18.mkv", url: `${STREAM_HOST}/dl/6ad62a366e979983cdce5f09` },
            { title: "Nisekoi 19.mkv", url: `${STREAM_HOST}/dl/6ad62a366e979983cdce5f0a` },
            { title: "Nisekoi 20.mkv", url: `${STREAM_HOST}/dl/6ad62a366e979983cdce5f0b` }
        ])
    },
    "nisekoi_2_catalog": {
        id: "nisekoi_2",
        catalogId: "nisekoi_2_catalog",
        name: "Nisekoi 2",
        poster: "https://i.postimg.cc/VsZjvZbm/Nisekoi-2.jpg",
        posterShape: "poster",
        description: "Koleksi Episod Nisekoi 2.",
        episodes: createEpisodes([
            { title: "Nisekoi Episode 1", url: "https://files.catbox.moe/d4n92d.mkv" },
            { title: "Nisekoi Episode 2", url: "https://files.catbox.moe/4xrcf4.mkv" },
            { title: "Nisekoi Episode 3", url: "https://files.catbox.moe/npa78a.mkv" },
            { title: "Nisekoi Episode 4", url: "https://files.catbox.moe/rqpdf5.mp4" },
            { title: "Nisekoi Episode 5", url: "https://files.catbox.moe/lxd4un.mkv" },
            { title: "Nisekoi Episode 6", url: "https://files.catbox.moe/xrsb84.mkv" },
            { title: "Nisekoi Episode 7", url: "https://files.catbox.moe/18zfl3.mkv" },
            { title: "Nisekoi Episode 8", url: "https://files.catbox.moe/vk02op.mkv" },
            { title: "Nisekoi Episode 9", url: "https://files.catbox.moe/iuogkf.mkv" },
            { title: "Nisekoi Episode 10", url: "https://files.catbox.moe/aqyp5y.mkv" },
            { title: "Nisekoi Episode 11", url: "https://files.catbox.moe/4nros2.mp4" },
            { title: "Nisekoi Episode 12", url: "https://files.catbox.moe/u20cdv.mkv" }
        ])
    },
    "omar_dan_hana_catalog": {
        id: "omar_dan_hana",
        catalogId: "omar_dan_hana_catalog",
        name: "Omar & Hana",
        poster: "https://i.postimg.cc/T391xsbp/Omar-Dan-Hana-DP.webp",
        posterShape: "poster",
        description: "Koleksi Episod Omar & Hana.",
        episodes: createEpisodes([
            { title: "Omar & Hana Episode 1.mp4", url: `${STREAM_HOST}/dl/6ad612fa6e979983cdce5e35` },
            { title: "Omar & Hana Episode 2", url: "https://files.catbox.moe/pmfhb4.mp4" },
            { title: "Omar & Hana Episode 3", url: "https://files.catbox.moe/ljjq4f.mp4" },
            { title: "Omar & Hana Episode 4", url: `${STREAM_HOST}/dl/6ad612fb6e979983cdce5e38` },
            { title: "Omar & Hana Episode 5", url: "https://files.catbox.moe/lufyck.mp4" },
            { title: "Omar & Hana Episode 6", url: `${STREAM_HOST}/dl/6ad613016e979983cdce5e3a` },
            { title: "Omar & Hana Episode 7", url: `${STREAM_HOST}/dl/6ad613066e979983cdce5e3c` },
            { title: "Omar & Hana Episode 8", url: `${STREAM_HOST}/dl/6ad613066e979983cdce5e3b` },
            { title: "Omar & Hana Episode 9", url: `${STREAM_HOST}/dl/6ad613316e979983cdce5e3d` },
            { title: "Omar & Hana Episode 10", url: `${STREAM_HOST}/dl/6ad613316e979983cdce5e3e` },
            { title: "Omar & Hana Episode 11", url: `${STREAM_HOST}/dl/6ad613376e979983cdce5e3f` },
            { title: "Omar & Hana Episode 12", url: `${STREAM_HOST}/dl/6ad613376e979983cdce5e40` },     
            { title: "Omar & Hana Episode 13", url: `${STREAM_HOST}/dl/6ad613376e979983cdce5e41` },
            { title: "Omar & Hana Minta Maaf", url: "https://files.catbox.moe/983lz9.mp4" },
            { title: "Omar & Hana Hari Pertama Ramadhan", url: "https://files.catbox.moe/2kuu1o.mp4" },
            { title: "Omar & Hana Kotak Kejutan", url: "https://files.catbox.moe/xl9d8b.mp4" },
            { title: "Alif Ba Ta - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612b66e979983cdce5e24` },
            { title: "AidilFitri 2 - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612b66e979983cdce5e27` },
            { title: "Belajar Doa Bersama - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612b66e979983cdce5e29` },
            { title: "AidilFitri - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612b66e979983cdce5e25` },
            { title: "Azam Baru Teladan Baru - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612b66e979983cdce5e28` },
            { title: "Bismillah, Alhamdulillah, Masjidil Haram - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612b66e979983cdce5e26` },
            { title: "Hari Pertama Ramadhan - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612be6e979983cdce5e2c` },
            { title: "Comelnya Haiwan - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612be6e979983cdce5e2b` },
            { title: "Faris - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612be6e979983cdce5e2a` },
            { title: "Kotak Kejutan - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612c96e979983cdce5e30` },
            { title: "Kembali Ke Sekolah - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612c96e979983cdce5e31` },
            { title: "Cinta Nabi - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612be6e979983cdce5e2d` },
            { title: "Makan Sedap -  Omar & Hana", url: `${STREAM_HOST}/dl/6ad612c96e979983cdce5e32` },
            { title: "Kek Terakhir - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612c46e979983cdce5e2e` },
            { title: "Istimewa Hari Bapa - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612c46e979983cdce5e2f` },
            { title: "Nuzul Al-Quran - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612f56e979983cdce5e34` },
            { title: "Mama - Omar & Hana", url: `${STREAM_HOST}/dl/6ad612f56e979983cdce5e33` },
            { title: "Sufi - Omar & Hana", url: `${STREAM_HOST}/dl/6ad613416e979983cdce5e45` },
            { title: "Sayang Mama - Omar & Hana", url: `${STREAM_HOST}/dl/6ad613416e979983cdce5e44` },
            { title: "Ramadhan Dah Dekat! - Omar & Hana", url: `${STREAM_HOST}/dl/6ad6133c6e979983cdce5e42` },
            { title: "Rezeki - Omar & Hana", url: `${STREAM_HOST}/dl/6ad6133d6e979983cdce5e43` }
         ])
    },
    "chiikawa_catalog": {
        id: "chiikawa",
        catalogId: "chiikawa_catalog",
        name: "Chiikawa",
        poster: "https://i.postimg.cc/Y0PdWN3v/Chiikawa.jpg",
        posterShape: "poster",
        episodes: createEpisodes([
            { title: "Episode 1" , url: `${STREAM_HOST}/dl/6ae3f30c6e979983cdce6658` },
            { title: "Episode 2" , url: `${STREAM_HOST}/dl/6ae3f30c6e979983cdce6659` },
            { title: "Episode 3" , url: `${STREAM_HOST}/dl/6ae3f32f6e979983cdce665a` },
            { title: "Episode 4" , url: `${STREAM_HOST}/dl/6ae3f3c16e979983cdce665b` },
            { title: "Chiikawa Episode 51-100" , url: `${STREAM_HOST}/dl/6ae327aad617963c181912e6` },
            { title: "Chiikawa Episode 101-150" , url: `${STREAM_HOST}/dl/6ae327afd617963c181912e8` },
            { title: "Chiikawa Episode 150-220" , url: `${STREAM_HOST}/dl/6ae32778d617963c181912e4` } 
        ])
    },
    "time_bokan_24_catalog": {
        id: "time_bokan_24",
        catalogId: "time_bokan_24_catalog",
        name: "Time Bokan 24",
        poster: "https://i.postimg.cc/YCyfdWrV/Time-Bokan.jpg",
        posterShape: "poster",
        description: "Koleksi Episod Time Bokan.",
        episodes: createEpisodes([
            { title: "Time Bokan 24 Episode 01", url: "https://files.catbox.moe/n4j8xl.mp4" },
            { title: "Time Bokan 24 Episode 02", url: "https://files.catbox.moe/v4o3sd.mp4" },
            { title: "Time Bokan 24 Episode 03", url: "https://files.catbox.moe/voguk2.m4v" },
            { title: "Time Bokan 24 Episode 04", url: "https://files.catbox.moe/6q3ddb.mp4" },
            { title: "Time Bokan 24 Episode 05", url: "https://files.catbox.moe/cacsnu.m4v" },
            { title: "Time Bokan 24 Episode 06", url: "https://files.catbox.moe/aj41mh.m4v" },
            { title: "Time Bokan 24 Episode 07", url: "https://files.catbox.moe/xsqvb6.m4v" },
            { title: "Time Bokan 24 Episode 08", url: "https://files.catbox.moe/ykqbjx.m4v" },
            { title: "Time Bokan 24 Episode 09", url: "https://files.catbox.moe/hcauil.mp4" },
            { title: "Time Bokan 24 Episode 10", url: "https://files.catbox.moe/mwy80k.mp4" },
            { title: "Time Bokan 24 Episode 12", url: "https://files.catbox.moe/mu4lf9.m4v" },
            { title: "Time Bokan 24 Episode 13", url: "https://files.catbox.moe/p1clk3.mp4" },
            { title: "Time Bokan 24 Episode 14", url: "https://files.catbox.moe/lmntu3.m4v" },
            { title: "Time Bokan 24 Episode 15", url: "https://files.catbox.moe/h701o5.mp4" },
            { title: "Time Bokan 24 Episode 16", url: "https://files.catbox.moe/92fxmt.mp4" },
            { title: "Time Bokan 24 Episode 17", url: "https://files.catbox.moe/l1thkc.mp4" },
            { title: "Time Bokan 24 Episode 18", url: "https://files.catbox.moe/zrwycz.mp4" },
            { title: "Time Bokan 24 Episode 19", url: "https://files.catbox.moe/wcbqsa.mp4" },
            { title: "Time Bokan 24 Episode 20", url: "https://files.catbox.moe/l5nvlh.m4v" },
            { title: "Time Bokan 24 Episode 21", url: "https://files.catbox.moe/y5fvbb.m4v" },
            { title: "Time Bokan 24 Episode 22", url: "https://files.catbox.moe/raczkb.m4v" },
            { title: "Time Bokan 24 Episode 23", url: "https://files.catbox.moe/y68sfr.m4v" },
            { title: "Time Bokan 24 Episode 24", url: "https://files.catbox.moe/j1xs2b.m4v" }
        ])
    },
    "black_bullet_catalog": {
        id: "black_bullet",
        catalogId: "black_bullet_catalog",
        name: "Black Bullet",
        poster: "https://i.postimg.cc/bwTrP5nN/Black-Bullet-DP.jpg",
        posterShape: "poster",
        description: "Koleksi Episod Black Bullet.",
        episodes: createEpisodes([
            { title: "Black Bullet Episod 01", url: "https://files.catbox.moe/cejcsb.mp4" },
            { title: "Black Bullet Episod 02", url: "https://files.catbox.moe/8we7xb.mp4" },
            { title: "Black Bullet Episod 03", url: "https://files.catbox.moe/fceu6e.mp4" },
            { title: "Black Bullet Episod 04", url: "https://files.catbox.moe/rlaine.mp4" },
            { title: "Black Bullet Episod 05", url: "https://files.catbox.moe/hkldsr.mp4" },
            { title: "Black Bullet Episod 06", url: "https://files.catbox.moe/z7v9ck.mp4" },
            { title: "Black Bullet Episod 07", url: "https://files.catbox.moe/igsbwj.mp4" },
            { title: "Black Bullet Episod 08", url: "https://files.catbox.moe/9olk9c.mp4" },
            { title: "Black Bullet Episod 09", url: "https://files.catbox.moe/ry65ax.mp4" },
            { title: "Black Bullet Episod 10", url: "https://files.catbox.moe/vt8jw5.mp4" },
            { title: "Black Bullet Episod 11", url: "https://files.catbox.moe/h9guf6.mp4" },
            { title: "Black Bullet Episod 12", url: "https://files.catbox.moe/c9dd0j.mp4" },
            { title: "Black Bullet Episod 13", url: "https://files.catbox.moe/rmsyz8.mp4" }
        ])
    },
    "one_punch_man_s1_malay_catalog": {
        id: "one_punch_man_s1_malay_",
        catalogId: "one_punch_man_s1_malay_catalog",
        name: "One Punch Man Season 1 Malay Dubbed",
        poster: "https://i.postimg.cc/x12rFDXF/One-Punch-Man.jpg",
        posterShape: "poster",
        description: "Saitama bertemu dengan Genos, seorang remaja cyborg berusia 19 tahun yang menyaksikan sendiri kekuatan luar biasa itu. Genos meminta untuk menjadi anak murid Saitama.  Bersama-sama rakan sekutu baharu, Saitama mengharungi pelbagai insiden—termasuk ancaman raksasa dan makhluk asing—sambil mencari erti sebenar kekuatan dan kepuasan dalam hidupnya sebagai seorang wira.",
        episodes: createEpisodes([
            { title: "One Punch Man Episode 01", url: "https://files.catbox.moe/2ieuyd.mp4" },
            { title: "One Punch Man Episode 02", url: "https://files.catbox.moe/528107.mp4" },
            { title: "One Punch Man Episode 03", url: "https://files.catbox.moe/vwvqcd.mp4" },
            { title: "One Punch Man Episode 04", url: "https://files.catbox.moe/21nras.mp4" },
            { title: "One Punch Man Episode 05", url: "https://files.catbox.moe/3f6wvf.mp4" },
            { title: "One Punch Man Episode 06", url: "https://files.catbox.moe/edljvk.mp4" },
            { title: "One Punch Man Episode 07", url: "https://files.catbox.moe/qort2b.mp4" },
            { title: "One Punch Man Episode 08", url: "https://files.catbox.moe/1eid5h.mp4" },
            { title: "One Punch Man Episode 09", url: "https://files.catbox.moe/xwn50g.mp4" },
            { title: "One Punch Man Episode 10", url: "https://files.catbox.moe/2buq9l.mp4" },
            { title: "One Punch Man Episode 11", url: "https://files.catbox.moe/4b74pi.mp4" },
            { title: "One Punch Man Episode 12", url: "https://files.catbox.moe/ylgn52.mp4" }
        ])
    },
    "high_rise_invasion_catalog": {
        id: "high_rise_invasion",
        catalogId: "high_rise_invasion_catalog",
        name: "High Rise Invasion",
        poster: "https://i.postimg.cc/sgcxzLWB/High-Rise-Invasion-DP.jpg",
        posterShape: "poster",
        description: "Koleksi Episod High Rise Invasion.",
        episodes: createEpisodes([
            { title: "High-Rise Invasion Episode 1", url: "https://files.catbox.moe/vi2vel.mp4" },
            { title: "High-Rise Invasion Episode 2", url: "https://files.catbox.moe/g568zd.mp4" },
            { title: "High-Rise Invasion Episode 3", url: "https://files.catbox.moe/h5zfdl.mp4" },
            { title: "High-Rise Invasion Episode 4", url: "https://files.catbox.moe/x6m0cy.mp4" },
            { title: "High-Rise Invasion Episode 5", url: "https://files.catbox.moe/4k8ni9.mp4" },
            { title: "High-Rise Invasion Episode 6", url: "https://files.catbox.moe/escyek.mp4" },
            { title: "High-Rise Invasion Episode 7", url: "https://files.catbox.moe/wjy9yn.mp4" },
            { title: "High-Rise Invasion Episode 8", url: "https://files.catbox.moe/zqq96o.mp4" },
            { title: "High-Rise Invasion Episode 9", url: "https://files.catbox.moe/ora8mh.mp4" },
            { title: "High Rise Invasion Episode 10", url: "https://files.catbox.moe/6njp2m.mp4" },
            { title: "High Rise Invasion Episode 11", url: "https://files.catbox.moe/efwlgt.mp4" },
            { title: "High Rise Invasion Episode 12", url: "https://files.catbox.moe/cbsav5.mp4" }
        ])
    },
    "demon_slayer_catalog": {
        id: "demon_slayer",
        catalogId: "demon_slayer_catalog",
        name: "Demon Slayer",
        poster: "https://i.postimg.cc/pTC0CTKZ/Demon-Slayer-DP.jpg",
        posterShape: "poster",
        description: "Koleksi Episod Demon Slayer.",
        episodes: createEpisodes([
            { title: "Demon Slayer Episode 01", url: "https://files.catbox.moe/ymknn9.mkv" },
            { title: "Demon Slayer Episode 02", url: "https://files.catbox.moe/8amebp.mkv" },
            { title: "Demon Slayer Episode 03", url: "https://files.catbox.moe/w9rjx4.mkv" },
            { title: "Demon Slayer Episode 04", url: "https://files.catbox.moe/kyq6hw.mkv" },
            { title: "Demon Slayer Episode 05", url: "https://files.catbox.moe/jh0lup.mkv" },
            { title: "Demon Slayer Episode 06", url: "https://files.catbox.moe/bz9noe.mkv" },
            { title: "Demon Slayer Episode 07", url: "https://files.catbox.moe/c7u05z.mkv" },
            { title: "Demon Slayer Episode 08", url: "https://files.catbox.moe/l87nw8.mkv" },
            { title: "Demon Slayer Episode 09", url: "https://files.catbox.moe/ersmbj.mkv" },
            { title: "Demon Slayer Episode 10", url: "https://files.catbox.moe/pcdjer.mkv" },
            { title: "Demon Slayer Episode 11", url: "https://files.catbox.moe/u6hed5.mkv" },
            { title: "Demon Slayer Episode 12", url: "https://files.catbox.moe/czn22s.mkv" },
            { title: "Demon Slayer Episode 13", url: "https://files.catbox.moe/hz2yhv.mkv" },
            { title: "Demon Slayer Episode 14", url: "https://files.catbox.moe/ag0yj3.mkv" },
            { title: "Demon Slayer Episode 15", url: "https://files.catbox.moe/we1ejj.mkv" },
            { title: "Demon Slayer Episode 16", url: "https://files.catbox.moe/i5b7wv.mkv" },
            { title: "Demon Slayer Episode 17", url: "https://files.catbox.moe/osyo35.mkv" },
            { title: "Demon Slayer Episode 18", url: "https://files.catbox.moe/f34kl1.mkv" },
            { title: "Demon Slayer Episode 19", url: "https://files.catbox.moe/5splfq.mkv" },
            { title: "Demon Slayer Episode 20", url: "https://files.catbox.moe/br5y2i.mkv" },
            { title: "Demon Slayer Episode 21", url: "https://files.catbox.moe/1b8wv0.mkv" },
            { title: "Demon Slayer Episode 22", url: "https://files.catbox.moe/v807i2.mkv" },
            { title: "Demon Slayer Episode 23", url: "https://files.catbox.moe/im997a.mkv" },
            { title: "Demon Slayer Episode 24", url: "https://files.catbox.moe/so2ira.mp4" },
            { title: "Demon Slayer Episode 25", url: "https://files.catbox.moe/1vi0y3.mkv" },
            { title: "Demon Slayer Episode 26", url: "https://files.catbox.moe/u6rp6m.mkv" }
        ])
    },
    "gundam_catalog": {
        id: "gundam",
        catalogId: "gundam_catalog",
        name: "Gundam Build Fighter",
        poster: "https://i.postimg.cc/hjsCsjV5/Gundam-Build-Fighter-DP.png",
        posterShape: "poster",
        description: "Koleksi Episod Gundam Build Fighter.",
        episodes: createEpisodes([
            { title: "Gundam Build Fighter Episode 1", url: "https://files.catbox.moe/vzkag2.mp4" },
            { title: "Gundam Build Fighter Episode 2", url: "https://files.catbox.moe/dozmbq.mp4" },
            { title: "Gundam Build Fighter Episode 3", url: "https://files.catbox.moe/4muvqx.mp4" },
            { title: "Gundam Build Fighter Episode 4", url: "https://files.catbox.moe/mabk6r.mp4" },
            { title: "Gundam Build Fighter Episode 5", url: "https://files.catbox.moe/dps9x1.mp4" },
            { title: "Gundam Build Fighter Episode 6", url: "https://files.catbox.moe/p0jqdw.mp4" },
            { title: "Gundam Build Fighter Episode 7", url: "https://files.catbox.moe/61ezff.mp4" },
            { title: "Gundam Build Fighter Episode 8", url: "https://files.catbox.moe/ast9v8.mp4" },
            { title: "Gundam Build Fighter Episode 9", url: "https://files.catbox.moe/85uwou.mp4" },
            { title: "Gundam Build Fighter Episode 10", url: "https://files.catbox.moe/tbnzuy.mp4" },
            { title: "Gundam Build Fighter Episode 11", url: "https://files.catbox.moe/tpkt5v.mp4" },
            { title: "Gundam Build Fighter Episode 12", url: "https://files.catbox.moe/2rfg2z.mp4" },
            { title: "Gundam Build Fighter Episode 13", url: "https://files.catbox.moe/nkgyvz.mp4" },
            { title: "Gundam Build Fighter Episode 14", url: "https://files.catbox.moe/mjj1al.mp4" }
        ])
    },
    "naruto_1-220_catalog": {
        id: "naruto_1-220",
        catalogId: "naruto_1-220_catalog",
        name: "Naruto",
        poster: "https://i.postimg.cc/vB6mWzW6/Naruto-DP.jpg",
        background: "https://i.postimg.cc/Df4jWVHr/Naruto-WP.jpg",
        backgroundShape: "Landscape",
        description: "Dilahirkan tanpa ibu bapa, Naruto dibenci dan dipulaukan oleh penduduk kampungnya kerana badannya menjadi tempat kurungan Musang Ekor Sembilan (Kyubi), seekor raksasa ganas yang pernah memusnahkan kampung tersebut. Walau bagaimanapun, Naruto tidak pernah berputus asa. Dia tekad untuk berlatih bersungguh-sungguh dan membuktikan keupayaannya agar diiktiraf oleh orang ramai.",
        episodes: createEpisodes([
            { title: "Episod 1: Masuk! Uzumaki Naruto!", url: "https://files.catbox.moe/l9l4vb.mp4" },
            { title: "Episod 2: Nama Saya Konohamaru!", url: "https://files.catbox.moe/uqufre.mp4" },
            { title: "Episod 3: Musuh Ketat! Sasuke dan Sakura", url: "https://files.catbox.moe/pti3ta.mp4" },
            { title: "Episod 4: Lulus atau Gagal! Ujian Survival", url: "https://files.catbox.moe/96np0f.mp4" },
            { title: "Episod 5: Gagal? Keputusan Akhir Kakashi", url: "https://files.catbox.moe/0oscbw.mp4" },
            { title: "Episod 6: Misi Berbahaya! Perjalanan ke Negeri Ombak", url: "https://files.catbox.moe/d9kv81.mp4" },
            { title: "Episod 7: Pembunuh Bayaran Pakar!", url: "https://files.catbox.moe/4qb6ha.mp4" },
            { title: "Episod 8: Sumpahan Kesatriaan", url: "https://files.catbox.moe/cu2036.mp4" },
            { title: "Episod 9: Kakashi: Pahlawan Bermata Sharingan", url: "https://files.catbox.moe/go91q7.mp4" },
            { title: "Episod 10: Hutan Chakra", url: "https://files.catbox.moe/qly4np.mp4" },
            { title: "Episod 11: Negeri Tempat Munculnya Wira", url: "https://files.catbox.moe/ppyyu6.mp4" },
            { title: "Episod 12: Pertempuran di Jambatan! Zabuza Kembali!", url: "https://files.catbox.moe/8trnnb.mp4" },
            { title: "Episod 13: Seni Rahsia Haku: Cermin Kristal Ais Demonic", url: "https://files.catbox.moe/gvxbny.mp4" },
            { title: "Episod 14: Naruto Nombor Satu Masuk Medan", url: "https://files.catbox.moe/dfy6xg.mp4" },
            { title: "Episod 15: Pertempuran Tanpa Penglihatan: Sharingan Musnah", url: "https://files.catbox.moe/v1paaa.mp4" },
            { title: "Episod 16: Musnahnya Kunci Yang Dimeteraikan", url: "https://files.catbox.moe/v55j6x.mp4" },
            { title: "Episod 17: Masa Lalu Putih: Salji Tersembunyi", url: "https://files.catbox.moe/bwg2n9.mp4" },
            { title: "Episod 18: Senjata Bernama Shinobi", url: "https://files.catbox.moe/a2rb1n.mp4" },
            { title: "Episod 19: Zabuza Salji Darah", url: "https://files.catbox.moe/7134ay.mp4" },
            { title: "Episod 20: Bermulanya Musim Baru: Ujian Chunin!", url: "https://files.catbox.moe/voisud.mp4" },
            { title: "Episod 21: Kenalkan Mereka! Pesaing Baru Yang Hebat", url: "https://files.catbox.moe/fcpife.mp4" },
            { title: "Episod 22: Cabaran Baru: 100 Calon Chunin", url: "https://files.catbox.moe/yurhmd.mp4" },
            { title: "Episod 23: Pertarungan Pertama: Temui Pasukan 9", url: "https://files.catbox.moe/scn4x4.mp4" },
            { title: "Episod 24: Kelayakan Ujian Pertama: Ujian Bertulis", url: "https://files.catbox.moe/4gc3n4.mp4" },
            { title: "Episod 25: Soalan Kesepuluh: Pertaruhan Nyawa", url: "https://files.catbox.moe/z5dfsm.mp4" },
            { title: "Episod 26: Laporan Khas: Masuk Ke Hutan Kematian", url: "https://files.catbox.moe/1nyw3h.mp4" },
            { title: "Episod 27: Ujian Kedua Bermula: Semua Musuh Adalah Sasaran", url: "https://files.catbox.moe/yrrl1b.mp4" },
            { title: "Episod 28: Jangan Mengalah! Temui Naruto", url: "https://files.catbox.moe/eqmf2k.mp4" },
            { title: "Episod 29: Naruto Bangkit! Kuasa Sembilan Ekor", url: "https://files.catbox.moe/0nl4b1.mp4" },
            { title: "Episod 30: Cinta Sakura: Keputusan Berani", url: "https://files.catbox.moe/mwppj3.mp4" },
            { title: "Episod 31: Shoryu Tensei: Cinta dan Keberanian Lee", url: "https://files.catbox.moe/07olps.mp4" },
            { title: "Episod 32: Bunga Sakura Mekar: Kebenaran Terbongkar", url: "https://files.catbox.moe/fiobj8.mp4" },
            { title: "Episod 33: Formasi Terkuat: Pasukan Ino-Shika-Cho!", url: "https://files.catbox.moe/4w81b8.mp4" },
            { title: "Episod 34: Akatsuki Menyerang: Gaara Menunjuk Belang", url: "https://files.catbox.moe/qwynz0.mp4" },
            { title: "Episod 35: Gulungan Rahsia: Siapa Yang Dapat Dulu?", url: "https://files.catbox.moe/3eb4rw.mp4" },
            { title: "Episod 36: Pertembungan Pasangan: Klon Melawan Klon", url: "https://files.catbox.moe/itcgyj.mp4" },
            { title: "Episod 37: Amaran Kedua: Hayate Ditemui Mati", url: "https://files.catbox.moe/w5fiz6.mp4" },
            { title: "Episod 38: Pusingan Kelayakan Ketiga Bermula", url: "https://files.catbox.moe/08asee.mp4" },
            { title: "Episod 39: Kuasa Kipas Temari vs Tenten", url: "https://files.catbox.moe/7z8pt1.mp4" },
            { title: "Episod 40: Pertarungan Sengit Shikamaru", url: "https://files.catbox.moe/xztdqb.mp4" },
            { title: "Episod 41: Kiba vs Naruto: Pertarungan Anjing Liar", url: "https://files.catbox.moe/g1vww4.mp4" },
            { title: "Episod 42: Taktik Bijak Naruto: Pertarungan Tipu Daya", url: "https://files.catbox.moe/0tssqs.mp4" },
            { title: "Episod 43: Hinata Menentang Neji: Tradisi Keluarga Hyuga", url: "https://files.catbox.moe/jxjz7g.mp4" },
            { title: "Episod 44: Tekad Merah Hinata", url: "https://files.catbox.moe/frcvcs.mp4" },
            { title: "Episod 45: Perlawanan Seterusnya: Lee Melawan Gaara", url: "https://files.catbox.moe/k9p2gm.mp4" },
            { title: "Episod 46: Pukulan Maut! Rahsia Teknik Pintu Terbuka", url: "https://files.catbox.moe/662fmj.mp4" },
            { title: "Episod 47: Pertembungan Hebat: Usaha Melawan Takdir", url: "https://files.catbox.moe/pl4nzj.mp4" },
            { title: "Episod 48: Kehebatan Tersembunyi Sasuke", url: "https://files.catbox.moe/8a0li2.mp4" },
            { title: "Episod 49: Chidori vs Pasir Gaara", url: "https://files.catbox.moe/kncowe.mp4" },
            { title: "Episod 50: Kisah Disebalik Garisan Takdir", url: "https://files.catbox.moe/vr3cf4.mp4" },
            { title: "Episod 51: Pertemuan Semula Dengan Jiraiya", url: "https://files.catbox.moe/369pct.mp4" },
            { title: "Episod 52: Latihan Rasengan Bersama Pertapa Genit", url: "https://files.catbox.moe/0ebgf0.mp4" },
            { title: "Episod 53: Pusingan Akhir Ujian Chunin Bermula", url: "https://files.catbox.moe/grtwmw.mp4" },
            { title: "Episod 54: Permulaan Perlawanan Akhir Sasuke", url: "https://files.catbox.moe/dyyhl2.mp4" },
            { title: "Episod 55: Munculnya Juruhebah Berita Konoha", url: "https://files.catbox.moe/2mvk00.mp4" },
            { title: "Episod 56: Pertarungan Penuh Kejutan: Shikamaru Menyerah?", url: "https://files.catbox.moe/50cz41.mp4" },
            { title: "Episod 57: Keputusan Pusingan Penyingkiran Ketiga", url: "https://files.catbox.moe/xlnork.mp4" },
            { title: "Episod 58: Serangan Musuh Di Kampung Daun", url: "https://files.catbox.moe/zr96rf.mp4" },
            { title: "Episod 59: Pertempuran Kemuncak: Hokage Ketiga", url: "https://files.catbox.moe/hasu5a.mp4" },
            { title: "Episod 60: Pertarungan Dua Legenda: Warisan Hokage", url: "https://files.catbox.moe/gsga7j.mp4" },
            { title: "Episod 61: Keputusan Pertempuran Terakhir", url: "https://files.catbox.moe/4jk5zp.mp4" },
            { title: "Episod 62: Kebangkitan Kuasa Sepuluh Jari", url: "https://files.catbox.moe/fec4pc.mp4" },
            { title: "Episod 63: Penamat Yang Menyayat Hati", url: "https://files.catbox.moe/cozoea.mp4" },
            { title: "Episod 64: Awan Merah Menghampiri Konoha", url: "https://files.catbox.moe/d24q7d.mp4" },
            { title: "Episod 65: Itachi Uchiha Kembali!", url: "https://files.catbox.moe/mwgt3d.mp4" },
            { title: "Episod 66: Pertembungan Mata Sharingan Di Kedai Kopi", url: "https://files.catbox.moe/wwqp8u.mp4" },
            { title: "Episod 67: Misi Mencari Tsunade Bermula", url: "https://files.catbox.moe/l50dbn.mp4" },
            { title: "Episod 68: Perjalanan Bersama Ahli Perubatan Legendaris", url: "https://files.catbox.moe/8ay7xc.mp4" },
            { title: "Episod 69: Pertembungan Tiga Sannin Hebat", url: "https://files.catbox.moe/tcil9a.mp4" },
            { title: "Episod 70: Rasengan Sempurna Naruto", url: "https://files.catbox.moe/qw8fhh.mp4" },
            { title: "Episod 71: Pertarungan Panggil Binata Besar", url: "https://files.catbox.moe/rtlqrv.mp4" },
            { title: "Episod 72: Kembalinya Hokage Kelima", url: "https://files.catbox.moe/m402t6.mp4" },
            { title: "Episod 73: Pertarungan Sasuke Melawan Itachi", url: "https://files.catbox.moe/nz8k2o.mp4" },
            { title: "Episod 74: Keputusan Ke-100: Beban Nama Baik Klan Uchiha", url: "https://files.catbox.moe/m2xrvi.mp4" },
            { title: "Episod 75: Impian Sasuke Yang Hilang", url: "https://files.catbox.moe/4r6v00.mp4" },
            { title: "Episod 76: Misi Menjejaki Sasuke Bermula", url: "https://files.catbox.moe/lphkkk.mp4" },
            { title: "Episod 77: Pembentukan Pasukan Penyelamat Sasuke", url: "https://files.catbox.moe/dpchoc.mp4" },
            { title: "Episod 78: Pertempuran Bermula: Penyelamat Melawan Empat Orang Bunian", url: "https://files.catbox.moe/ewdd24.mp4" },
            { title: "Episod 79: Kehebatan Pasukan Khas Lembah Akhir", url: "https://files.catbox.moe/pbu0st.mp4" },
            { title: "Episod 80: Pertarungan Choji: Pengorbanan Sahabat Sejati", url: "https://files.catbox.moe/0g8ouu.mp4" },
            { title: "Episod 81: Neji Terperangkap Dalam Perangkap Maut", url: "https://files.catbox.moe/kiyjwc.mp4" },
            { title: "Episod 82: Bantuan Tiba: Sekutu Dari Pasukan Pasir", url: "https://files.catbox.moe/r6e382.mp4" },
            { title: "Episod 83: Pertarungan Puncak Lembah Akhir", url: "https://files.catbox.moe/kzql39.mp4" },
            { title: "Episod 84: Rasengan Bertemu Chidori!", url: "https://files.catbox.moe/09e56f.mp4" },
            { title: "Episod 85: Janji Yang Tidak Tertunai", url: "https://files.catbox.moe/wohgx6.mp4" },
            { title: "Episod 86: Kepulangan Yang Menyayat Hati", url: "https://files.catbox.moe/xr03q8.mp4" },
            { title: "Episod 87: Misi Baru Di Bawah Pimpinan Hokage Kelima", url: "https://files.catbox.moe/cz4cyq.mp4" },
            { title: "Episod 88: Muslihat Di Sebalik Kelihatan", url: "https://files.catbox.moe/y2yozf.mp4" },
            { title: "Episod 89: Misteri Harta Karun Negeri Laut", url: "https://files.catbox.moe/r8gnf4.mp4" },
            { title: "Episod 90: Penjaga Hati Dan Semangat Ninja", url: "https://files.catbox.moe/bj9v46.mp4" },
            { title: "Episod 91: Munculnya Juruhebah Rahsia", url: "https://files.catbox.moe/sthzof.mp4" },
            { title: "Episod 92: Pengembaraan Bersama Jiraiya Bermula", url: "https://files.catbox.moe/9ddsjh.mp4" },
            { title: "Episod 93: Latihan Khas Rasengan Jarak Jauh", url: "https://files.catbox.moe/g6mu0g.mp4" },
            { title: "Episod 94: Kehebatan Benteng Pertahanan Mutlak", url: "https://files.catbox.moe/cjekls.mp4" },
            { title: "Episod 95: Pertarungan Menentang Klan Fuma", url: "https://files.catbox.moe/rt9k2y.mp4" },
            { title: "Episod 96: Kesilapan Masa Lalu Yang Menghantui", url: "https://files.catbox.moe/ve6qms.mp4" },
            { title: "Episod 97: Cabaran Kumpulan Siasatan Khas", url: "https://files.catbox.moe/d6r7i2.mp4" },
            { title: "Episod 98: Tugas Paling Sukar Hokage Kelima", url: "https://files.catbox.moe/mswy0v.mp4" },
            { title: "Episod 99: Sumpahan Raksasaki: Air Terjun Darah", url: "https://files.catbox.moe/4nox4m.mp4" },
            { title: "Episod 100: Impian Seorang Ninja Sejati", url: "https://files.catbox.moe/o1i0am.mp4" },
            { title: "Episod 101: Wajah Sebenar Kakashi Sensei Terbongkar!", url: "https://files.catbox.moe/1qcwd1.mp4" },
            { title: "Episod 102: Misi Menyelamatkan Negeri Teh", url: "https://files.catbox.moe/acr2mz.mp4" },
            { title: "Episod 103: Perlumbaan Kapal Di Lautan Lepas", url: "https://files.catbox.moe/wdfvk3.mp4" },
            { title: "Episod 104: Aksi Berani Di Lautan Bergelora", url: "https://files.catbox.moe/a44qp8.mp4" },
            { title: "Episod 105: Pertembungan Akhir Lumba Kapal", url: "https://files.catbox.moe/sgms32.mp4" },
            { title: "Episod 106: Pertarungan Sengit Di Pelabuhan", url: "https://files.catbox.moe/pbhxb1.mp4" },
            { title: "Episod 107: Pilihan Sukar Sasuke Uchiha", url: "https://files.catbox.moe/ph2rdj.mp4" },
            { title: "Episod 108: Pintu Gerbang Kegelapan Dibuka", url: "https://files.catbox.moe/71shvn.mp4" },
            { title: "Episod 109: Bunyi Bunyian Angin Malam", url: "https://files.catbox.moe/tigmqf.mp4" },
            { title: "Episod 110: Pasukan Pemburu Beraksi", url: "https://files.catbox.moe/zbio0n.mp4" },
            { title: "Episod 111: Pertempuran Antara Bunian Dan Ninja", url: "https://files.catbox.moe/3oibcn.mp4" },
            { title: "Episod 112: Kegagalan Misi Mengukir Luka", url: "https://files.catbox.moe/ufxbyd.mp4" },
            { title: "Episod 113: Kekuatan Penuh Pasukan Bantuan Konoha", url: "https://files.catbox.moe/fzy2ar.mp4" },
            { title: "Episod 114: Pertarungan Kiba Melawan Sakon", url: "https://files.catbox.moe/hkqfag.mp4" },
            { title: "Episod 115: Strategi Hebat Shikamaru Diuji", url: "https://files.catbox.moe/n3vfu6.mp4" },
            { title: "Episod 116: Bantuan Dari Negeri Pasir Muncul", url: "https://files.catbox.moe/cx7j8j.mp4" },
            { title: "Episod 117: Pertarungan Kimimaro: Tulang Maut", url: "https://files.catbox.moe/54i5kn.mp4" },
            { title: "Episod 118: Pertolongan Di Saat Akhir", url: "https://files.catbox.moe/js4kro.mp4" },
            { title: "Episod 119: Kesilapan Strategi Pertarungan Terakhir", url: "https://files.catbox.moe/6jddic.mp4" },
            { title: "Episod 120: Pertarungan Hidup Mati Rock Lee", url: "https://files.catbox.moe/0xgb0g.mp4" },
            { title: "Episod 121: Kehebatan Teknik Mabuk Drunken Fist", url: "https://files.catbox.moe/t37vuh.mp4" },
            { title: "Episod 122: Kuasa Tersembunyi Gaara Diuji", url: "https://files.catbox.moe/jn2ah9.mp4" },
            { title: "Episod 123: Pertembungan Dua Sahabat Karib", url: "https://files.catbox.moe/4fgt40.mp4" },
            { title: "Episod 124: Pilihan Antara Cahaya Dan Kegelapan", url: "https://files.catbox.moe/2oul3y.mp4" },         
            { title: "Episod 125: Kawan Sejati Sepanjang Zaman", url: "https://files.catbox.moe/gqco01.mp4" },
            { title: "Episod 126: Pertembungan Puncak Di Lembah Kematian", url: "https://files.catbox.moe/3f4zze.mp4" },
            { title: "Episod 127: Keputusan Di Hujung Takdir", url: "https://files.catbox.moe/3oirvx.mp4" },
            { title: "Episod 128: Gema Penyesalan Yang Mendalam", url: "https://files.catbox.moe/tuxowv.mp4" },
            { title: "Episod 129: Ikatan Persahabatan Yang Berdarah", url: "https://files.catbox.moe/oiv04u.mp4" },
            { title: "Episod 130: Pertarungan Mata Sharingan Ketiga", url: "https://files.catbox.moe/oxesbg.mp4" },
            { title: "Episod 131: Air Mata Di Hujung Ikatan", url: "https://files.catbox.moe/mmf3rx.mp4" },
            { title: "Episod 132: Rahsia Gelap Di Sebalik Garisan Takdir", url: "https://files.catbox.moe/plxslv.mp4" },
            { title: "Episod 133: Jeritan Hati Seorang Sahabat", url: "https://files.catbox.moe/ob7yn7.mp4" },
            { title: "Episod 134: Akhir Sebuah Pengembaraan Di Lembah", url: "https://files.catbox.moe/kqc6kp.mp4" },
            { title: "Episod 135: Janji Yang Belum Tertunai", url: "https://files.catbox.moe/ll10xi.mp4" },
            { title: "Episod 136: Misi Menembus Benteng Musuh", url: "https://files.catbox.moe/sbowfn.mp4" },
            { title: "Episod 137: Perangkap Misteri Di Markas Musuh", url: "https://files.catbox.moe/t50sn1.mp4" },
            { title: "Episod 138: Pengkhianatan Di Tengah Kegelapan", url: "https://files.catbox.moe/bv7ng0.mp4" },
            { title: "Episod 139: Pertarungan Sengit Di Markas Orochimaru", url: "https://files.catbox.moe/ci4a9b.mp4" },
            { title: "Episod 140: Skim Pemusnahan Penjara Suci", url: "https://files.catbox.moe/denrl9.mp4" },
            { title: "Episod 141: Keyakinan Diri Yang Teruji", url: "https://files.catbox.moe/5j8crb.mp4" },
            { title: "Episod 142: Pertarungan Penjara Berapi", url: "https://files.catbox.moe/49sab1.mp4" },
            { title: "Episod 143: Cabaran Misi Menyelamatkan Harta", url: "https://files.catbox.moe/einhzc.mp4" },
            { title: "Episod 144: Kebangkitan Semangat Pasukan Ketiga", url: "https://files.catbox.moe/0wb1h0.mp4" },
            { title: "Episod 145: Formasi Baharu Diuji", url: "https://files.catbox.moe/r5devg.mp4" },
            { title: "Episod 146: Munculnya Musuh Berwajah Seribu", url: "https://files.catbox.moe/ph6n98.mp4" },
            { title: "Episod 147: Pertarungan Di Pinggir Hutan Larangan", url: "https://files.catbox.moe/2gsc7r.mp4" },
            { title: "Episod 148: Misi Mencari Biksu Misterius", url: "https://files.catbox.moe/psndlc.mp4" },
            { title: "Episod 149: Misteri Di Sebalik Kuasa Bayangan", url: "https://files.catbox.moe/2wtf8a.mp4" },
            { title: "Episod 150: Pertarungan Menentang Klan Mizuki", url: "https://files.catbox.moe/3keb7u.mp4" },
            { title: "Episod 151: Keputusan Di Markas Mizuki", url: "https://files.catbox.moe/f8hq2r.mp4" },
            { title: "Episod 152: Penjejakan Biksu Yang Hilang", url: "https://files.catbox.moe/ncu4p8.mp4" },
            { title: "Episod 153: Serangan Berani Di Kubu Musuh", url: "https://files.catbox.moe/6cvwlw.mp4" },
            { title: "Episod 154: Muslihat Di Sebalik Kabus Tebal", url: "https://files.catbox.moe/v1uahd.mp4" },
            { title: "Episod 155: Perlumbaan Menentang Masa", url: "https://files.catbox.moe/3p2tcw.mp4" },
            { title: "Episod 156: Misteri Di Padang Pasir Luas", url: "https://files.catbox.moe/nxd2eb.mp4" },
            { title: "Episod 157: Pertarungan Di Kubu Misteri", url: "https://files.catbox.moe/8sx5o3.mp4" },
            { title: "Episod 158: Keputusan Misi Menyelamat", url: "https://files.catbox.moe/wzml3x.mp4" },
            { title: "Episod 159: Misi Mengawal Kumpulan Penjenayah", url: "https://files.catbox.moe/ie0t8y.mp4" },
            { title: "Episod 160: Pertarungan Di Kuil Kuno", url: "https://files.catbox.moe/3q3gqb.mp4" },
            { title: "Episod 161: Munculnya Binatang Buas Legenda", url: "https://files.catbox.moe/ii92an.mp4" },
            { title: "Episod 162: Kuasa Mistik Binatang Berekor Tiga", url: "https://files.catbox.moe/pulox7.mp4" },
            { title: "Episod 163: Strategi Menumpaskan Raksasa Laut", url: "https://files.catbox.moe/xe6rfl.mp4" },
            { title: "Episod 164: Pertarungan Di Permukaan Air", url: "https://files.catbox.moe/c660zq.mp4" },
            { title: "Episod 165: Misteri Di Pulau Terpencil", url: "https://files.catbox.moe/5ezhj5.mp4" },
            { title: "Episod 166: Penyelidikan Di Makam Kuno", url: "https://files.catbox.moe/uczt7t.mp4" }, 
            { title: "Episod 167: Perangkap Maut Di Dalam Tanah", url: "https://files.catbox.moe/xyi6q0.mp4" },
            { title: "Episod 168: Latihan Istimewa Di Kampung Daun", url: "https://files.catbox.moe/vbxfbm.mp4" },
            { title: "Episod 169: Kenangan Bersama Pasukan Lama", url: "https://files.catbox.moe/t47k16.mp4" },
            { title: "Episod 170: Pertarungan Sengit Di Lorong Sunyi", url: "https://files.catbox.moe/jipokx.mp4" },
            { title: "Episod 171: Misteri Jejak Kaki Di Salji", url: "https://files.catbox.moe/akebz3.mp4" },
            { title: "Episod 172: Pertarungan Di Puncak Gunung Ais", url: "https://files.catbox.moe/hcrvxp.mp4" },
            { title: "Episod 173: Misi Menyelamatkan Puteri Negeri", url: "https://files.catbox.moe/pl5o1j.mp4" },
            { title: "Episod 174: Serangan Ghaib Di Istana Lama", url: "https://files.catbox.moe/cpw0df.mp4" },
            { title: "Episod 175: Seni Pertahanan Diri Yang Hilang", url: "https://files.catbox.moe/79ze8x.mp4" },
            { title: "Episod 176: Keputusan Di Dewan Perjuangan", url: "https://files.catbox.moe/qhnjgs.mp4" },
            { title: "Episod 177: Misi Mengawal Pedang Legenda", url: "https://files.catbox.moe/ak2dok.mp4" },
            { title: "Episod 178: Pertarungan Menentang Pencuri Pedang", url: "https://files.catbox.moe/0c3nel.mp4" },
            { title: "Episod 179: Penjejakan Di Hutan Berkabus", url: "https://files.catbox.moe/1b92z4.mp4" },
            { title: "Episod 180: Keputusan Di Markas Penjenayah", url: "https://files.catbox.moe/bornme.mp4" },
            { title: "Episod 181: Misi Rahsia Di Kampung Bintang", url: "https://files.catbox.moe/hx5lw9.mp4" },
            { title: "Episod 182: Misteri Di Sebalik Tabir Bintang", url: "https://files.catbox.moe/72cswj.mp4" },
            { title: "Episod 183: Kuasa Misteri Batu Meteorit", url: "https://files.catbox.moe/uhjbvr.mp4" },
            { title: "Episod 184: Pengorbanan Demi Kampung Bintang", url: "https://files.catbox.moe/xokp9s.mp4" },
            { title: "Episod 185: Pertarungan Terakhir Di Lembah Meteor", url: "https://files.catbox.moe/cx551m.mp4" },
            { title: "Episod 186: Kenangan Zaman Kanak-Kanak Kiba", url: "https://files.catbox.moe/s43yjd.mp4" },
            { title: "Episod 187: Misi Mengawal Lori Barang Misteri", url: "https://files.catbox.moe/0ci2co.mp4" },
            { title: "Episod 188: Serangan Penyamun Di Jalan Raya", url: "https://files.catbox.moe/naear3.mp4" },
            { title: "Episod 189: Wajah Disebalik Topeng Penyamun", url: "https://files.catbox.moe/fnnyp4.mp4" },
            { title: "Episod 190: Misteri Di Rumah Berhantu", url: "https://files.catbox.moe/fnd15d.mp4" },
            { title: "Episod 191: Pertarungan Di Lorong Gelap", url: "https://files.catbox.moe/a73t9c.mp4" },
            { title: "Episod 192: Kisah Latihan Genin Di Konoha", url: "https://files.catbox.moe/5inmrv.mp4" },
            { title: "Episod 193: Cabaran Memasak Makanan Ninja", url: "https://files.catbox.moe/dy2pt8.mp4" },
            { title: "Episod 194: Misteri Pesanan Terakhir Pelanggan", url: "https://files.catbox.moe/7j69sy.mp4" },
            { title: "Episod 195: Pertarungan Di Kubu Sepi", url: "https://files.catbox.moe/415z84.mp4" },
            { title: "Episod 196: Pertembungan Pasukan Istimewa Anbu", url: "https://files.catbox.moe/325lf0.mp4" },
            { title: "Episod 197: Misi Mengawal Penjara Keselamatan Tinggi", url: "https://files.catbox.moe/pnm92s.mp4" },
            { title: "Episod 198: Pemberontakan Di Dalam Penjara", url: "https://files.catbox.moe/lonvj7.mp4" },
            { title: "Episod 199: Keputusan Di Pintu Gerbang Penjara", url: "https://files.catbox.moe/qvnbk2.mkv" },
            { title: "Episod 200: Perlawanan Penuh Ketawa Di Konoha", url: "https://files.catbox.moe/63myw6.mp4" },
            { title: "Episod 201: Misi Menyelamatkan Pelajar Akademi", url: "https://files.catbox.moe/yx754s.mp4" },
            { title: "Episod 202: Pertarungan Di Hutan Pengganti", url: "https://files.catbox.moe/es3bzy.mp4" },
            { title: "Episod 203: Keputusan Misi Menyelamat Pelajar", url: "https://files.catbox.moe/jyj86n.mp4" },
            { title: "Episod 204: Misteri KLAN Kurama Yang Hilang", url: "https://files.catbox.moe/u4t4nq.mp4" },    
            { title: "Episod 205: Ilusi Maut Di Rumah Keluarga Kurama", url: "https://files.catbox.moe/0z8z4h.mkv" },
            { title: "Episod 206: Penyelamatan Di Alam Ilusi", url: "https://files.catbox.moe/6pg1ng.mp4" },
            { title: "Episod 207: Pertarungan Menentang Bayangan Diri", url: "https://files.catbox.moe/y1no1o.mp4" },
            { title: "Episod 208: Keputusan Di Alam Ilusi Sempurna", url: "https://files.catbox.moe/4f7hjj.mp4" },
            { title: "Episod 209: Misi Mengawal Bekalan Istimewa", url: "https://files.catbox.moe/zwgfts.mp4" },
            { title: "Episod 210: Tipu Daya Di Padang Pasir Luas", url: "https://files.catbox.moe/lfjnq5.mp4" },
            { title: "Episod 211: Pertarungan Menentang Pahlawan Bayangan", url: "https://files.catbox.moe/8u67jt.mp4" },
            { title: "Episod 212: Keputusan Pertarungan Di Padang Pasir", url: "https://files.catbox.moe/6x2ixc.mp4" },
            { title: "Episod 213: Misteri Kenangan Yang Hilang", url: "https://files.catbox.moe/werv1k.mp4" },
            { title: "Episod 214: Penjejakan Di Kampung Asal", url: "https://files.catbox.moe/c02d30.mp4" },
            { title: "Episod 215: Wajah Disebalik Ingatan Yang Pulih", url: "https://files.catbox.moe/7lamgf.mp4" },
            { title: "Episod 216: Pertarungan Menentang Pelajar Pelarian", url: "https://files.catbox.moe/myshs3.mp4" },
            { title: "Episod 217: Keputusan Di Jambatan Takdir", url: "https://files.catbox.moe/rnc1t4.mp4" },
            { title: "Episod 218: Misi Menyelamatkan Karyawan Pelarian", url: "https://files.catbox.moe/4p31f1.mp4" },
            { title: "Episod 219: Pertarungan Di Kuil Penjagaan Purba", url: "https://files.catbox.moe/n15jkp.mp4" },
            { title: "Episod 220: Perpisahan Dan Permulaan Baharu", url: "https://files.catbox.moe/j5f4md.mp4" }
        ])
    },
    "boruto_catalog": {
        id: "boruto",
        catalogId: "boruto_catalog",
        name: "Boruto Next Generation",
        poster: "https://i.postimg.cc/1tBWBtDc/Boruto-DP.jpg",
        background: "https://i.postimg.cc/WpqWDRCM/Boruto-WP.jpg",
        backgroundShape: "Landscape",
        description: "Dalam era yang serba moden ini, Boruto Uzumaki memulakan perjalanannya di Akademi Ninja. Walaupun dia seorang yang genius, Boruto sering berasa sunyi dan menyimpan perasaan geram terhadap bapanya, Naruto, yang sentiasa sibuk dengan tugas sebagai Hokage sehingga mengabaikan keluarga. Disebabkan itu, Boruto bertekad untuk tidak mengikut jejak langkah bapanya. Dia memilih untuk mengukir jalannya sendiri sebagai ninja dan malah berguru dengan seteru serta sahabat baik bapanya, iaitu Sasuke Uchiha.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6acca26e6e979983cdce59d3` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6acca26e6e979983cdce59d4` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6acca26e6e979983cdce59d5` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6acca2736e979983cdce59d6` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6acca27a6e979983cdce59d7` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6acca2a06e979983cdce59d8` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6acca2a06e979983cdce59d9` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6acca2a06e979983cdce59da` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6acca2a66e979983cdce59db` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6acca2a66e979983cdce59dc` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6acca2ab6e979983cdce59de` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6acca2ab6e979983cdce59df` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6acca2b16e979983cdce59e0` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6acca2b16e979983cdce59e1` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6acca2dc6e979983cdce59e2` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6acca2e06e979983cdce59e3` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6acca2e06e979983cdce59e4` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6acca2e16e979983cdce59e6` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6acca2e16e979983cdce59e5` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6acca2e66e979983cdce59e7` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6acca2e66e979983cdce59e8` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6acca2eb6e979983cdce59e9` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6acca2ec6e979983cdce59ea` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6acca2ec6e979983cdce59eb` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6acca2f26e979983cdce59ec` },
            { title: "Episode 26", url: `${STREAM_HOST}/dl/6acca3186e979983cdce59ed` },
            { title: "Episode 27", url: `${STREAM_HOST}/dl/6acca31e6e979983cdce59ee` },
            { title: "Episode 28", url: `${STREAM_HOST}/dl/6acca31e6e979983cdce59ef` },
            { title: "Episode 29", url: `${STREAM_HOST}/dl/6acca3246e979983cdce59f0` },
            { title: "Episode 30", url: `${STREAM_HOST}/dl/6acca3246e979983cdce59f1` },
            { title: "Episode 31", url: `${STREAM_HOST}/dl/6acca3256e979983cdce59f2` },
            { title: "Episode 32", url: `${STREAM_HOST}/dl/6acca3296e979983cdce59f3` },
            { title: "Episode 33", url: `${STREAM_HOST}/dl/6acca3296e979983cdce59f4` },
            { title: "Episode 34", url: `${STREAM_HOST}/dl/6acca3296e979983cdce59f5` },
            { title: "Episode 35", url: `${STREAM_HOST}/dl/6acca32f6e979983cdce59f6` },
            { title: "Episode 36", url: `${STREAM_HOST}/dl/6acca32f6e979983cdce59f7` },
            { title: "Episode 37", url: `${STREAM_HOST}/dl/6acca3546e979983cdce59f8` },
            { title: "Episode 38", url: `${STREAM_HOST}/dl/6acca35a6e979983cdce59f9` },
            { title: "Episode 39", url: `${STREAM_HOST}/dl/6acca35c6e979983cdce59fa` },
            { title: "Episode 40", url: `${STREAM_HOST}/dl/6acca35f6e979983cdce59fb` },
            { title: "Episode 41", url: `${STREAM_HOST}/dl/6acca35f6e979983cdce59fc` },
            { title: "Episode 42", url: `${STREAM_HOST}/dl/6acca3606e979983cdce59fd` },
            { title: "Episode 43", url: `${STREAM_HOST}/dl/6acca3606e979983cdce59fe` },
            { title: "Episode 44", url: `${STREAM_HOST}/dl/6acca3656e979983cdce59ff` },
            { title: "Episode 45", url: `${STREAM_HOST}/dl/6acca3906e979983cdce5a00` },
            { title: "Episode 46", url: `${STREAM_HOST}/dl/6acca3906e979983cdce5a01` },
            { title: "Episode 47", url: `${STREAM_HOST}/dl/6acca3906e979983cdce5a02` },
            { title: "Episode 48", url: `${STREAM_HOST}/dl/6acca3956e979983cdce5a03` },
            { title: "Episode 49", url: `${STREAM_HOST}/dl/6acca39b6e979983cdce5a04` },
            { title: "Episode 50", url: `${STREAM_HOST}/dl/6acca39b6e979983cdce5a05` },
            { title: "Episode 51", url: `${STREAM_HOST}/dl/6acca39b6e979983cdce5a06` },
            { title: "Episode 52", url: `${STREAM_HOST}/dl/6acca3a06e979983cdce5a07` },
            { title: "Episode 53", url: `${STREAM_HOST}/dl/6acca3a06e979983cdce5a08` },
            { title: "Episode 54", url: `${STREAM_HOST}/dl/6acca3a06e979983cdce5a09` },
            { title: "Episode 55", url: `${STREAM_HOST}/dl/6acca3a56e979983cdce5a0a` },
            { title: "Episode 56", url: `${STREAM_HOST}/dl/6acca3cd6e979983cdce5a0b` },
            { title: "Episode 57", url: `${STREAM_HOST}/dl/6acca3cd6e979983cdce5a0c` },
            { title: "Episode 58", url: `${STREAM_HOST}/dl/6acca3cd6e979983cdce5a0d` },
            { title: "Episode 59", url: `${STREAM_HOST}/dl/6acca3d26e979983cdce5a0e` },
            { title: "Episode 60", url: `${STREAM_HOST}/dl/6acca3d76e979983cdce5a0f` },
            { title: "Episode 61", url: `${STREAM_HOST}/dl/6acca3d76e979983cdce5a10` },
            { title: "Episode 62", url: `${STREAM_HOST}/dl/6acca3d76e979983cdce5a11` },
            { title: "Episode 63", url: `${STREAM_HOST}/dl/6acca3dc6e979983cdce5a13` },
            { title: "Episode 64", url: `${STREAM_HOST}/dl/6acca3dd6e979983cdce5a14` },
            { title: "Episode 65", url: `${STREAM_HOST}/dl/6acca6056e979983cdce5a15` },
            { title: "Episode 66", url: `${STREAM_HOST}/dl/6acca6056e979983cdce5a16` },
            { title: "Episode 67", url: `${STREAM_HOST}/dl/6acca6056e979983cdce5a17` },
            { title: "Episode 68", url: `${STREAM_HOST}/dl/6acca6056e979983cdce5a18` },
            { title: "Episode 69", url: `${STREAM_HOST}/dl/6acca6056e979983cdce5a19` },
            { title: "Episode 70", url: `${STREAM_HOST}/dl/6acca6056e979983cdce5a1a` },
            { title: "Episode 71", url: `${STREAM_HOST}/dl/6acca60d6e979983cdce5a1b` },
            { title: "Episode 72", url: `${STREAM_HOST}/dl/6acca60d6e979983cdce5a1c` },
            { title: "Episode 73", url: `${STREAM_HOST}/dl/6acca60d6e979983cdce5a1d` },
            { title: "Episode 74", url: `${STREAM_HOST}/dl/6acca60d6e979983cdce5a1e` },
            { title: "Episode 75", url: `${STREAM_HOST}/dl/6acca6136e979983cdce5a1f` },
            { title: "Episode 76", url: `${STREAM_HOST}/dl/6acca6136e979983cdce5a20` },
            { title: "Episode 77", url: `${STREAM_HOST}/dl/6acca6196e979983cdce5a21` },
            { title: "Episode 78", url: `${STREAM_HOST}/dl/6acca77e6e979983cdce5a3d` },
            { title: "Episode 79", url: `${STREAM_HOST}/dl/6acca77e6e979983cdce5a3c` },
            { title: "Episode 80", url: `${STREAM_HOST}/dl/6acca77e6e979983cdce5a39` },
            { title: "Episode 81", url: `${STREAM_HOST}/dl/6acca77e6e979983cdce5a3a` },
            { title: "Episode 82", url: `${STREAM_HOST}/dl/6acca77e6e979983cdce5a3b` },
            { title: "Episode 83", url: `${STREAM_HOST}/dl/6acca77e6e979983cdce5a38` },
            { title: "Episode 84", url: `${STREAM_HOST}/dl/6acca7866e979983cdce5a40` },
            { title: "Episode 85", url: `${STREAM_HOST}/dl/6acca7866e979983cdce5a3f` },
            { title: "Episode 86", url: `${STREAM_HOST}/dl/6acca7866e979983cdce5a3e` },
            { title: "Episode 87", url: `${STREAM_HOST}/dl/6acca7866e979983cdce5a41` },
            { title: "Episode 88", url: `${STREAM_HOST}/dl/6acca78c6e979983cdce5a42` },
            { title: "Episode 89", url: `${STREAM_HOST}/dl/6acca78c6e979983cdce5a43` },
            { title: "Episode 90", url: `${STREAM_HOST}/dl/6acca7916e979983cdce5a45` },
            { title: "Episode 91", url: `${STREAM_HOST}/dl/6acca7916e979983cdce5a44` },
            { title: "Episode 92", url: `${STREAM_HOST}/dl/6acca7916e979983cdce5a46` },
            { title: "Episode 93", url: `${STREAM_HOST}/dl/6acca7bd6e979983cdce5a47` },
            { title: "Episode 94", url: `${STREAM_HOST}/dl/6acca7bd6e979983cdce5a48` },
            { title: "Episode 95", url: `${STREAM_HOST}/dl/6acca7bd6e979983cdce5a49` },
            { title: "Episode 96", url: `${STREAM_HOST}/dl/6acca7c26e979983cdce5a4a` },
            { title: "Episode 97", url: `${STREAM_HOST}/dl/6acca7c26e979983cdce5a4c` },
            { title: "Episode 98", url: `${STREAM_HOST}/dl/6acca7c26e979983cdce5a4b` },
            { title: "Episode 99", url: `${STREAM_HOST}/dl/6acca1706e979983cdce59a6` },
            { title: "Episode 100", url: `${STREAM_HOST}/dl/6acca1706e979983cdce59a5` },
            { title: "Episode 101", url: `${STREAM_HOST}/dl/6acca1706e979983cdce59a3` },
            { title: "Episode 102", url: `${STREAM_HOST}/dl/6acca1706e979983cdce59a4` },
            { title: "Episode 103", url: `${STREAM_HOST}/dl/6acca1706e979983cdce59a2` },
            { title: "Episode 104", url: `${STREAM_HOST}/dl/6acca1706e979983cdce59a7` },
            { title: "Episode 105", url: `${STREAM_HOST}/dl/6acca1786e979983cdce59a8` },
            { title: "Episode 106", url: `${STREAM_HOST}/dl/6acca1786e979983cdce59a9` },
            { title: "Episode 107", url: `${STREAM_HOST}/dl/6acca1786e979983cdce59aa` },
            { title: "Episode 108", url: `${STREAM_HOST}/dl/6acca1786e979983cdce59ab` },
            { title: "Episode 109", url: `${STREAM_HOST}/dl/6acca17e6e979983cdce59ac` },
            { title: "Episode 110", url: `${STREAM_HOST}/dl/6acca17e6e979983cdce59ad` },
            { title: "Episode 111", url: `${STREAM_HOST}/dl/6acca1836e979983cdce59ae` },
            { title: "Episode 112", url: `${STREAM_HOST}/dl/6acca1836e979983cdce59af` },
            { title: "Episode 113", url: `${STREAM_HOST}/dl/6acca1836e979983cdce59b0` },
            { title: "Episode 114", url: `${STREAM_HOST}/dl/6acca1836e979983cdce59b1` },
            { title: "Episode 115", url: `${STREAM_HOST}/dl/6acca1af6e979983cdce59b2` },
            { title: "Episode 116", url: `${STREAM_HOST}/dl/6acca1af6e979983cdce59b3` },
            { title: "Episode 117", url: `${STREAM_HOST}/dl/6acca1b46e979983cdce59b4` },
            { title: "Episode 118", url: `${STREAM_HOST}/dl/6acca1b46e979983cdce59b5` },
            { title: "Episode 119", url: `${STREAM_HOST}/dl/6acca1ba6e979983cdce59b6` },
            { title: "Episode 120", url: `${STREAM_HOST}/dl/6acca1ba6e979983cdce59b7` },
            { title: "Episode 121", url: `${STREAM_HOST}/dl/6acca1ba6e979983cdce59b8` },
            { title: "Episode 122", url: `${STREAM_HOST}/dl/6acca1bf6e979983cdce59b9` },
            { title: "Episode 123", url: `${STREAM_HOST}/dl/6acca1bf6e979983cdce59ba` },
            { title: "Episode 124", url: `${STREAM_HOST}/dl/6acca1eb6e979983cdce59bb` },
            { title: "Episode 125", url: `${STREAM_HOST}/dl/6acca1eb6e979983cdce59bc` },
            { title: "Episode 126", url: `${STREAM_HOST}/dl/6acca1ec6e979983cdce59bd` },
            { title: "Episode 127", url: `${STREAM_HOST}/dl/6acca1f06e979983cdce59be` },
            { title: "Episode 128", url: `${STREAM_HOST}/dl/6acca1f06e979983cdce59bf` },
            { title: "Episode 129", url: `${STREAM_HOST}/dl/6acca1f06e979983cdce59c0` },
            { title: "Episode 130", url: `${STREAM_HOST}/dl/6acca1f66e979983cdce59c1` },
            { title: "Episode 131", url: `${STREAM_HOST}/dl/6acca1f66e979983cdce59c2` },
            { title: "Episode 132", url: `${STREAM_HOST}/dl/6acca1fa6e979983cdce59c3` },
            { title: "Episode 133", url: `${STREAM_HOST}/dl/6acca1fb6e979983cdce59c4` },
            { title: "Episode 134", url: `${STREAM_HOST}/dl/6acca2276e979983cdce59c5` },
            { title: "Episode 135", url: `${STREAM_HOST}/dl/6acca2276e979983cdce59c6` },
            { title: "Episode 136", url: `${STREAM_HOST}/dl/6acca22d6e979983cdce59c7` },
            { title: "Episode 137", url: `${STREAM_HOST}/dl/6acca22d6e979983cdce59c8` },
            { title: "Episode 138", url: `${STREAM_HOST}/dl/6acca22d6e979983cdce59c9` },
            { title: "Episode 139", url: `${STREAM_HOST}/dl/6acca2336e979983cdce59ca` },
            { title: "Episode 140", url: `${STREAM_HOST}/dl/6acca2336e979983cdce59cb` },
            { title: "Episode 141", url: `${STREAM_HOST}/dl/6acca2386e979983cdce59cc` },
            { title: "Episode 142", url: `${STREAM_HOST}/dl/6acca2386e979983cdce59cd` },
            { title: "Episode 143", url: `${STREAM_HOST}/dl/6acca2396e979983cdce59ce` },
            { title: "Episode 144", url: `${STREAM_HOST}/dl/6acca2636e979983cdce59cf` },
            { title: "Episode 145", url: `${STREAM_HOST}/dl/6acca2636e979983cdce59d0` },
            { title: "Episode 146", url: `${STREAM_HOST}/dl/6acca2686e979983cdce59d1` },
            { title: "Episode 147", url: `${STREAM_HOST}/dl/6acca2686e979983cdce59d2` },
            { title: "Episode 148", url: `${STREAM_HOST}/dl/6acca1786e979983cdce59a9` },
            { title: "Episode 149", url: `${STREAM_HOST}/dl/6acca1786e979983cdce59aa` },
            { title: "Episode 150", url: `${STREAM_HOST}/dl/6acca1786e979983cdce59ab` },
            { title: "Episode 151", url: `${STREAM_HOST}/dl/6acca17e6e979983cdce59ac` },
            { title: "Episode 152", url: `${STREAM_HOST}/dl/6acca17e6e979983cdce59ad` },
            { title: "Episode 153", url: `${STREAM_HOST}/dl/6acca1836e979983cdce59ae` },
            { title: "Episode 154", url: `${STREAM_HOST}/dl/6acca1836e979983cdce59af` },
            { title: "Episode 155", url: `${STREAM_HOST}/dl/6acca1836e979983cdce59b0` },
            { title: "Episode 156", url: `${STREAM_HOST}/dl/6acca1836e979983cdce59b1` },
            { title: "Episode 157", url: `${STREAM_HOST}/dl/6acca1af6e979983cdce59b2` },
            { title: "Episode 158", url: `${STREAM_HOST}/dl/6acca1af6e979983cdce59b3` },
            { title: "Episode 159", url: `${STREAM_HOST}/dl/6acca1b46e979983cdce59b4` },
            { title: "Episode 160", url: `${STREAM_HOST}/dl/6acca1b46e979983cdce59b5` },
            { title: "Episode 161", url: `${STREAM_HOST}/dl/6acca1ba6e979983cdce59b6` },
            { title: "Episode 162", url: `${STREAM_HOST}/dl/6acca1ba6e979983cdce59b7` },
            { title: "Episode 163", url: `${STREAM_HOST}/dl/6acca1ba6e979983cdce59b8` },
            { title: "Episode 164", url: `${STREAM_HOST}/dl/6acca1bf6e979983cdce59b9` },
            { title: "Episode 165", url: `${STREAM_HOST}/dl/6acca1bf6e979983cdce59ba` },
            { title: "Episode 166", url: `${STREAM_HOST}/dl/6acca1eb6e979983cdce59bb` },
            { title: "Episode 167", url: `${STREAM_HOST}/dl/6acca1eb6e979983cdce59bc` },
            { title: "Episode 168", url: `${STREAM_HOST}/dl/6acca1ec6e979983cdce59bd` },
            { title: "Episode 169", url: `${STREAM_HOST}/dl/6acca1f06e979983cdce59be` },
            { title: "Episode 170", url: `${STREAM_HOST}/dl/6acca1f06e979983cdce59bf` },
            { title: "Episode 171", url: `${STREAM_HOST}/dl/6acca1f06e979983cdce59c0` },
            { title: "Episode 172", url: `${STREAM_HOST}/dl/6acca1f66e979983cdce59c1` },
            { title: "Episode 173", url: `${STREAM_HOST}/dl/6acca1f66e979983cdce59c2` },
            { title: "Episode 174", url: `${STREAM_HOST}/dl/6acca1fa6e979983cdce59c3` },
            { title: "Episode 175", url: `${STREAM_HOST}/dl/6acca1fb6e979983cdce59c4` },
            { title: "Episode 176", url: `${STREAM_HOST}/dl/6acca2276e979983cdce59c5` },
            { title: "Episode 177", url: `${STREAM_HOST}/dl/6acca2276e979983cdce59c6` },
            { title: "Episode 178", url: `${STREAM_HOST}/dl/6acca22d6e979983cdce59c7` },
            { title: "Episode 179", url: `${STREAM_HOST}/dl/6acca22d6e979983cdce59c8` },
            { title: "Episode 180", url: `${STREAM_HOST}/dl/6acca22d6e979983cdce59c9` },
            { title: "Episode 181", url: `${STREAM_HOST}/dl/6acca2336e979983cdce59ca` },
            { title: "Episode 182", url: `${STREAM_HOST}/dl/6acca2336e979983cdce59cb` },
            { title: "Episode 183", url: `${STREAM_HOST}/dl/6acca2386e979983cdce59cc` },
            { title: "Episode 184", url: `${STREAM_HOST}/dl/6acca2386e979983cdce59cd` },
            { title: "Episode 185", url: `${STREAM_HOST}/dl/6acca2396e979983cdce59ce` },
            { title: "Episode 186", url: `${STREAM_HOST}/dl/6acca2636e979983cdce59cf` },
            { title: "Episode 187", url: `${STREAM_HOST}/dl/6acca2636e979983cdce59d0` },
            { title: "Episode 188", url: `${STREAM_HOST}/dl/6acca2686e979983cdce59d1` },
            { title: "Episode 189", url: `${STREAM_HOST}/dl/6acca2686e979983cdce59d2` }
        ])
    },
    "jjk_catalog": {
        id: "jjk",
        catalogId: "jjk_catalog",
        name: "Jujutsu Kaisen",
        poster: "https://i.postimg.cc/nz2d2zvt/Jujutsu-Kaisen-DP.jpg",
        background: "https://i.postimg.cc/prBn9LHp/JJK-WP.avif",
        backgroundShape: "Landscape",
        description: "Untuk menyelamatkan rakannya daripada serangan roh terkutuk, Yuji menelan jari milik Raja Kutukan iaitu Ryomen Sukuna, lalu berkongsi badan dengannya. Di bawah bimbingan ahli sihir kuat Satoru Gojo, Yuji menyertai Sekolah Menengah Jujutsu Tokyo untuk mencari dan menelan semua jari Sukuna supaya ancaman itu dapat dihapuskan selama-lamanya.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6acca8136e979983cdce5a4d` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6acca8136e979983cdce5a4e` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6acca8136e979983cdce5a4f` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6acca8136e979983cdce5a50` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6acca8136e979983cdce5a51` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6acca8136e979983cdce5a52` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6acca81b6e979983cdce5a53` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6acca81d6e979983cdce5a54` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6acca81d6e979983cdce5a55` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6acca81d6e979983cdce5a56` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6acca8206e979983cdce5a57` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6acca8206e979983cdce5a58` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6acca8256e979983cdce5a59` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6acca8256e979983cdce5a5a` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6acca83a6e979983cdce5a5b` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6acca83b6e979983cdce5a5c` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6acca83b6e979983cdce5a5d` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6acca83b6e979983cdce5a5e` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6acca8406e979983cdce5a5f` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6acca8406e979983cdce5a60` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6acca8406e979983cdce5a61` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6acca8466e979983cdce5a62` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6acca8466e979983cdce5a63` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6acca8466e979983cdce5a64` }
        ])
    },
    "doraemon_catalog": {
        id: "doraemon",
        catalogId: "doraemon_catalog",
        name: "Doraemon",
        poster: "https://i.postimg.cc/XYbMDSrm/Doraemon.jpg",
        background: "https://i.postimg.cc/DwSHcWYM/Doraemon-WP.jpg",
        backgroundShape: "Landscape",
        description: "Nobita Nobi, seorang murid sekolah rendah yang malas, lemah dalam sukan dan pelajaran, serta sering menjadi mangsa buli oleh rakan sekelasnya, Giant dan Suneo. Menyedari masa depan Nobita yang suram akan menyusahkan keturunannya, cicit Nobita dari abad ke-22 yang bernama Sewashi mengambil keputusan untuk menghantar Doraemon ke masa lalu. Misi utama Doraemon adalah untuk menjaga, membimbing, dan mengubah nasib hidup Nobita supaya menjadi seorang insan yang lebih berjaya. Doraemon dilengkapi dengan Poket Empat Dimensi di perutnya yang menyimpan ribuan gajet dan peralatan canggih dari masa depan. Walau bagaimanapun, hampir setiap episod memaparkan Nobita yang menyalahgunakan gajet tersebut akibat sifat gelojoh atau malasnya, lalu mencetuskan pelbagai masalah lucu sebelum dia akhirnya mempelajari pengajaran hidup yang berharga.",
        episodes: createEpisodes([
            "https://files.catbox.moe/oycp0l.mp4", "https://files.catbox.moe/y2jnzp.mp4", "https://files.catbox.moe/0rhjn1.mp4", "https://files.catbox.moe/j5bb72.mp4", "https://files.catbox.moe/tx56z3.mp4",
            "https://files.catbox.moe/d999bc.mp4", "https://files.catbox.moe/9oagow.mp4", "https://files.catbox.moe/c88t2y.mp4", "https://files.catbox.moe/s0w4l2.mp4", "https://files.catbox.moe/9z3g6p.mp4",
            "https://files.catbox.moe/w2rqxc.mp4", "https://files.catbox.moe/0ye5xj.mp4", "https://files.catbox.moe/p43ryb.mp4", "https://files.catbox.moe/4v3zun.mp4", "https://files.catbox.moe/k6jxyt.mp4",
            "https://files.catbox.moe/8rbre5.mp4", "https://files.catbox.moe/mhs0nv.mp4", "https://files.catbox.moe/5h1ezm.mp4", "https://files.catbox.moe/htqy6e.mp4", "https://files.catbox.moe/lea2x8.mp4",
            "https://files.catbox.moe/r42hc2.mp4", "https://files.catbox.moe/vkeb1q.mp4", "https://files.catbox.moe/4mcmx3.mp4", "https://files.catbox.moe/cunbqt.mp4", "https://files.catbox.moe/qxylix.mp4",
            "https://files.catbox.moe/re0c0z.mp4", "https://files.catbox.moe/ks1u8n.mp4", "https://files.catbox.moe/79zs6n.mp4", "https://files.catbox.moe/c6zn2u.mp4", "https://files.catbox.moe/ytnekv.mp4",
            "https://files.catbox.moe/vatbmf.mp4", "https://files.catbox.moe/5ot9pd.mp4", "https://files.catbox.moe/8hetcy.mp4", "https://files.catbox.moe/zl3nzc.mp4", "https://files.catbox.moe/7bhl4b.mp4",
            "https://files.catbox.moe/336km9.mp4", "https://files.catbox.moe/gz6zd1.mp4", "https://files.catbox.moe/ti97x3.mp4", "https://files.catbox.moe/gz9nzk.mp4", "https://files.catbox.moe/7as2xt.mp4",
            "https://files.catbox.moe/lur6di.mp4", "https://files.catbox.moe/y6cidm.mp4", "https://files.catbox.moe/40q9mb.mp4", "https://files.catbox.moe/14uoer.mp4", "https://files.catbox.moe/tnu1yq.mp4",
            "https://files.catbox.moe/jqn9l7.mp4", "https://files.catbox.moe/75bfy0.mp4", "https://files.catbox.moe/mpwbnh.mp4", "https://files.catbox.moe/2sjant.mp4", "https://files.catbox.moe/khkto1.mp4",
            "https://files.catbox.moe/r0w4yb.mp4", "https://files.catbox.moe/25qjxr.mp4", "https://files.catbox.moe/z81zu8.mp4", "https://files.catbox.moe/22zj5h.mp4", "https://files.catbox.moe/prdrno.mp4",
            "https://files.catbox.moe/c81md0.mp4", "https://files.catbox.moe/hkiu08.mp4", "https://files.catbox.moe/f0uzr4.mp4", "https://files.catbox.moe/a1cqxl.mp4",
        ])
    },
    "pokemon_catalog": {
        id: "pokemon_journeys",
        catalogId: "pokemon_catalog",
        name: "Pokemon Journeys The Series",
        poster: "https://i.postimg.cc/Ls9SCKJX/Pokemon.jpg",
        background: "https://i.postimg.cc/nhXg1swT/Pokemon-Journey-WP.jpg",
        backgroundShape: "Landscape",
        description: "Dengan impian Ash yang membara untuk bergelar Pokémon Master, serta misi Goh untuk menangkap setiap jenis Pokémon yang ada (termasuk Pokémon Mitos, Mew), kedua-dua wira ini memulakan pengembaraan yang penuh aksi dan keterujaan merentasi dunia Pokémon yang amat luas.",
        episodes: createEpisodes([
            "https://files.catbox.moe/9l6811.mp4", "https://files.catbox.moe/f2adj4.mp4", "https://files.catbox.moe/bnoev9.mp4", "https://files.catbox.moe/64ntqo.mp4", "https://files.catbox.moe/83f07d.mp4",
            "https://files.catbox.moe/17e2tr.mp4", "https://files.catbox.moe/5y14uj.mp4", "https://files.catbox.moe/poz7od.mp4", "https://files.catbox.moe/y46f9t.mp4", "https://files.catbox.moe/grq2iu.mp4",
            "https://files.catbox.moe/k773ev.mp4", "https://files.catbox.moe/r5rda8.mp4", "https://files.catbox.moe/8idngm.mp4", "https://files.catbox.moe/8fz354.mp4", "https://files.catbox.moe/tzcx7q.mp4",
            "https://files.catbox.moe/o1beae.mp4", "https://files.catbox.moe/uyhug0.mp4", "https://files.catbox.moe/5f9hjn.mp4", "https://files.catbox.moe/ou8sgf.mp4", "https://files.catbox.moe/63xw8p.mp4",
            "https://files.catbox.moe/r69vzr.mp4", "https://files.catbox.moe/29y1ey.mp4", "https://files.catbox.moe/q258dj.mp4", "https://files.catbox.moe/7lyrdj.mp4", "https://files.catbox.moe/eiy4gx.mp4",
            "https://files.catbox.moe/utrujc.mp4", "https://files.catbox.moe/f40v16.mp4", "https://files.catbox.moe/9p1oo4.mp4", "https://files.catbox.moe/vw842q.mp4", "https://files.catbox.moe/43p2fg.mp4",
            "https://files.catbox.moe/odqedh.mp4", "https://files.catbox.moe/iaxi6v.mp4", "https://files.catbox.moe/k27hgg.mp4", "https://files.catbox.moe/umbpcj.mp4", "https://files.catbox.moe/6gn6ci.mp4",
            "https://files.catbox.moe/brro9o.mp4", "https://files.catbox.moe/0pn8a9.mp4", "https://files.catbox.moe/6qs7l7.mp4", "https://files.catbox.moe/iljl67.mp4", "https://files.catbox.moe/o1welq.mp4",
            "https://files.catbox.moe/1qf2bs.mp4", "https://files.catbox.moe/6432zl.mp4"
        ])
    },
    "midori_days_catalog": {
        id: "midori_days",
        catalogId: "midori_days_catalog",
        name: "Midori Days",
        poster: "https://i.postimg.cc/P5zgg3D9/Midori-Days.jpg",
        background: "https://i.postimg.cc/wj1ZktbV/Midori-Days-WP.jpg",
        backgroundShape: "Landscape",
        description: "Seiji is a tough street fighter known as Mad Dog who has been rejected by 20 girls. After venting that he might as well settle for his right hand, he wakes up to find Midori—a shy girl who secretly loved him for three years—living as his right hand while her real body lies in a coma.",
        episodes: createEpisodes([
            "https://files.catbox.moe/17w3pa.mp4", "https://files.catbox.moe/k27qz0.mp4", "https://files.catbox.moe/17jqa4.mp4", "https://files.catbox.moe/yezp6w.mp4", "https://files.catbox.moe/a5bwab.mp4",
            "https://files.catbox.moe/l6no0r.mp4", "https://files.catbox.moe/lelg7u.mp4", "https://files.catbox.moe/au9rr9.mp4", "https://files.catbox.moe/kfta82.mp4", "https://files.catbox.moe/7iisgo.mp4",
            "https://files.catbox.moe/7c9042.mp4", "https://files.catbox.moe/o2mmz3.mp4", "https://files.catbox.moe/8wepsr.mp4"
        ])
    },
    "anak_sidek_catalog": {
        id: "anak_anak_sidek",
        catalogId: "anak_sidek_catalog",
        name: "Anak-Anak Sidek",
        poster: "https://i.postimg.cc/25kYcR11/Anak-Anak-Sidek.jpg",
        background: "https://i.postimg.cc/TY7BmjQV/Anak-Anak-Sidek-WP.jpg",
        backgroundShape: "Landscape",
        description: "Siri ini memaparkan didikan disiplin serta ketegasan Haji Sidek Abdullah Kamar dalam melatih anak-anaknya di gelanggang badminton rumah mereka sebelum mereka membesar menjadi jaguh dan legenda badminton negara. Ia juga menyelitkan kisah peribadi dan suka-duka keluarga ini yang jarang diketahui umum.",
        episodes: createEpisodes([
            "https://files.catbox.moe/0ts7am.mp4", "https://files.catbox.moe/lpswls.mp4", "https://files.catbox.moe/lbmnel.mp4", "https://files.catbox.moe/eligd9.mp4", "https://files.catbox.moe/khs41p.mp4",
            "https://files.catbox.moe/26c3re.mp4", "https://files.catbox.moe/b16149.mp4", "https://files.catbox.moe/mxe2nn.mp4", "https://files.catbox.moe/s1ayej.mp4", "https://files.catbox.moe/32z6i6.mp4",
            "https://files.catbox.moe/f8pnpd.mp4", "https://files.catbox.moe/86iy1e.mp4", "https://files.catbox.moe/ttqlp9.mp4", "https://files.catbox.moe/q9dr60.mp4", "https://files.catbox.moe/of0qnd.mp4",
            "https://files.catbox.moe/cedu56.mp4", "https://files.catbox.moe/xdskm8.mp4", "https://files.catbox.moe/9mzf1z.mp4", "https://files.catbox.moe/lsz3p9.mp4", "https://files.catbox.moe/3mxx6i.mp4",
            "https://files.catbox.moe/jkjj9o.mp4", "https://files.catbox.moe/wdgv93.mp4", "https://files.catbox.moe/qf2fvl.mp4", "https://files.catbox.moe/jvfta3.mp4", "https://files.catbox.moe/q40kmo.mp4",
            "https://files.catbox.moe/t6tkl7.mp4", "https://files.catbox.moe/7hj0pp.mp4", "https://files.catbox.moe/2cvkol.mp4", "https://files.catbox.moe/x6d6l2.mp4", "https://files.catbox.moe/em16n2.mp4",
            "https://files.catbox.moe/kfx8fa.mp4", "https://files.catbox.moe/psqwmg.mp4", "https://files.catbox.moe/qhhlph.mp4", "https://files.catbox.moe/4yre1a.mp4", "https://files.catbox.moe/xmphie.mp4",
            "https://files.catbox.moe/uwyuaa.mp4", "https://files.catbox.moe/xzp99z.mp4", "https://files.catbox.moe/gw2t8k.mp4", "https://files.catbox.moe/farxtu.mp4", "https://files.catbox.moe/ndsb34.mp4",
            "https://files.catbox.moe/8p480z.mp4", "https://files.catbox.moe/2by4hx.mp4", "https://files.catbox.moe/r1443c.mp4"
        ])
    },
    "ueki_catalog": {
        id: "ueki",
        catalogId: "ueki_catalog",
        name: "The Law of Ueki",
        poster: "https://i.postimg.cc/Sx7BBT9v/The-Law-Of-Ueki.jpg",
        background: "https://i.postimg.cc/ZK7X3Pjc/TLOU-WP.webp",
        backgroundShape: "Landscape",
        description: "Kosuke Ueki, a kind-hearted 8th grader from Hinokuni Junior High School, is chosen by his teacher Mr. Kobayashi (Koba-sen). He is given the ability to turn trash into trees and control them. If a power user hurts an ordinary human, they lose one of their natural talents. Ueki fights to keep the Blank Talent out of the hands of greedy competitors.",
        episodes: createEpisodes([
            "https://files.catbox.moe/8kj5ks.mp4", "https://files.catbox.moe/z0g9yg.mp4", "https://files.catbox.moe/08sesz.mp4", "https://files.catbox.moe/6md76n.mp4", "https://files.catbox.moe/807ppt.mp4",
            "https://files.catbox.moe/p97pyk.mp4", "https://files.catbox.moe/u4xc7f.mp4", "https://files.catbox.moe/t6cqgz.mp4", "https://files.catbox.moe/ccd8xy.mp4", "https://files.catbox.moe/00umfq.mp4",
            "https://files.catbox.moe/4jqaxr.mp4", "https://files.catbox.moe/f2fu7v.mp4", "https://files.catbox.moe/3hqo5h.mp4", "https://files.catbox.moe/k5rsv8.mp4", "https://files.catbox.moe/a52eaw.mp4",
            "https://files.catbox.moe/92vn6m.mp4", "https://files.catbox.moe/lc4ggf.mp4", "https://files.catbox.moe/g7z0qd.mp4", "https://files.catbox.moe/1cu6nb.mp4", "https://files.catbox.moe/simne6.mp4",
            "https://files.catbox.moe/qsd9d6.mp4", "https://files.catbox.moe/bvqz25.mp4", "https://files.catbox.moe/lz4f81.mp4", "https://files.catbox.moe/cxdp53.mp4", "https://files.catbox.moe/42fp1m.mp4",
            "https://files.catbox.moe/0cct4v.mp4", "https://files.catbox.moe/tq28dt.mp4", "https://files.catbox.moe/4644lf.MP4", "https://files.catbox.moe/220ni1.MP4", "https://files.catbox.moe/yr03al.MP4",
            "https://files.catbox.moe/1owo27.MP4", "https://files.catbox.moe/5p84az.MP4", "https://files.catbox.moe/xwp7g4.MP4", "https://files.catbox.moe/nq68ze.MP4", "https://files.catbox.moe/5iklua.MP4",
            "https://files.catbox.moe/4n3ctq.MP4", "https://files.catbox.moe/82q9a5.MP4", "https://files.catbox.moe/2sl6it.MP4", "https://files.catbox.moe/1o0vhh.MP4", "https://files.catbox.moe/9wxs8p.MP4",
            "https://files.catbox.moe/bwk5nr.MP4", "https://files.catbox.moe/rf1i5n.MP4", "https://files.catbox.moe/a8wyuy.MP4", "https://files.catbox.moe/lwe17r.MP4", "https://files.catbox.moe/kno50g.MP4",
            "https://files.catbox.moe/3x4ddf.MP4", "https://files.catbox.moe/iiksmp.MP4", "https://files.catbox.moe/qa4dc0.MP4", "https://files.catbox.moe/ayw9r7.MP4", "https://files.catbox.moe/z2903v.MP4",
            "https://files.catbox.moe/wb03ng.MP4"
        ])
    },
    "tomjerry_catalog": {
        id: "tomjerry",
        catalogId: "tomjerry_catalog",
        name: "Tom & Jerry",
        poster: "https://i.postimg.cc/Gm5JwFbK/Tom-And-Jerry.jpg",
        background: "https://i.postimg.cc/pXG38Qkp/Tom-Jerry-WP.jpg",
        backgroundShape: "Landscape",
        description: "Kisah mereka dipenuhi dengan aksi kejar-mengejar yang ekstrem, letupan, dan perangkap kreatif, namun kedua-dua watak tidak pernah mengalami kecederaan kekal.",
        episodes: createEpisodes([
            { title: "Fine Feathered Friend", url: `${STREAM_HOST}/dl/6accc4506e979983cdce5ad0` },
            { title: "Sufferin' Cats!", url: `${STREAM_HOST}/dl/6accc4506e979983cdce5ad1` },
            { title: "The Lonesome Mouse", url: `${STREAM_HOST}/dl/6accc4506e979983cdce5ad2` },
            { title: "The Zoot Cat", url: `${STREAM_HOST}/dl/6accc45b6e979983cdce5ad5` },
            { title: "The Million Dollar Cat", url: `${STREAM_HOST}/dl/6accc45c6e979983cdce5ad6` },
            { title: "The Bodyguard", url: `${STREAM_HOST}/dl/6accc45c6e979983cdce5ad7` },
            { title: "Puttin' On The Dog", url: `${STREAM_HOST}/dl/6accc4876e979983cdce5ad8` },
            { title: "Mouse Trouble", url: `${STREAM_HOST}/dl/6accc48d6e979983cdce5ad9` },
            { title: "Mouse In Manhattan", url: `${STREAM_HOST}/dl/6accc48e6e979983cdce5ada` },
            { title: "Tee For Two", url: `${STREAM_HOST}/dl/6accc48f6e979983cdce5adb` },
            { title: "The Mouse Comes To Dinner", url: `${STREAM_HOST}/dl/6accc48f6e979983cdce5adc` },
            { title: "Flirty Birdy", url: `${STREAM_HOST}/dl/6accc4926e979983cdce5add` },
            { title: "Quiet Please!", url: `${STREAM_HOST}/dl/6accc4926e979983cdce5ade` },
            { title: "Springtime For Thomas", url: `${STREAM_HOST}/dl/6accc4936e979983cdce5adf` },
            { title: "The Milky Waif", url: `${STREAM_HOST}/dl/6accc4986e979983cdce5ae0` },
            { title: "Trap Happy", url: `${STREAM_HOST}/dl/6accc4c36e979983cdce5ae1` },
            { title: "Solid Serenade", url: `${STREAM_HOST}/dl/6accc4c36e979983cdce5ae2` },
            { title: "Cat Fishin'", url: `${STREAM_HOST}/dl/6accc4c86e979983cdce5ae3` },
            { title: "Part Time Pal", url: `${STREAM_HOST}/dl/6accc4cd6e979983cdce5ae4` },
            { title: "The Cat Concerto", url: `${STREAM_HOST}/dl/6accc4cd6e979983cdce5ae5` },
            { title: "Dr Jekyll and Mr Mouse", url: `${STREAM_HOST}/dl/6accc4cd6e979983cdce5ae6` },
            { title: "Salt Water Tabby", url: `${STREAM_HOST}/dl/6accc4cd6e979983cdce5ae7` },
            { title: "A Mouse In The House", url: `${STREAM_HOST}/dl/6accc4cf6e979983cdce5ae8` },
            { title: "The Invisible Mouse", url: `${STREAM_HOST}/dl/6accc4d36e979983cdce5ae9` },
            { title: "Kitty Foiled", url: `${STREAM_HOST}/dl/6accc4d96e979983cdce5aea` },
            { title: "The Truce Hurts", url: `${STREAM_HOST}/dl/6accc4d96e979983cdce5aeb` },
            { title: "Old Rockin' Chair Tom", url: `${STREAM_HOST}/dl/6accc5036e979983cdce5aec` },
            { title: "Professor Tom", url: `${STREAM_HOST}/dl/6accc5056e979983cdce5aed` },
            { title: "Mouse Cleaning", url: `${STREAM_HOST}/dl/6accc5056e979983cdce5aee` },
            { title: "Polka Dot Puss", url: `${STREAM_HOST}/dl/6accc5056e979983cdce5aef` },
            { title: "The Little Orphan", url: `${STREAM_HOST}/dl/6accc5096e979983cdce5af0` },
            { title: "Hatch Up Your Troubles", url: `${STREAM_HOST}/dl/6accc50a6e979983cdce5af1` },
            { title: "Heavenly Puss", url: `${STREAM_HOST}/dl/6accc50e6e979983cdce5af2` },
            { title: "The Cat And The Mermouse", url: `${STREAM_HOST}/dl/6accc50e6e979983cdce5af3` },
            { title: "Love That Pup", url: `${STREAM_HOST}/dl/6accc5136e979983cdce5af4` },
            { title: "Jerry's Diary", url: `${STREAM_HOST}/dl/6accc5136e979983cdce5af5` },
            { title: "Tennis Chumps", url: `${STREAM_HOST}/dl/6accc53b6e979983cdce5af6` },
            { title: "Little Quacker", url: `${STREAM_HOST}/dl/6accc53c6e979983cdce5af7` },
            { title: "Saturday Evening Puss", url: `${STREAM_HOST}/dl/6accc5406e979983cdce5af8` },
            { title: "Texas Tom", url: `${STREAM_HOST}/dl/6accc5406e979983cdce5af9` },
            { title: "Safety Second", url: `${STREAM_HOST}/dl/6accc5416e979983cdce5afa` },
            { title: "Jerry And The Lion", url: `${STREAM_HOST}/dl/6accc5416e979983cdce5afb` },
            { title: "The Hollywood Bowl", url: `${STREAM_HOST}/dl/6accc5466e979983cdce5afc` },
            { title: "The Framed Cat", url: `${STREAM_HOST}/dl/6accc5466e979983cdce5afd` },
            { title: "Cue Ball Cat", url: `${STREAM_HOST}/dl/6accc54b6e979983cdce5afe` },
            { title: "Casanova Cat", url: `${STREAM_HOST}/dl/6accc54c6e979983cdce5aff` },
            { title: "Jerry And The Goldfish", url: `${STREAM_HOST}/dl/6accc5776e979983cdce5b00` },
            { title: "Jerry's Cousin", url: `${STREAM_HOST}/dl/6accc5776e979983cdce5b01` },
            { title: "His Mouse Friday", url: `${STREAM_HOST}/dl/6accc57c6e979983cdce5b02` },
            { title: "Sleepy Time Tom", url: `${STREAM_HOST}/dl/6accc57c6e979983cdce5b03` },
            { title: "Slicked Up Pup", url: `${STREAM_HOST}/dl/6accc57c6e979983cdce5b04` },
            { title: "Nit Witty Kitty", url: `${STREAM_HOST}/dl/6accc5826e979983cdce5b05` },
            { title: "Cat Napping", url: `${STREAM_HOST}/dl/6accc5826e979983cdce5b06` },
            { title: "The Flying Cat", url: `${STREAM_HOST}/dl/6accc5876e979983cdce5b07` },
            { title: "The Duck Doctor", url: `${STREAM_HOST}/dl/6accc5876e979983cdce5b08` },
            { title: "The Two Mouseketeers", url: `${STREAM_HOST}/dl/6accc5876e979983cdce5b09` },
            { title: "Smitten Kitten", url: `${STREAM_HOST}/dl/6accc5876e979983cdce5b0a` },
            { title: "Triplet Trouble", url: `${STREAM_HOST}/dl/6accc5b86e979983cdce5b0b` },
            { title: "Little Runaway", url: `${STREAM_HOST}/dl/6accc5b96e979983cdce5b0c` },
            { title: "Fit To Be Tied", url: `${STREAM_HOST}/dl/6accc5b96e979983cdce5b0d` },
            { title: "Hic cup Pup", url: `${STREAM_HOST}/dl/6accc6006e979983cdce5b1a` },
            { title: "Touché, Pussy Cat!", url: `${STREAM_HOST}/dl/6accc6376e979983cdce5b21` },
            { title: "Designs On Jerry", url: `${STREAM_HOST}/dl/6accc63d6e979983cdce5b25` },
            { title: "Tom And Chérie", url: `${STREAM_HOST}/dl/6accc6426e979983cdce5b26` },
            { title: "Pecos Pest", url: `${STREAM_HOST}/dl/6accc66d6e979983cdce5b28` },
            { title: "That's My Mommy", url: `${STREAM_HOST}/dl/6accc66d6e979983cdce5b29` },
            { title: "The Flying Sorceress", url: `${STREAM_HOST}/dl/6accc66e6e979983cdce5b2a` },
            { title: "The Egg And Jerry", url: `${STREAM_HOST}/dl/6accc6726e979983cdce5b2b` },
            { title: "Busy Buddies", url: `${STREAM_HOST}/dl/6accc6736e979983cdce5b2c` },
            { title: "Muscle Beach Tom", url: `${STREAM_HOST}/dl/6accc6786e979983cdce5b2d` },
            { title: "Down Beat Bear", url: `${STREAM_HOST}/dl/6accc6786e979983cdce5b2e` },
            { title: "Blue Cat Blues", url: `${STREAM_HOST}/dl/6accc6786e979983cdce5b2f` },
            { title: "Barbecue Brawl", url: `${STREAM_HOST}/dl/6accc67e6e979983cdce5b30` },
            { title: "Tops With Pops", url: `${STREAM_HOST}/dl/6accc6a96e979983cdce5b31` },
            { title: "Timid Tabby", url: `${STREAM_HOST}/dl/6accc6ae6e979983cdce5b32` },
            { title: "Feedin' The Kiddie", url: `${STREAM_HOST}/dl/6accc6af6e979983cdce5b33` },
            { title: "Mucho Mouse", url: `${STREAM_HOST}/dl/6accc6af6e979983cdce5b34` },
            { title: "Tom's Photo Finish", url: `${STREAM_HOST}/dl/6accc6af6e979983cdce5b35` },
            { title: "Happy Go Ducky", url: `${STREAM_HOST}/dl/6accc6b56e979983cdce5b36` },
            { title: "Royal Cat Nap", url: `${STREAM_HOST}/dl/6accc6b56e979983cdce5b37` },
            { title: "The Vanishing Duck", url: `${STREAM_HOST}/dl/6accc6ba6e979983cdce5b38` },
            { title: "Robin Hoodwinked", url: `${STREAM_HOST}/dl/6accc6bb6e979983cdce5b39` },
            { title: "Tot Watchers", url: `${STREAM_HOST}/dl/6accc6bb6e979983cdce5b3a` },
            { title: "Switchin' Kitten", url: `${STREAM_HOST}/dl/6accc6e66e979983cdce5b3b` },
            { title: "Down and Outing", url: `${STREAM_HOST}/dl/6accc6ea6e979983cdce5b3c` },
            { title: "It's Greek to Me Ow!", url: `${STREAM_HOST}/dl/6accc6ea6e979983cdce5b3d` },
            { title: "High Steaks", url: `${STREAM_HOST}/dl/6accc6ea6e979983cdce5b3e` },
            { title: "Mouse into Space", url: `${STREAM_HOST}/dl/6accc6eb6e979983cdce5b3f` },
            { title: "Landing Stripling", url: `${STREAM_HOST}/dl/6accc6eb6e979983cdce5b40` },
            { title: "Calypso Cat", url: `${STREAM_HOST}/dl/6accc6f06e979983cdce5b41` },
            { title: "Dicky Moe", url: `${STREAM_HOST}/dl/6accc6f56e979983cdce5b42` },
            { title: "The Tom and Jerry Cartoon Kit", url: `${STREAM_HOST}/dl/6accc6f66e979983cdce5b43` },
            { title: "Tall in the Trap", url: `${STREAM_HOST}/dl/6accc6f66e979983cdce5b44` },
            { title: "Sorry Safari", url: `${STREAM_HOST}/dl/6accc7226e979983cdce5b45` },
            { title: "Buddies Thicker Than Water", url: `${STREAM_HOST}/dl/6accc7266e979983cdce5b46` },
            { title: "Carmen Get It!", url: `${STREAM_HOST}/dl/6accc7266e979983cdce5b47` },
            { title: "Pent House Mouse", url: `${STREAM_HOST}/dl/6accc7276e979983cdce5b48` },
            { title: "The Cat Above and the Mouse Below", url: `${STREAM_HOST}/dl/6accc7286e979983cdce5b49` },
            { title: "Is There a Doctor in the Mouse？", url: `${STREAM_HOST}/dl/6accc72b6e979983cdce5b4a` },
            { title: "Much Ado About Mousing", url: `${STREAM_HOST}/dl/6accc72c6e979983cdce5b4b` },
            { title: "Snowbody Loves Me", url: `${STREAM_HOST}/dl/6accc72d6e979983cdce5b4c` },
            { title: "The Unshrinkable Jerry Mouse", url: `${STREAM_HOST}/dl/6accc7316e979983cdce5b4d` },
            { title: "Ah, Sweet Mouse Story of Life", url: `${STREAM_HOST}/dl/6accc7316e979983cdce5b4e` },
            { title: "Tom ic Energy", url: `${STREAM_HOST}/dl/6accc7366e979983cdce5b4f` },
            { title: "Bad Day at Cat Rock", url: `${STREAM_HOST}/dl/6accc7366e979983cdce5b50` },
            { title: "The Brothers Carry Mouse Off", url: `${STREAM_HOST}/dl/6accc7626e979983cdce5b51` },
            { title: "Haunted Mouse", url: `${STREAM_HOST}/dl/6accc7636e979983cdce5b52` },
            { title: "I'm Just Wild About Jerry", url: `${STREAM_HOST}/dl/6accc7686e979983cdce5b53` },
            { title: "Of Feline Bondage", url: `${STREAM_HOST}/dl/6accc7696e979983cdce5b54` },
            { title: "The Year of the Mouse", url: `${STREAM_HOST}/dl/6accc76d6e979983cdce5b55` },
            { title: "The Cat's Me Ouch", url: `${STREAM_HOST}/dl/6accc76d6e979983cdce5b56` },
            { title: "Duel Personality", url: `${STREAM_HOST}/dl/6accc76d6e979983cdce5b57` },
            { title: "Jerry, Jerry, Quite Contrary", url: `${STREAM_HOST}/dl/6accc76e6e979983cdce5b58` },
            { title: "Jerry Go Round", url: `${STREAM_HOST}/dl/6accc7726e979983cdce5b59` },
            { title: "Love Me, Love My Mouse", url: `${STREAM_HOST}/dl/6accc79a6e979983cdce5b5a` },
            { title: "Puss 'N' Boats", url: `${STREAM_HOST}/dl/6accc79b6e979983cdce5b5b` },
            { title: "Filet Meow", url: `${STREAM_HOST}/dl/6accc7a16e979983cdce5b5c` },
            { title: "Matinee Mouse", url: `${STREAM_HOST}/dl/6accc7a16e979983cdce5b5d` },
            { title: "The A TOM iNABLE Snowman", url: `${STREAM_HOST}/dl/6accc7a26e979983cdce5b5e` },
            { title: "Catty Cornered", url: `${STREAM_HOST}/dl/6accc7a66e979983cdce5b5f` },
            { title: "Cat and Dupli Cat", url: `${STREAM_HOST}/dl/6accc7a66e979983cdce5b60` },
            { title: "O Solar Meow", url: `${STREAM_HOST}/dl/6accc7a66e979983cdce5b61` },
            { title: "Guided Mouse ille", url: `${STREAM_HOST}/dl/6accc7ac6e979983cdce5b62` },
            { title: "Rock 'N' Rodent", url: `${STREAM_HOST}/dl/6accc7d66e979983cdce5b63` },
            { title: "Cannery Rodent", url: `${STREAM_HOST}/dl/6accc7dc6e979983cdce5b64` },
            { title: "The Mouse from H.U.N.G.E.R.", url: `${STREAM_HOST}/dl/6accc7dd6e979983cdce5b65` },
            { title: "Surf Bored Cat", url: `${STREAM_HOST}/dl/6accc7dd6e979983cdce5b66` },
            { title: "Advance and Be Mechanized", url: `${STREAM_HOST}/dl/6accc7e16e979983cdce5b67` },
            { title: "Shutter Bugged Cat", url: `${STREAM_HOST}/dl/6accc7e16e979983cdce5b68` },
            { title: "The Flying Sorceress [1975]", url: `${STREAM_HOST}/dl/6acccc206e979983cdce5c1c` },
            { title: "Termites Plus Two [1975]", url: `${STREAM_HOST}/dl/6acccc266e979983cdce5c1d` },
            { title: "The Kitten Sitters [1975]", url: `${STREAM_HOST}/dl/6acccc266e979983cdce5c1e` },
            { title: "Planet Pest [1975]", url: `${STREAM_HOST}/dl/6acccc2c6e979983cdce5c1f` },
            { title: "Give Em The Air [1975]", url: `${STREAM_HOST}/dl/6acccc2c6e979983cdce5c21` },
            { title: "The Egg And Tom And Jerry [1975]", url: `${STREAM_HOST}/dl/6acccc5e6e979983cdce5c22` },
            { title: "Watch Out Watch Dog [1975]", url: `${STREAM_HOST}/dl/6acccc5e6e979983cdce5c23` },
            { title: "The Super Cyclists [1975]", url: `${STREAM_HOST}/dl/6acccc646e979983cdce5c24` },
            { title: "The Police Kitten [1975]", url: `${STREAM_HOST}/dl/6acccc646e979983cdce5c25` },
            { title: "The Outfoxed Fox [1975]", url: `${STREAM_HOST}/dl/6acccc656e979983cdce5c26` },
            { title: "Towering Fiasco [1975]", url: `${STREAM_HOST}/dl/6acccc696e979983cdce5c27` },
            { title: "The Lost Duckling [1975]", url: `${STREAM_HOST}/dl/6acccc696e979983cdce5c28` },
            { title: "Beanstalk Buddies [1975]", url: `${STREAM_HOST}/dl/6acccc6e6e979983cdce5c29` },
            { title: "Two Stars Are Born [1975]", url: `${STREAM_HOST}/dl/6acccc6e6e979983cdce5c2a` },
            { title: "Son Of Gopher Broke [1975]", url: `${STREAM_HOST}/dl/6acccc6e6e979983cdce5c2b` },
            { title: "The Sorcerers Apprentices [1975]", url: `${STREAM_HOST}/dl/6acccc6f6e979983cdce5c2c` },
            { title: "Hold That Pose [1975]", url: `${STREAM_HOST}/dl/6acccc9e6e979983cdce5c2d` },
            { title: "The Supercape Caper [1975]", url: `${STREAM_HOST}/dl/6acccca06e979983cdce5c2e` },
            { title: "Chickenrella [1975]", url: `${STREAM_HOST}/dl/6acccca36e979983cdce5c2f` },
            { title: "Double Trouble Crow [1975]", url: `${STREAM_HOST}/dl/6acccca36e979983cdce5c30` },
            { title: "Jerrys Nephew [1975]", url: `${STREAM_HOST}/dl/6acccca56e979983cdce5c31` },
            { title: "The Campout Cutup [1975]", url: `${STREAM_HOST}/dl/6accccae6e979983cdce5c34` },
            { title: "The Bull Fighters [1975]", url: `${STREAM_HOST}/dl/6accccd66e979983cdce5c36` },
            { title: "Cruise Kitty [1975]", url: `${STREAM_HOST}/dl/6accccd66e979983cdce5c37` },
            { title: "Calaboose Cal 495 [1990]", url: `${STREAM_HOST}/dl/6accced96e979983cdce5c8a` },
            { title: "Jerry Hood & Merry Meeces [1990]", url: `${STREAM_HOST}/dl/6acccede6e979983cdce5c8c` },
            { title: "The Planet Dogmania [1991]", url: `${STREAM_HOST}/dl/6acccee36e979983cdce5c8d` },
            { title: "Catawumpus Cat [1991]", url: `${STREAM_HOST}/dl/6acccee36e979983cdce5c8e` },
            { title: "Pest In The West [1991]", url: `${STREAM_HOST}/dl/6acccee36e979983cdce5c8f` },
            { title: "Tom The Babysitter [1991]", url: `${STREAM_HOST}/dl/6acccf0f6e979983cdce5c90` },
            { title: "Gas Blaster Puss [1991]", url: `${STREAM_HOST}/dl/6acccf0f6e979983cdce5c91` },
            { title: "Mess Hall Mouser [1991]", url: `${STREAM_HOST}/dl/6acccf0f6e979983cdce5c92` },
            { title: "Tolivers Twist [1991]", url: `${STREAM_HOST}/dl/6acccf156e979983cdce5c93` },
            { title: "Krazy Klaws [1991]", url: `${STREAM_HOST}/dl/6acccf156e979983cdce5c94` },
            { title: "Tom Thumped [1993]", url: `${STREAM_HOST}/dl/6acccf1b6e979983cdce5c95` },
            { title: "Cheap Skates [1993]", url: `${STREAM_HOST}/dl/6acccf1b6e979983cdce5c96` },
            { title: "When Knights Were Cold [1993]", url: `${STREAM_HOST}/dl/6acccf206e979983cdce5c97` },
            { title: "Cat Counselor Cal [1993]", url: `${STREAM_HOST}/dl/6acccf216e979983cdce5c98` },
            { title: "Hillbilly Hootenanny [1993]", url: `${STREAM_HOST}/dl/6acccf4b6e979983cdce5c99` },
            { title: "Hawkeye Tom [1993]", url: `${STREAM_HOST}/dl/6acccf4c6e979983cdce5c9a` },
            { title: "No Tom Like The Present [1993]", url: `${STREAM_HOST}/dl/6acccf4c6e979983cdce5c9b` },
            { title: "Two Stepping Tom [1993]", url: `${STREAM_HOST}/dl/6acccf4c6e979983cdce5c9c` },
            { title: "Disc Temper [1993]", url: `${STREAM_HOST}/dl/6acccf526e979983cdce5c9d` },
            { title: "King Wildmouse [1993]", url: `${STREAM_HOST}/dl/6acccf576e979983cdce5c9e` },
            { title: "Space Chase [1993]", url: `${STREAM_HOST}/dl/6acccf576e979983cdce5c9f` },
            { title: "The Karate Guard [2005]", url: `${STREAM_HOST}/dl/6acccf586e979983cdce5ca0` },
            { title: "Bats What I Like About [2006]", url: `${STREAM_HOST}/dl/6acccf5d6e979983cdce5ca1` },
            { title: "Cat Got Your Luggage [2006]", url: `${STREAM_HOST}/dl/6acccf5d6e979983cdce5ca2` },
            { title: "City Dump Chumps [2006]", url: `${STREAM_HOST}/dl/6acccf5d6e979983cdce5ca3` },
            { title: "Cry Uncle [2006]", url: `${STREAM_HOST}/dl/6acccf5d6e979983cdce5ca4` },
            { title: "Digital Dilemma [2006]", url: `${STREAM_HOST}/dl/6acccf886e979983cdce5ca5` },
            { title: "Din O Sores [2006]", url: `${STREAM_HOST}/dl/6acccf886e979983cdce5ca6` },
            { title: "Egg Beats [2006]", url: `${STREAM_HOST}/dl/6acccf8e6e979983cdce5ca7` },
            { title: "Feeding Time [2006]", url: `${STREAM_HOST}/dl/6acccf8e6e979983cdce5ca8` },
            { title: "Fraidycat Scat [2006]", url: `${STREAM_HOST}/dl/6acccf946e979983cdce5ca9` },
            { title: "Freaky Tiky [2006]", url: `${STREAM_HOST}/dl/6acccf946e979983cdce5caa` },
            { title: "Hi Robot [2006]", url: `${STREAM_HOST}/dl/6acccf946e979983cdce5cab` },
            { title: "Joy Riding Jokers [2006]", url: `${STREAM_HOST}/dl/6acccf9a6e979983cdce5cac` },
            { title: "Polar Peril [2006]", url: `${STREAM_HOST}/dl/6acccf9a6e979983cdce5cad` },
            { title: "Prehisterics [2006]", url: `${STREAM_HOST}/dl/6acccfc36e979983cdce5cae` },
            { title: "Tiger Cat [2006]", url: `${STREAM_HOST}/dl/6acccfc96e979983cdce5caf` },
            { title: "Tomb It May Concern [2006]", url: `${STREAM_HOST}/dl/6acccfc96e979983cdce5cb0` },
            { title: "Tomcat Jetpack [2006]", url: `${STREAM_HOST}/dl/6acccfc96e979983cdce5cb1` },
            { title: "Way Off Brodway [2006]", url: `${STREAM_HOST}/dl/6acccfce6e979983cdce5cb2` },
            { title: "24 Karat Kat [2007]", url: `${STREAM_HOST}/dl/6acccfce6e979983cdce5cb3` },
            { title: "A Life Less Guarded [2007]", url: `${STREAM_HOST}/dl/6acccfd36e979983cdce5cb4` },
            { title: "Abracadumb [2007]", url: `${STREAM_HOST}/dl/6acccfd36e979983cdce5cb5` },
            { title: "Adventures In Penguin Sitting [2007]", url: `${STREAM_HOST}/dl/6acccfd36e979983cdce5cb6` },
            { title: "Babysitting Blues [2007]", url: `${STREAM_HOST}/dl/6acccfd86e979983cdce5cb7` },
            { title: "Battle Of The Power Tools [2007]", url: `${STREAM_HOST}/dl/6accd0006e979983cdce5cb8` },
            { title: "Beach Bully Bingo [2007]", url: `${STREAM_HOST}/dl/6accd0046e979983cdce5cb9` },
            { title: "Beefcake Tom [2007]", url: `${STREAM_HOST}/dl/6accd0066e979983cdce5cba` },
            { title: "Bend It Like Thomas [2007]", url: `${STREAM_HOST}/dl/6accd0096e979983cdce5cbb` },
            { title: "Cat Nebula [2007]", url: `${STREAM_HOST}/dl/6accd0096e979983cdce5cbc` },
            { title: "Cat Of Prey [2007]", url: `${STREAM_HOST}/dl/6accd00a6e979983cdce5cbd` },
            { title: "Cat Show Catastrophe [2007]", url: `${STREAM_HOST}/dl/6accd00f6e979983cdce5cbe` },
            { title: "Catch Me Though You Can't [2007]", url: `${STREAM_HOST}/dl/6accd00f6e979983cdce5cbf` },
            { title: "Catfish Follies [2007]", url: `${STREAM_HOST}/dl/6accd00f6e979983cdce5cc0` },
            { title: "Destruction Junction [2007]", url: `${STREAM_HOST}/dl/6accd0406e979983cdce5cc1` },
            { title: "DJ Jerry [2007]", url: `${STREAM_HOST}/dl/6accd0416e979983cdce5cc2` },
            { title: "Doggone Hill Hog [2007]", url: `${STREAM_HOST}/dl/6accd0416e979983cdce5cc3` },
            { title: "Don't Bring Your Pet To School Day [2007]", url: `${STREAM_HOST}/dl/6accd0476e979983cdce5cc4` },
            { title: "Endless Bummer [2007]", url: `${STREAM_HOST}/dl/6accd0486e979983cdce5cc5` },
            { title: "Fire Breathing Tom Cat [2007]", url: `${STREAM_HOST}/dl/6accd04c6e979983cdce5cc6` },
            { title: "Flamenco Fiasco [2007]", url: `${STREAM_HOST}/dl/6accd04d6e979983cdce5cc7` },
            { title: "Game Of Mouse And Cat [2007]", url: `${STREAM_HOST}/dl/6accd04e6e979983cdce5cc8` },
            { title: "Game Set Match [2007]", url: `${STREAM_HOST}/dl/6accd0516e979983cdce5cc9` },
            { title: "Ho Ho Horrors [2007]", url: `${STREAM_HOST}/dl/6accd0526e979983cdce5cca` },
            { title: "Hockey Schtick [2007]", url: `${STREAM_HOST}/dl/6accd0526e979983cdce5ccb` },
            { title: "I Dream Of Meanie [2007]", url: `${STREAM_HOST}/dl/6accd0526e979983cdce5ccc` },
            { title: "Invasion Of The Body Slammers [2007]", url: `${STREAM_HOST}/dl/6accd0826e979983cdce5cce` },
            { title: "Jackhammered Cat [2007]", url: `${STREAM_HOST}/dl/6accd0816e979983cdce5ccd` },
            { title: "Jungle Love [2007]", url: `${STREAM_HOST}/dl/6accd0876e979983cdce5ccf` },
            { title: "Kangadoofus [2007]", url: `${STREAM_HOST}/dl/6accd0876e979983cdce5cd0` },
            { title: "Kitty Cat Blues [2007]", url: `${STREAM_HOST}/dl/6accd0886e979983cdce5cd1` },
            { title: "Kitty Hawked [2007]", url: `${STREAM_HOST}/dl/6accd08c6e979983cdce5cd2` },
            { title: "League Of Cats [2007]", url: `${STREAM_HOST}/dl/6accd08c6e979983cdce5cd3` },
            { title: "Little Big Mouse [2007]", url: `${STREAM_HOST}/dl/6accd08d6e979983cdce5cd4` },
            { title: "Martian Mouse [2007]", url: `${STREAM_HOST}/dl/6accd0916e979983cdce5cd5` },
            { title: "Medieval Menace [2007]", url: `${STREAM_HOST}/dl/6accd0be6e979983cdce5cd6` },
            { title: "Monkey Chow [2007]", url: `${STREAM_HOST}/dl/6accd0ce6e979983cdce5cdf` },
            { title: "Monster Con [2007]", url: `${STREAM_HOST}/dl/6accd0bf6e979983cdce5cd8` },
            { title: "More Powers To You [2007]", url: `${STREAM_HOST}/dl/6accd0c36e979983cdce5cda` },
            { title: "Northern Light Fish Fight [2007]", url: `${STREAM_HOST}/dl/6accd0c36e979983cdce5cd9` },
            { title: "Octo Suave [2007]", url: `${STREAM_HOST}/dl/6accd0be6e979983cdce5cd7` },
            { title: "Over The River And Boo The Woods [2007]", url: `${STREAM_HOST}/dl/6accd0c36e979983cdce5cdb` },
            { title: "Piranha Be Loved By You [2007]", url: `${STREAM_HOST}/dl/6accd0c96e979983cdce5cdc` },
            { title: "Power Tom [2007]", url: `${STREAM_HOST}/dl/6accd0cd6e979983cdce5cde` },
            { title: "Sasquashed [2007]", url: `${STREAM_HOST}/dl/6accd0c96e979983cdce5cdd` },
            { title: "Snow Brawl [2007]", url: `${STREAM_HOST}/dl/6accd0ce6e979983cdce5ce0` },
            { title: "Snow Mouse [2007]", url: `${STREAM_HOST}/dl/6accd0fa6e979983cdce5ce1` },
            { title: "Spaced Out Cat [2007]", url: `${STREAM_HOST}/dl/6accd1006e979983cdce5ce2` },
            { title: "Spook House Mouse [2007]", url: `${STREAM_HOST}/dl/6accd1006e979983cdce5ce3` },
            { title: "Summer Squashing [2007]", url: `${STREAM_HOST}/dl/6accd1006e979983cdce5ce4` },
            { title: "The Cat Whisperer [2007]", url: `${STREAM_HOST}/dl/6accd1056e979983cdce5ce5` },
            { title: "The Declaration Of Independunce [2007]", url: `${STREAM_HOST}/dl/6accd1066e979983cdce5ce7` },
            { title: "The Itch [2007]", url: `${STREAM_HOST}/dl/6accd1066e979983cdce5ce6` },
            { title: "Tin Cat Of Tomorrow [2007]", url: `${STREAM_HOST}/dl/6accd10a6e979983cdce5ce8` },
            { title: "Tomcat Superstar [2007]", url: `${STREAM_HOST}/dl/6accd10a6e979983cdce5ce9` },
            { title: "Treasure Map Scrap [2007]", url: `${STREAM_HOST}/dl/6accd10b6e979983cdce5cea` },
            { title: "Which Witch [2007]", url: `${STREAM_HOST}/dl/6accd1366e979983cdce5ceb` },
            { title: "Xtreme Trouble [2007]", url: `${STREAM_HOST}/dl/6accd13d6e979983cdce5cec` },
            { title: "You're Lion [2007]", url: `${STREAM_HOST}/dl/6accd13d6e979983cdce5ced` },
            { title: "Zent Out Of Shape [2007]", url: `${STREAM_HOST}/dl/6accd1426e979983cdce5cee` }
        ])
    },
    "conan_catalog": {
        id: "conan",
        catalogId: "conan_catalog",
        name: "Detective Conan",
        poster: "https://i.postimg.cc/zvFTPwSK/Detective-Conan-DP.jpg",
        background: "https://i.postimg.cc/L6CGfkvY/Detective-Conan-Series-WP.jpg",
        backgroundShape: "Landscape",
        description: "Shinichi Kudo, seorang detektif remaja sekolah menengah yang cerdik, telah diracun oleh ahli Organisasi Hitam ketika mengintip urusan rahsia mereka. Akibat kesan racun APTX 4869, badannya mengecil menjadi seperti kanak-kanak sekolah rendah. Untuk menyembunyikan identitinya daripada musuh, dia menggunakan nama Conan Edogawa dan menumpang tinggal di rumah rakan baiknya, Ran Mouri, serta bapa Ran iaitu detektif persendirian Kogoro Mouri. Conan menggunakan pelbagai alat ciptaan Profesor Agasa.",
        episodes: createEpisodes([
            { title: "Episode 100 Bahagian 1", url: `${STREAM_HOST}/dl/6ace686f6e979983cdce5dde` },
            { title: "Episode 114 Bahagian 1", url: `${STREAM_HOST}/dl/6ace68756e979983cdce5de0` },
            { title: "Episode 115 Bahagian 2", url: `${STREAM_HOST}/dl/6ace68756e979983cdce5de1` },
            { title: "Episode 124", url: `${STREAM_HOST}/dl/6ace5dac6e979983cdce5d27` },
            { title: "Episode 125", url: `${STREAM_HOST}/dl/6ace5dac6e979983cdce5d26` },
            { title: "Episode 129", url: `${STREAM_HOST}/dl/6ace5dbb6e979983cdce5d2e` },
            { title: "Episode 132", url: `${STREAM_HOST}/dl/6ace5d736e979983cdce5d1e` },
            { title: "Episode 133", url: `${STREAM_HOST}/dl/6ace5d746e979983cdce5d1f` },
            { title: "Episode 134", url: `${STREAM_HOST}/dl/6ace5d746e979983cdce5d20` },
            { title: "Episode 177", url: `${STREAM_HOST}/dl/6ace68446e979983cdce5ddc` },
            { title: "Episode 178", url: `${STREAM_HOST}/dl/6ace68446e979983cdce5ddd` },
            { title: "Episode 197", url: `${STREAM_HOST}/dl/6ace66dc6e979983cdce5da2` },
            { title: "Episode 198", url: `${STREAM_HOST}/dl/6ace670a6e979983cdce5da3` },
            { title: "Episode 201", url: `${STREAM_HOST}/dl/6ace5d386e979983cdce5d13` },
            { title: "Episode 202", url: `${STREAM_HOST}/dl/6ace5d3a6e979983cdce5d14` },
            { title: "Episode 208", url: `${STREAM_HOST}/dl/6ace5d306e979983cdce5d10` },
            { title: "Episode 210", url: `${STREAM_HOST}/dl/6ace5d306e979983cdce5d0e` },
            { title: "Episode 211", url: `${STREAM_HOST}/dl/6ace5d306e979983cdce5d0f` },
            { title: "Episode 212", url: `${STREAM_HOST}/dl/6ace5d3a6e979983cdce5d16` },
            { title: "Episode 213", url: `${STREAM_HOST}/dl/6ace5d3e6e979983cdce5d17` },
            { title: "Episode 214", url: `${STREAM_HOST}/dl/6ace5d3a6e979983cdce5d15` },
            { title: "Episode 215", url: `${STREAM_HOST}/dl/6ace5d306e979983cdce5d12` },
            { title: "Episode 216", url: `${STREAM_HOST}/dl/6ace5d306e979983cdce5d0d` },
            { title: "Episode 217", url: `${STREAM_HOST}/dl/6ace5d3e6e979983cdce5d18` },
            { title: "Episode 218", url: `${STREAM_HOST}/dl/6ace5d436e979983cdce5d19` },
            { title: "Episode 219", url: `${STREAM_HOST}/dl/6ace5d436e979983cdce5d1a` },
            { title: "Episode 220-221", url: `${STREAM_HOST}/dl/6ace5d306e979983cdce5d11` },
            { title: "Episode 222 Bahagian 1", url: `${STREAM_HOST}/dl/6ace5dbd6e979983cdce5d2f` },
            { title: "Episode 223 Bahagian 2", url: `${STREAM_HOST}/dl/6ace5dec6e979983cdce5d30` },
            { title: "Episode 224 Bahagian 3", url: `${STREAM_HOST}/dl/6ace5dec6e979983cdce5d31` },
            { title: "Episode 225", url: `${STREAM_HOST}/dl/6ace5d436e979983cdce5d1b` },
            { title: "Episode 226", url: `${STREAM_HOST}/dl/6ace5d436e979983cdce5d1c` },
            { title: "Episode 227", url: `${STREAM_HOST}/dl/6ace5d736e979983cdce5d1d` },
            { title: "Episode 229 Bahagian 2", url: `${STREAM_HOST}/dl/6ace5dee6e979983cdce5d33` },
            { title: "Episode 230 Bahagian 1", url: `${STREAM_HOST}/dl/6ace5df26e979983cdce5d34` },
            { title: "Episode 233", url: `${STREAM_HOST}/dl/6ace67fd6e979983cdce5dcd` },
            { title: "Episode 234", url: `${STREAM_HOST}/dl/6ace68006e979983cdce5dce` },
            { title: "Episode 235", url: `${STREAM_HOST}/dl/6ace5d796e979983cdce5d21` },
            { title: "Episode 236 Bahagian 1", url: `${STREAM_HOST}/dl/6ace68016e979983cdce5dcf` },
            { title: "Episode 237 Bahagian 2", url: `${STREAM_HOST}/dl/6ace68016e979983cdce5dd0` },
            { title: "Episode 242", url: `${STREAM_HOST}/dl/6ace5d796e979983cdce5d22` },
            { title: "Episode 245", url: `${STREAM_HOST}/dl/6ace5d7e6e979983cdce5d23` },
            { title: "Episode 246", url: `${STREAM_HOST}/dl/6ace5d7e6e979983cdce5d24` },
            { title: "Episode 247", url: `${STREAM_HOST}/dl/6ace5d836e979983cdce5d25` },
            { title: "Episode 249", url: `${STREAM_HOST}/dl/6ace5db66e979983cdce5d2b` },
            { title: "Episode 250", url: `${STREAM_HOST}/dl/6ace5db66e979983cdce5d2c` },
            { title: "Episode 251", url: `${STREAM_HOST}/dl/6ace5ede6e979983cdce5d57` },
            { title: "Episode 252", url: `${STREAM_HOST}/dl/6ace65d16e979983cdce5d6b` },
            { title: "Episode 253 Bahagian 1", url: `${STREAM_HOST}/dl/6ace65d16e979983cdce5d70` },
            { title: "Episode 254", url: `${STREAM_HOST}/dl/6ace5e706e979983cdce5d4d` },
            { title: "Episode 257", url: `${STREAM_HOST}/dl/6ace5f256e979983cdce5d67` },
            { title: "Episode 258", url: `${STREAM_HOST}/dl/6ace674d6e979983cdce5daf` },
            { title: "Episode 259", url: `${STREAM_HOST}/dl/6ace674d6e979983cdce5db0` },
            { title: "Episode 260", url: `${STREAM_HOST}/dl/6ace67516e979983cdce5db1` },
            { title: "Episode 261", url: `${STREAM_HOST}/dl/6ace67516e979983cdce5db2` },
            { title: "Episode 262", url: `${STREAM_HOST}/dl/6ace67526e979983cdce5db3` },
            { title: "Episode 264", url: `${STREAM_HOST}/dl/6ace67586e979983cdce5db4` },
            { title: "Episode 265", url: `${STREAM_HOST}/dl/6ace677e6e979983cdce5db5` },
            { title: "Episode 266", url: `${STREAM_HOST}/dl/6ace677e6e979983cdce5db6` },
            { title: "Episode 267", url: `${STREAM_HOST}/dl/6ace677e6e979983cdce5db7` },
            { title: "Episode 268", url: `${STREAM_HOST}/dl/6ace67836e979983cdce5db8` },
            { title: "Episode 269", url: `${STREAM_HOST}/dl/6ace67836e979983cdce5db9` },
            { title: "Episode 270", url: `${STREAM_HOST}/dl/6ace67846e979983cdce5dba` },
            { title: "Episode 271", url: `${STREAM_HOST}/dl/6ace65d16e979983cdce5d6e` },
            { title: "Episode 273", url: `${STREAM_HOST}/dl/6ace67896e979983cdce5dbb` },
            { title: "Episode 276", url: `${STREAM_HOST}/dl/6ace5dfd6e979983cdce5d39` },
            { title: "Episode 277", url: `${STREAM_HOST}/dl/6ace66ca6e979983cdce5d98` },
            { title: "Episode 278", url: `${STREAM_HOST}/dl/6ace66d06e979983cdce5d99` },
            { title: "Episode 279", url: `${STREAM_HOST}/dl/6ace66d16e979983cdce5d9a` },
            { title: "Episode 280", url: `${STREAM_HOST}/dl/6ace66d16e979983cdce5d9c` },
            { title: "Episode 281", url: `${STREAM_HOST}/dl/6ace66d16e979983cdce5d9b` },
            { title: "Episode 282", url: `${STREAM_HOST}/dl/6ace66d66e979983cdce5d9d` },
            { title: "Episode 283", url: `${STREAM_HOST}/dl/6ace66d66e979983cdce5d9e` },
            { title: "Episode 284", url: `${STREAM_HOST}/dl/6ace67106e979983cdce5da5` },
            { title: "Episode 285", url: `${STREAM_HOST}/dl/6ace67106e979983cdce5da6` },
            { title: "Episode 287", url: `${STREAM_HOST}/dl/6ace67166e979983cdce5da7` },
            { title: "Episode 288", url: `${STREAM_HOST}/dl/6ace67166e979983cdce5da8` },
            { title: "Episode 289-290", url: `${STREAM_HOST}/dl/6ace5e286e979983cdce5d3a` },
            { title: "Episode 298", url: `${STREAM_HOST}/dl/6ace67896e979983cdce5dbc` },
            { title: "Episode 299", url: `${STREAM_HOST}/dl/6ace678f6e979983cdce5dbd` },
            { title: "Episode 300", url: `${STREAM_HOST}/dl/6ace678f6e979983cdce5dbe` },
            { title: "Episode 301", url: `${STREAM_HOST}/dl/6ace5e346e979983cdce5d3f` },
            { title: "Episode 302", url: `${STREAM_HOST}/dl/6ace5e346e979983cdce5d41` },
            { title: "Episode 303", url: `${STREAM_HOST}/dl/6ace67ba6e979983cdce5dc1` },
            { title: "Episode 304 (Special)", url: `${STREAM_HOST}/dl/6ace5ede6e979983cdce5d59` },
            { title: "Episode 307", url: `${STREAM_HOST}/dl/6ace67bf6e979983cdce5dc3` },
            { title: "Episode 308", url: `${STREAM_HOST}/dl/6ace5e396e979983cdce5d44` },
            { title: "Episode 309", url: `${STREAM_HOST}/dl/6ace5e606e979983cdce5d45` },
            { title: "Episode 310", url: `${STREAM_HOST}/dl/6ace5e396e979983cdce5d43` },
            { title: "Episode 312", url: `${STREAM_HOST}/dl/6ace5df86e979983cdce5df7` },
            { title: "Episode 314", url: `${STREAM_HOST}/dl/6ace5df36e979983cdce5d36` },
            { title: "Episode 315", url: `${STREAM_HOST}/dl/6ace5eac6e979983cdce5d56` },
            { title: "Episode 316", url: `${STREAM_HOST}/dl/6ace5e666e979983cdce5d48` },
            { title: "Episode 317", url: `${STREAM_HOST}/dl/6ace5e6a6e979983cdce5d49` },
            { title: "Episode 318", url: `${STREAM_HOST}/dl/6ace5e6b6e979983cdce5d4a` },
            { title: "Episode 319", url: `${STREAM_HOST}/dl/6ace5e6b6e979983cdce5d4b` },
            { title: "Episode 320", url: `${STREAM_HOST}/dl/6ace5e706e979983cdce5d4c` },
            { title: "Episode 323", url: `${STREAM_HOST}/dl/6ace67c56e979983cdce5dc5` },
            { title: "Episode 324", url: `${STREAM_HOST}/dl/6ace67c56e979983cdce5dc6` },
            { title: "Episode 325-326 Bahagian 1 & 2", url: `${STREAM_HOST}/dl/6ace67c56e979983cdce5dc7` },
            { title: "Episode 327 Bahagian 3", url: `${STREAM_HOST}/dl/6ace67cb6e979983cdce5dc8` },
            { title: "Episode 328", url: `${STREAM_HOST}/dl/6ace65db6e979983cdce5d72` },
            { title: "Episode 329 Bahagian 1", url: `${STREAM_HOST}/dl/6ace65db6e979983cdce5d71` },
            { title: "Episode 331", url: `${STREAM_HOST}/dl/6ace65db6e979983cdce5d73` },
            { title: "Episode 337", url: `${STREAM_HOST}/dl/6ace65db6e979983cdce5d74` },
            { title: "Episode 340", url: `${STREAM_HOST}/dl/6ace65e16e979983cdce5d75` },
            { title: "Episode 341", url: `${STREAM_HOST}/dl/6ace65e16e979983cdce5d76` },
            { title: "Episode 342", url: `${STREAM_HOST}/dl/6ace65e76e979983cdce5d78` },
            { title: "Episode 343", url: `${STREAM_HOST}/dl/6ace65e76e979983cdce5d77` },
            { title: "Episode 344", url: `${STREAM_HOST}/dl/6ace66156e979983cdce5d79` },
            { title: "Episode 346 Bahagian 1", url: `${STREAM_HOST}/dl/6ace5f266e979983cdce5d68` },
            { title: "Episode 347 Bahagian 2", url: `${STREAM_HOST}/dl/6ace5f506e979983cdce5d69` },
            { title: "Episode 348-349", url: `${STREAM_HOST}/dl/6ace5f516e979983cdce5d6a` },
            { title: "Episode 350", url: `${STREAM_HOST}/dl/6ace66166e979983cdce5d7a` },
            { title: "Episode 351", url: `${STREAM_HOST}/dl/6ace66166e979983cdce5d7b` },
            { title: "Episode 352", url: `${STREAM_HOST}/dl/6ace661a6e979983cdce5d7c` },
            { title: "Episode 353", url: `${STREAM_HOST}/dl/6ace661a6e979983cdce5d7d` },
            { title: "Episode 354", url: `${STREAM_HOST}/dl/6ace661a6e979983cdce5d7e` },
            { title: "Episode 355", url: `${STREAM_HOST}/dl/6ace661b6e979983cdce5d7f` },
            { title: "Episode 356", url: `${STREAM_HOST}/dl/6ace66216e979983cdce5d80` },
            { title: "Episode 357", url: `${STREAM_HOST}/dl/6ace66216e979983cdce5d81` },
            { title: "Episode 358", url: `${STREAM_HOST}/dl/6ace66266e979983cdce5d82` },
            { title: "Episode 359", url: `${STREAM_HOST}/dl/6ace66266e979983cdce5d83` },
            { title: "Episode 361", url: `${STREAM_HOST}/dl/6ace66516e979983cdce5d84` },
            { title: "Episode 362", url: `${STREAM_HOST}/dl/6ace66516e979983cdce5d85` },
            { title: "Episode 363", url: `${STREAM_HOST}/dl/6ace66566e979983cdce5d86` },
            { title: "Episode 364", url: `${STREAM_HOST}/dl/6ace66566e979983cdce5d87` },
            { title: "Episode 365", url: `${STREAM_HOST}/dl/6ace66576e979983cdce5d88` },
            { title: "Episode 367", url: `${STREAM_HOST}/dl/6ace66576e979983cdce5d89` },
            { title: "Episode 368", url: `${STREAM_HOST}/dl/6ace665c6e979983cdce5d8a` },
            { title: "Episode 369", url: `${STREAM_HOST}/dl/6ace665c6e979983cdce5d8b` },
            { title: "Episode 370", url: `${STREAM_HOST}/dl/6ace66616e979983cdce5d8c` },
            { title: "Episode 389", url: `${STREAM_HOST}/dl/6ace5e346e979983cdce5d40` },
            { title: "Episode 392", url: `${STREAM_HOST}/dl/6ace5e9c6e979983cdce5d4f` },
            { title: "Episode 413", url: `${STREAM_HOST}/dl/6ace67f76e979983cdce5dc9` },
            { title: "Episode 414", url: `${STREAM_HOST}/dl/6ace67f76e979983cdce5dca` },
            { title: "Episode 419", url: `${STREAM_HOST}/dl/6ace67fb6e979983cdce5dcb` },
            { title: "Episode 425", url: `${STREAM_HOST}/dl/6ace67166e979983cdce5daa` },
            { title: "Episode 426", url: `${STREAM_HOST}/dl/6ace67fb6e979983cdce5dcc` },
            { title: "Episode 428", url: `${STREAM_HOST}/dl/6ace5e2a6e979983cdce5d3c` },
            { title: "Episode 437", url: `${STREAM_HOST}/dl/6ace5ea26e979983cdce5d50` },
            { title: "Episode 438", url: `${STREAM_HOST}/dl/6ace5e2f6e979983cdce5d3d` },
            { title: "Episode 442", url: `${STREAM_HOST}/dl/6ace5e2f6e979983cdce5d3e` },
            { title: "Episode 443", url: `${STREAM_HOST}/dl/6ace671c6e979983cdce5dab` },
            { title: "Episode 444", url: `${STREAM_HOST}/dl/6ace67466e979983cdce5dac` },
            { title: "Episode 460", url: `${STREAM_HOST}/dl/6ace5dfd6e979983cdce5d38` },
            { title: "Episode 477", url: `${STREAM_HOST}/dl/6ace5df36e979983cdce5d35` }
        ])
    },
    "kaito_kid_catalog": {
        id: "kaito_kid",
        catalogId: "kaito_kid_catalog",
        name: "Kaito Kid",
        poster: "https://i.postimg.cc/QdrhJ0Zx/Kaito-Kid.webp",
        background: "https://i.postimg.cc/Qx4v5gSB/Kaito-Kid-WP.jpg",
        backgroundShape: "Landscape",
        description: "Kaito Kid, yang beridentitikan Kaito Kuroba, ialah watak pencuri budiman fiksyen berusia 17 tahun daripada siri Magic Kaito dan Detective Conan karya Gosho Aoyama. Beliau terkenal dengan penampilan ikonik bersut putih bersama topi tinggi dan monokel, serta kehebatan dalam seni silap mata, penyamaran sempurna, dan penggunaan gajet layang-layang gantung untuk melarikan diri.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6ace5b546e979983cdce5d04` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6ace5b546e979983cdce5d05` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6ace5b546e979983cdce5d07` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6ace5b546e979983cdce5d08` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6ace5b546e979983cdce5d03` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6ace5b546e979983cdce5d06` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6ace5b5c6e979983cdce5d09` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6ace5b5c6e979983cdce5d0a` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6ace5b5c6e979983cdce5d0b` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6ace5b5c6e979983cdce5d0c` },
        ])
    },
    "magic_kaito_catalog": {
        id: "magic_kaito",
        catalogId: "magic_kaito_catalog",
        name: "Magic Kaito",
        poster: "https://i.postimg.cc/MpsRk2Gn/Magic-Kaito.jpg",
        background: "https://i.postimg.cc/BQQdX75Q/Magic-Kaito-WP.jpg",
        backgroundShape: "Landscape",
        description: "Kaito Kid menyasarkan dan mencuri pelbagai permata berharga di seluruh dunia untuk memeriksa sama ada permata tersebut adalah Pandora Gem (permata yang akan bersinar merah apabila dihalakan ke arah cahaya bulan). Sekiranya permata itu bukan yang dicari, dia akan memulangkannya semula kepada pemilik asal atau pihak polis. Kaito merupakan seorang pakar silap mata yang sangat genius, mahir menyamar dengan meniru suara dan wajah sesiapa sahaja tanpa menggunakan alat pengubah suara, serta menggunakan pelbagai gajet canggih seperti senapang kad (Card Gun) dan h glider untuk meloloskan diri.",
        episodes: createEpisodes([
            { title: "Magic Kaito (MK) Ep 1", url: `${STREAM_HOST}/dl/6ace688a6e979983cdce5de3` },
            { title: "Magic Kaito (MK) Ep 2", url: `${STREAM_HOST}/dl/6ace688a6e979983cdce5de5` },
            { title: "Magic Kaito (MK) Ep 3", url: `${STREAM_HOST}/dl/6ace688a6e979983cdce5de4` },
            { title: "Magic Kaito (MK) Ep 4", url: `${STREAM_HOST}/dl/6ace688a6e979983cdce5de7` },
            { title: "Magic Kaito (MK) Ep 5", url: `${STREAM_HOST}/dl/6ace688a6e979983cdce5de2` },
            { title: "Magic Kaito (MK) Ep 6", url: `${STREAM_HOST}/dl/6ace688a6e979983cdce5de6` },
            { title: "Magic Kaito (MK) Ep 7", url: `${STREAM_HOST}/dl/6ace68ac6e979983cdce5de8` },
            { title: "Magic Kaito (MK) Ep 8", url: `${STREAM_HOST}/dl/6ace68b16e979983cdce5dea` },
            { title: "Magic Kaito (MK) Ep 9", url: `${STREAM_HOST}/dl/6ace68b16e979983cdce5de9` },
            { title: "Magic Kaito (MK) Ep 10", url: `${STREAM_HOST}/dl/6ace68b16e979983cdce5deb` },
            { title: "Magic Kaito (MK) Ep 11", url: `${STREAM_HOST}/dl/6ace68b16e979983cdce5dec` },
            { title: "Magic Kaito (MK) Ep 12", url: `${STREAM_HOST}/dl/6ace68b16e979983cdce5ded` },
            { title: "Magic Kaito (MK) Ep 13", url: `${STREAM_HOST}/dl/6ace68be6e979983cdce5dee` },
            { title: "Magic Kaito (MK) Ep 14", url: `${STREAM_HOST}/dl/6ace68be6e979983cdce5def` },
            { title: "Magic Kaito (MK) Ep 15", url: `${STREAM_HOST}/dl/6ace68be6e979983cdce5df0` },
            { title: "Magic Kaito (MK) Ep 16", url: `${STREAM_HOST}/dl/6ace68be6e979983cdce5df1` },
            { title: "Magic Kaito (MK) Ep 17", url: `${STREAM_HOST}/dl/6ace66616e979983cdce5d8d` },
            { title: "Magic Kaito (MK) Ep 18", url: `${STREAM_HOST}/dl/6ace668d6e979983cdce5d8e` },
            { title: "Magic Kaito (MK) Ep 19", url: `${STREAM_HOST}/dl/6ace66936e979983cdce5d8f` },
            { title: "Magic Kaito (MK) Ep 20", url: `${STREAM_HOST}/dl/6ace66936e979983cdce5d91` },
            { title: "Magic Kaito (MK) Ep 21", url: `${STREAM_HOST}/dl/6ace66936e979983cdce5d90` },
            { title: "Magic Kaito (MK) Ep 22", url: `${STREAM_HOST}/dl/6ace66936e979983cdce5d92` },
            { title: "Magic Kaito (MK) Ep 23", url: `${STREAM_HOST}/dl/6ace66936e979983cdce5d93` },
            { title: "Magic Kaito (MK) Ep 24", url: `${STREAM_HOST}/dl/6ace669e6e979983cdce5d94` }
        ])
    },
    "ginban_catalog": {
        id: "ginban",
        catalogId: "ginban_catalog",
        name: "Ginban Kaleidoscope",
        poster: "https://i.postimg.cc/x1ywwxmB/Ginban-Kaleidoscope.jpg",
        background: "https://i.postimg.cc/R0v8x3b2/Ginban-WP.jpg",
        backgroundShape: "Landscape",
        description: "Ginban Kaleidoscope mengisahkan tentang Tazusa Sakurano, seorang atlet luncur ais Jepun berusia 16 tahun yang bercita-cita ke Sukan Olimpik. Selepas pengsan semasa pertandingan, roh seorang juruterbang remaja Kanada bernama Pete Pumps secara tidak sengaja bersangkut dan berkongsi tubuh dengannya selama 100 hari. Walaupun pada mulanya mereka sering berbalah, kehadiran Pete membantu Tazusa memperbaiki prestasinya dan mula membuka hatinya.",
        episodes: createEpisodes([
            "https://files.catbox.moe/5je70q.flv", "https://files.catbox.moe/l4dsxu.flv", "https://files.catbox.moe/0pffen.flv", "https://files.catbox.moe/v67xcz.mp4",
            "https://files.catbox.moe/dth1gm.mp4", "https://files.catbox.moe/tvcszy.mp4", "https://files.catbox.moe/pj6spq.mp4", "https://files.catbox.moe/tta199.mp4",
            "https://files.catbox.moe/dzl7mp.mp4", "https://files.catbox.moe/mzv0e3.mp4", "https://files.catbox.moe/8cxro0.mp4", "https://files.catbox.moe/c33xc2.mp4"
        ])
    },
    "black_cat_catalog": {
        id: "black_cat",
        catalogId: "black_cat_catalog",
        name: "Black Cat",
        poster: "https://i.postimg.cc/fRjGG2dF/Black-Cat.jpg",
        background: "https://i.postimg.cc/P5PYFMwp/Black-Cat-WP.jpg",
        backgroundShape: "Landscape",
        description: "Digelar Black Cat kerana setiap kali beliau muncul, mangsanya akan ditimpa nasib malang (kematian). Selepas meninggalkan Chronos kerana dipengaruhi oleh seorang pemburu hadiah bernama Saya Minatsuki, Train menukar haluan hidupnya menjadi seorang Sweeper (pemburu hadiah bebas) yang menegakkan keadilan tanpa membunuh.",
        episodes: createEpisodes([
            "https://files.catbox.moe/xt0a0n.mp4", "https://files.catbox.moe/k1wxy6.mp4", "https://files.catbox.moe/npays5.mp4", "https://files.catbox.moe/vr6t77.mp4", "https://files.catbox.moe/rtp95u.mp4",
            "https://files.catbox.moe/3u3jbh.mp4", "https://files.catbox.moe/6hf6fs.mp4", "https://files.catbox.moe/u9zsug.mp4", "https://files.catbox.moe/tza3td.mp4", "https://files.catbox.moe/s2z3iy.mp4",
            "https://files.catbox.moe/p0nv9h.mp4", "https://files.catbox.moe/3l5rnc.mp4", "https://files.catbox.moe/am14fw.mp4", "https://files.catbox.moe/ip19yx.mp4", "https://files.catbox.moe/ifwh66.mp4",
            "https://files.catbox.moe/jrf7j4.mp4", "https://files.catbox.moe/j5scn9.mp4", "https://files.catbox.moe/hjueai.mp4", "https://files.catbox.moe/3ds9an.mp4", "https://files.catbox.moe/o80p7r.mp4",
            "https://files.catbox.moe/6vtgbq.mp4", "https://files.catbox.moe/58zmb9.mp4", "https://files.catbox.moe/3zrbqp.mp4", "https://files.catbox.moe/jsah3e.mp4"
        ])
    },
    "digimon_savers_catalog": {
        id: "digimon_savers",
        catalogId: "digimon_savers_catalog",
        name: "Digimon Savers",
        poster: "https://i.postimg.cc/pLHN1bms/Digimon-Savers.jpg",
        background: "https://i.postimg.cc/d0CdJtnq/Digimon-Savers-WP.webp",
        backgroundShape: "Landscape",
        description: "Masaru Daimon, seorang pelajar sekolah menengah berusia 14 tahun yang gemar bertarung di jalanan, secara tidak sengaja bertemu dengan Agumon yang melarikan diri daripada buruan DATS. Selepas bertarung satu lawan satu, mereka berdua saling menghormati dan membentuk ikatan persahabatan yang kuat.",
        episodes: createEpisodes([
            "https://files.catbox.moe/pjuq4v.mp4", "https://files.catbox.moe/2xj9b9.mp4", "https://files.catbox.moe/qwdfom.mp4", "https://files.catbox.moe/0rcnrs.mp4", "https://files.catbox.moe/dcum9s.mp4",
            "https://files.catbox.moe/m7vixb.mp4", "https://files.catbox.moe/kwgaqq.mp4", "https://files.catbox.moe/odxlwf.mp4", "https://files.catbox.moe/903sr9.mp4", "https://files.catbox.moe/v2vwvm.mp4",
            "https://files.catbox.moe/jnjj2h.mp4", "https://files.catbox.moe/c82q1v.mp4", "https://files.catbox.moe/dc7of9.mp4", "https://files.catbox.moe/j2f9wa.mp4", "https://files.catbox.moe/ogadln.mp4",
            "https://files.catbox.moe/gfctf7.mp4", "https://files.catbox.moe/tus67m.mp4", "https://files.catbox.moe/paodxr.mp4", "https://files.catbox.moe/t8zlhi.mp4", "https://files.catbox.moe/sgg2ih.mp4",
            "https://files.catbox.moe/t2ysv4.mp4", "https://files.catbox.moe/981fj9.mp4", "https://files.catbox.moe/ok19dj.mp4", "https://files.catbox.moe/yn3mcd.mp4", "https://files.catbox.moe/kyn0pe.mp4",
            "https://files.catbox.moe/oyg7fd.mp4", "https://files.catbox.moe/xn5x2v.mp4", "https://files.catbox.moe/bo830d.mp4", "https://files.catbox.moe/0axnec.mp4", "https://files.catbox.moe/k67jwm.mp4",
            "https://files.catbox.moe/2s09wt.mp4", "https://files.catbox.moe/1337zx.mp4", "https://files.catbox.moe/yyj40k.mp4", "https://files.catbox.moe/00iraw.mp4", "https://files.catbox.moe/mu4b9q.mp4",
            "https://files.catbox.moe/ng4uzb.mp4", "https://files.catbox.moe/e0qa9y.mp4", "https://files.catbox.moe/iyxhhs.mp4", "https://files.catbox.moe/ggmem5.mp4", "https://files.catbox.moe/107d1y.mp4",
            "https://files.catbox.moe/ttwtn5.mp4", "https://files.catbox.moe/7skrqk.mp4", "https://files.catbox.moe/sub0gd.mp4", "https://files.catbox.moe/rrkgee.mp4", "https://files.catbox.moe/30u7ag.mp4",
            "https://files.catbox.moe/a1obqr.mp4", "https://files.catbox.moe/8anpz9.mp4", "https://files.catbox.moe/23a3j8.mp4"
        ])
    },
    "digimon_01_catalog": {
        id: "digimon_01",
        catalogId: "digimon_01_catalog",
        name: "Digimon Adventure 01",
        poster: "https://i.postimg.cc/T368HMKn/Digimon-01.jpg",
        background: "https://i.postimg.cc/K8wBXgPv/Digimon-Adventure-01-WP.jpg",
        backgroundShape: "Landscape",
        description: "Kisah bermula apabila tujuh orang kanak-kanak menyertai perkhemahan cuti musim panas. Secara tiba-tiba, mereka dihantar ke satu alam misteri yang dipanggil Dunia Digital (Digital World). Di sana, mereka bertemu dengan makhluk digital yang dikenali sebagai Digimon. Kanak-kanak ini kemudiannya dikenali sebagai Kanak-Kanak Terpilih (Chosen Children / DigiDestined). Mereka bersama pasangan Digimon masing-masing perlu berjuang menyelamatkan Dunia Digital dan Dunia Nyata daripada ancaman musuh jahat (bermula dengan Devimon).",
        episodes: createEpisodes([
            "https://files.catbox.moe/e0rqpf.mkv", "https://files.catbox.moe/2hou0p.mkv", "https://files.catbox.moe/e9v6wa.mkv", "https://files.catbox.moe/gu2sos.mkv", "https://files.catbox.moe/n6rsk2.mkv",
            "https://files.catbox.moe/tskc12.mkv", "https://files.catbox.moe/fpko2t.mkv", "https://files.catbox.moe/r0bem3.mkv", "https://files.catbox.moe/cdimzv.mkv", "https://files.catbox.moe/0yua59.mkv",
            "https://files.catbox.moe/wofmc1.mkv", "https://files.catbox.moe/zezjha.mkv", "https://files.catbox.moe/jz8h9m.mkv", "https://files.catbox.moe/ttnebg.mkv", "https://files.catbox.moe/j1qgd0.mkv",
            "https://files.catbox.moe/2f5l1i.mkv", "https://files.catbox.moe/9zl6f3.mkv", "https://files.catbox.moe/g5mp05.mkv", "https://files.catbox.moe/9qyu8m.mkv", "https://files.catbox.moe/qi4907.mkv",
            "https://files.catbox.moe/62qm6q.mkv", "https://files.catbox.moe/qd2rp6.mkv", "https://files.catbox.moe/hsirv9.mkv", "https://files.catbox.moe/j9inza.mkv", "https://files.catbox.moe/imdz6v.mkv",
            "https://files.catbox.moe/eavdti.mkv", "https://files.catbox.moe/6bt1jb.mkv", "https://files.catbox.moe/j7y6l5.mkv", "https://files.catbox.moe/k3qi71.mkv", "https://files.catbox.moe/z48p20.mkv",
            "https://files.catbox.moe/0liv2g.mkv", "https://files.catbox.moe/ib93b9.mkv", "https://files.catbox.moe/cmddcq.mkv", "https://files.catbox.moe/hc75qs.mkv", "https://files.catbox.moe/80ihqw.mkv",
            "https://files.catbox.moe/2j4528.mkv", "https://files.catbox.moe/m2vk0x.mkv", "https://files.catbox.moe/bxkjwm.mkv", "https://files.catbox.moe/1b9gwu.mkv", "https://files.catbox.moe/lnxlw4.mkv",
            "https://files.catbox.moe/kffur9.mkv", "https://files.catbox.moe/x39h67.mkv", "https://files.catbox.moe/b5mwsr.mkv", "https://files.catbox.moe/cwq3jd.mkv", "https://files.catbox.moe/gokoql.mkv",
            "https://files.catbox.moe/a88ir0.mkv", "https://files.catbox.moe/e2ocb9.mkv", "https://files.catbox.moe/op51ps.mkv", "https://files.catbox.moe/ynheic.mkv", "https://files.catbox.moe/44nsq7.mkv",
            "https://files.catbox.moe/tvu37m.mkv", "https://files.catbox.moe/dqatyz.mkv", "https://files.catbox.moe/sbex83.mkv", "https://files.catbox.moe/qd2yx9.mkv"
        ])
    },
    "digimon_02_catalog": {
        id: "digimon_02",
        catalogId: "digimon_02_catalog",
        name: "Digimon Adventure 02",
        poster: "https://i.postimg.cc/qvzyZG3C/Digimon-Adventure-02-DP.webp",
        background: "https://i.postimg.cc/4dWq4JhQ/Digimin-Zero-Two-DP.jpg",
        backgroundShape: "Landscape",
        description: "Dunia Digital sekali lagi diancam bahaya apabila munculnya seorang musuh baharu yang menggelarkan dirinya sebagai Digimon Kaiser (Digimon Emperor). Dia memperhambakan Digimon liar menggunakan Gelang Hitam (Evil Rings) dan mendirikan Menara Kegelapan (Control Spires) di seluruh wilayah untuk menyekat evolusi biasa Digimon. Untuk menentang ancaman baharu ini, tiga orang Kanak-kanak Terpilih baharu telah direkrut iaitu Daisuke, Miyako, dan Iori. Mereka menyertai dua watak lama yang kembali, iaitu Takeru dan Hikari.",
        episodes: createEpisodes([
            { title: "Digimon Adventure Zero Two Episode 01", url: "https://files.catbox.moe/zt1oss.mkv" },
            { title: "Digimon Adventure Zero Two Episode 02", url: "https://files.catbox.moe/o2wbio.mkv" },
            { title: "Digimon Adventure Zero Two Episode 03", url: "https://files.catbox.moe/fgestm.mkv" },
            { title: "Digimon Adventure Zero Two Episode 04", url: "https://files.catbox.moe/ts15kq.mkv" },
            { title: "Digimon Adventure Zero Two Episode 05", url: "https://files.catbox.moe/ugk57y.mkv" },
            { title: "Digimon Adventure Zero Two Episode 06", url: `${STREAM_HOST}/dl/6ad77e9b6e979983cdce6031` },
            { title: "Digimon Adventure Zero Two Episode 07", url: `${STREAM_HOST}/dl/6ad77e9b6e979983cdce6032` },
            { title: "Digimon Adventure Zero Two Episode 08", url: "https://files.catbox.moe/25w9m5.mkv" },
            { title: "Digimon Adventure Zero Two Episode 09", url: "https://files.catbox.moe/au9u4q.mkv" },
            { title: "Digimon Adventure Zero Two Episode 10", url: `${STREAM_HOST}/dl/6ad77e9e6e979983cdce6033` },
            { title: "Digimon Adventure Zero Two Episode 11", url: "https://files.catbox.moe/1gde4g.mkv" },
            { title: "Digimon Adventure Zero Two Episode 12", url: "https://files.catbox.moe/3fp5e6.mkv" },
            { title: "Digimon Adventure Zero Two Episode 13", url: "https://files.catbox.moe/7zl3u6.mkv" },
            { title: "Digimon Adventure Zero Two Episode 14", url: `${STREAM_HOST}/dl/6ad77e9e6e979983cdce6034` },
            { title: "Digimon Adventure Zero Two Episode 15", url: `${STREAM_HOST}/dl/6ad77ea36e979983cdce6035` },
            { title: "Digimon Adventure Zero Two Episode 16", url: `${STREAM_HOST}/dl/6ad77ea36e979983cdce6036` },
            { title: "Digimon Adventure Zero Two Episode 17", url: `${STREAM_HOST}/dl/6ad77ea86e979983cdce6037` },
            { title: "Digimon Adventure Zero Two Episode 18", url: `${STREAM_HOST}/dl/6ad77ea96e979983cdce6038` },
            { title: "Digimon Adventure Zero Two Episode 19", url: `${STREAM_HOST}/dl/6ad77eae6e979983cdce6039` },
            { title: "Digimon Adventure Zero Two Episode 20", url: `${STREAM_HOST}/dl/6ad77eae6e979983cdce603a` },
            { title: "Digimon Adventure Zero Two Episode 21", url: `${STREAM_HOST}/dl/6ad7835f6e979983cdce607b` },
            { title: "Digimon Adventure Zero Two Episode 22", url: `${STREAM_HOST}/dl/6ad7835d6e979983cdce6077` },
            { title: "Digimon Adventure Zero Two Episode 23", url: `${STREAM_HOST}/dl/6ad7835d6e979983cdce6079` },
            { title: "Digimon Adventure Zero Two Episode 24", url: `${STREAM_HOST}/dl/6ad7835d6e979983cdce6078` },
            { title: "Digimon Adventure Zero Two Episode 25", url: `${STREAM_HOST}/dl/6ad7835d6e979983cdce607a` },
            { title: "Digimon Adventure Zero Two Episode 26", url: `${STREAM_HOST}/dl/6ad7835f6e979983cdce607c` },
            { title: "Digimon Adventure Zero Two Episode 27", url: `${STREAM_HOST}/dl/6ad783606e979983cdce607d` },
            { title: "Digimon Adventure Zero Two Episode 28", url: `${STREAM_HOST}/dl/6ad783666e979983cdce607e` },
            { title: "Digimon Adventure Zero Two Episode 29", url: `${STREAM_HOST}/dl/6ad783666e979983cdce607f` },
            { title: "Digimon Adventure Zero Two Episode 30", url: `${STREAM_HOST}/dl/6ad783666e979983cdce6080` },
            { title: "Digimon Adventure Zero Two Episode 31", url: `${STREAM_HOST}/dl/6ad7836b6e979983cdce6081` },
            { title: "Digimon Adventure Zero Two Episode 32", url: `${STREAM_HOST}/dl/6ad783716e979983cdce6082` },
            { title: "Digimon Adventure Zero Two Episode 33", url: `${STREAM_HOST}/dl/6ad783716e979983cdce6083` },
            { title: "Digimon Adventure Zero Two Episode 34", url: `${STREAM_HOST}/dl/6ad783716e979983cdce6084` },
            { title: "Digimon Adventure Zero Two Episode 35", url: `${STREAM_HOST}/dl/6ad783726e979983cdce6085` },
            { title: "Digimon Adventure Zero Two Episode 36", url: `${STREAM_HOST}/dl/6ad7839c6e979983cdce6086` },
            { title: "Digimon Adventure Zero Two Episode 37", url: `${STREAM_HOST}/dl/6ad7839d6e979983cdce6087` },
            { title: "Digimon Adventure Zero Two Episode 38", url: `${STREAM_HOST}/dl/6ad783a26e979983cdce6088` },
            { title: "Digimon Adventure Zero Two Episode 39", url: `${STREAM_HOST}/dl/6ad783a36e979983cdce6089` },
            { title: "Digimon Adventure Zero Two Episode 40", url: `${STREAM_HOST}/dl/6ad783a36e979983cdce608a` },
            { title: "Digimon Adventure Zero Two Episode 41", url: `${STREAM_HOST}/dl/6ad783a76e979983cdce608b` },
            { title: "Digimon Adventure Zero Two Episode 42", url: `${STREAM_HOST}/dl/6ad783a86e979983cdce608c` },
            { title: "Digimon Adventure Zero Two Episode 43", url: `${STREAM_HOST}/dl/6ad783a86e979983cdce608d` },
            { title: "Digimon Adventure Zero Two Episode 44", url: `${STREAM_HOST}/dl/6ad783ac6e979983cdce608e` },
            { title: "Digimon Adventure Zero Two Episode 45", url: `${STREAM_HOST}/dl/6ad783ae6e979983cdce608f` },
            { title: "Digimon Adventure Zero Two Episode 46", url: "https://files.catbox.moe/j8ahrl.mkv" },
            { title: "Digimon Adventure Zero Two Episode 47", url: "https://files.catbox.moe/w6z6w8.mkv" },
            { title: "Digimon Adventure Zero Two Episode 48", url: "https://files.catbox.moe/yiw8ta.mkv" },
            { title: "Digimon Adventure Zero Two Episode 49", url: "https://files.catbox.moe/1lrnrc.mkv" },
            { title: "Digimon Adventure Zero Two Episode 50", url: "https://files.catbox.moe/bfcmhr.mkv" }
        ])
    },
    "digimon_03_catalog": {
        id: "digimon_03",
        catalogId: "digimon_03_catalog",
        name: "Digimon Adventure Tri",
        poster: "https://i.postimg.cc/VNkLKN1v/Digimon-Tri-DP.jpg",
        background: "https://i.postimg.cc/8CzPZCD6/Dogimon-Tri-WP.jpg",
        backgroundShape: "Landscape",
        description: "Anak-anak terpilih (DigiDestined) disatukan semula dengan rakan-rakan serta Digimon mereka untuk memulakan pengembaraan baharu. Mereka perlu melindungi Dunia Digital dan Dunia Nyata daripada ancaman misteri dan jangkitan yang menyebabkan Digimon bertindak liar.",
        episodes: createEpisodes([
        ])
    },
    "digimon_2020_catalog": {
        id: "digimon_adventure2020",
        catalogId: "digimon_adventure2020_catalog",
        name: "Digimon Adventure 2020",
        poster: "https://i.postimg.cc/43ww8tX4/Digimon-Adventure-2020.jpg",
        background: "https://i.postimg.cc/9fQFLfVC/Digimon-2020-WP.avif",
        backgroundShape: "Landscape",
        description: "Apabila ibu dan adik perempuan Taichi terperangkap dalam sebuah tren metro yang tidak boleh dihentikan akibat serangan siber di Tokyo, Taichi bergegas ke stesen dan secara misteri ditarik ke dalam Dunia Digital..",
        episodes: createEpisodes([
            { title: "Digimon Adventure Episode 01", url: `${STREAM_HOST}/dl/6ad75d6e6e979983cdce5ff6` },
            { title: "Digimon Adventure Episode 02", url: `${STREAM_HOST}/dl/6ad759ad6e979983cdce5fb9` },
            { title: "Digimon Adventure Episode 03", url: `${STREAM_HOST}/dl/6ad759ad6e979983cdce5fb8` },   
            { title: "Digimon Adventure Episode 04", url: `${STREAM_HOST}/dl/6ad759ad6e979983cdce5fbc` },   
            { title: "Digimon Adventure Episode 05", url: `${STREAM_HOST}/dl/6ad759ad6e979983cdce5fb7` },   
            { title: "Digimon Adventure Episode 06", url: `${STREAM_HOST}/dl/6ad759ad6e979983cdce5fba` },   
            { title: "Digimon Adventure Episode 07", url: `${STREAM_HOST}/dl/6ad759b66e979983cdce5fbd` },   
            { title: "Digimon Adventure Episode 08", url: `${STREAM_HOST}/dl/6ad759b66e979983cdce5fbe` },   
            { title: "Digimon Adventure Episode 09", url: `${STREAM_HOST}/dl/6ad759b66e979983cdce5fbf` },   
            { title: "Digimon Adventure Episode 10", url: `${STREAM_HOST}/dl/6ad759b66e979983cdce5fc0` },   
            { title: "Digimon Adventure Episode 11", url: `${STREAM_HOST}/dl/6ad759bc6e979983cdce5fc1` },   
            { title: "Digimon Adventure Episode 12", url: `${STREAM_HOST}/dl/6ad759bc6e979983cdce5fc2` },   
            { title: "Digimon Adventure Episode 13", url: `${STREAM_HOST}/dl/6ad759c16e979983cdce5fc4` },   
            { title: "Digimon Adventure Episode 14", url: `${STREAM_HOST}/dl/6ad759c16e979983cdce5fc3` },   
            { title: "Digimon Adventure Episode 15", url: `${STREAM_HOST}/dl/6ad759c26e979983cdce5fc5` },   
            { title: "Digimon Adventure Episode 16", url: `${STREAM_HOST}/dl/6ad759ec6e979983cdce5fc6` },   
            { title: "Digimon Adventure Episode 17", url: `${STREAM_HOST}/dl/6ad759f16e979983cdce5fc7` },   
            { title: "Digimon Adventure Episode 18", url: `${STREAM_HOST}/dl/6ad759f16e979983cdce5fc8` },   
            { title: "Digimon Adventure Episode 19", url: `${STREAM_HOST}/dl/6ad759f36e979983cdce5fc9` },   
            { title: "Digimon Adventure Episode 20", url: `${STREAM_HOST}/dl/6ad759f76e979983cdce5fca` },   
            { title: "Digimon Adventure Episode 21", url: `${STREAM_HOST}/dl/6ad759f76e979983cdce5fcc` },   
            { title: "Digimon Adventure Episode 22", url: `${STREAM_HOST}/dl/6ad759f76e979983cdce5fcb` },   
            { title: "Digimon Adventure Episode 23", url: `${STREAM_HOST}/dl/6ad759f76e979983cdce5fcd` },   
            { title: "Digimon Adventure Episode 24", url: `${STREAM_HOST}/dl/6ad759fd6e979983cdce5fce` },   
            { title: "Digimon Adventure Episode 25", url: `${STREAM_HOST}/dl/6ad759fd6e979983cdce5fcf` },   
            { title: "Digimon Adventure Episode 26", url: `${STREAM_HOST}/dl/6ad75a296e979983cdce5fd0` },   
            { title: "Digimon Adventure Episode 27", url: `${STREAM_HOST}/dl/6ad75a2d6e979983cdce5fd2` },   
            { title: "Digimon Adventure Episode 28", url: `${STREAM_HOST}/dl/6ad75a2d6e979983cdce5fd1` },   
            { title: "Digimon Adventure Episode 29", url: `${STREAM_HOST}/dl/6ad75a2e6e979983cdce5fd3` },   
            { title: "Digimon Adventure Episode 30", url: `${STREAM_HOST}/dl/6ad75a2f6e979983cdce5fd4` },   
            { title: "Digimon Adventure Episode 31", url: `${STREAM_HOST}/dl/6ad75a346e979983cdce5fd5` },   
            { title: "Digimon Adventure Episode 32", url: `${STREAM_HOST}/dl/6ad75a346e979983cdce5fd6` },   
            { title: "Digimon Adventure Episode 33", url: `${STREAM_HOST}/dl/6ad75a3a6e979983cdce5fd8` },   
            { title: "Digimon Adventure Episode 34", url: `${STREAM_HOST}/dl/6ad75a3a6e979983cdce5fd7` },   
            { title: "Digimon Adventure Episode 35", url: `${STREAM_HOST}/dl/6ad75a3b6e979983cdce5fd9` },   
            { title: "Digimon Adventure Episode 36", url: `${STREAM_HOST}/dl/6ad75a656e979983cdce5fda` },   
            { title: "Digimon Adventure Episode 37", url: `${STREAM_HOST}/dl/6ad75a696e979983cdce5fdb` },   
            { title: "Digimon Adventure Episode 38", url: `${STREAM_HOST}/dl/6ad75a696e979983cdce5fdc` },   
            { title: "Digimon Adventure Episode 39", url: `${STREAM_HOST}/dl/6ad75a696e979983cdce5fdd` },   
            { title: "Digimon Adventure Episode 40", url: `${STREAM_HOST}/dl/6ad75a6a6e979983cdce5fde` },   
            { title: "Digimon Adventure Episode 41", url: `${STREAM_HOST}/dl/6ad75a6e6e979983cdce5fdf` },   
            { title: "Digimon Adventure Episode 42", url: `${STREAM_HOST}/dl/6ad75a706e979983cdce5fe0` },   
            { title: "Digimon Adventure Episode 43", url: `${STREAM_HOST}/dl/6ad75a746e979983cdce5fe1` },   
            { title: "Digimon Adventure Episode 44", url: `${STREAM_HOST}/dl/6ad75a746e979983cdce5fe2` },   
            { title: "Digimon Adventure Episode 45", url: `${STREAM_HOST}/dl/6ad75a746e979983cdce5fe3` },   
            { title: "Digimon Adventure Episode 46", url: `${STREAM_HOST}/dl/6ad75a796e979983cdce5fe4` },   
            { title: "Digimon Adventure Episode 47", url: `${STREAM_HOST}/dl/6ad75aa06e979983cdce5fe5` },   
            { title: "Digimon Adventure Episode 48", url: `${STREAM_HOST}/dl/6ad75aa56e979983cdce5fe6` },   
            { title: "Digimon Adventure Episode 49", url: `${STREAM_HOST}/dl/6ad75aaa6e979983cdce5fe7` },   
            { title: "Digimon Adventure Episode 50", url: `${STREAM_HOST}/dl/6ad75aaa6e979983cdce5fe8` },   
            { title: "Digimon Adventure Episode 51", url: `${STREAM_HOST}/dl/6ad75aac6e979983cdce5fe9` },   
            { title: "Digimon Adventure Episode 52", url: `${STREAM_HOST}/dl/6ad75aaf6e979983cdce5fea` },   
            { title: "Digimon Adventure Episode 53", url: `${STREAM_HOST}/dl/6ad75ab06e979983cdce5feb` },   
            { title: "Digimon Adventure Episode 54", url: `${STREAM_HOST}/dl/6ad75ab06e979983cdce5fec` },   
            { title: "Digimon Adventure Episode 55", url: `${STREAM_HOST}/dl/6ad75ab56e979983cdce5fed` },   
            { title: "Digimon Adventure Episode 56", url: `${STREAM_HOST}/dl/6ad75adc6e979983cdce5fee` },   
            { title: "Digimon Adventure Episode 57", url: `${STREAM_HOST}/dl/6ad75adc6e979983cdce5fef` },   
            { title: "Digimon Adventure Episode 58", url: `${STREAM_HOST}/dl/6ad75ae26e979983cdce5ff0` },   
            { title: "Digimon Adventure Episode 59", url: `${STREAM_HOST}/dl/6ad75ae36e979983cdce5ff1` },
            { title: "Digimon Adventure Episode 60", url: `${STREAM_HOST}/dl/6ad75bd16e979983cdce5ff5` },
            { title: "Digimon Adventure Episode 61", url: `${STREAM_HOST}/dl/6ad75bd16e979983cdce5ff3` },
            { title: "Digimon Adventure Episode 62", url: `${STREAM_HOST}/dl/6ad75bd16e979983cdce5ff2` },
            { title: "Digimon Adventure Episode 63", url: `${STREAM_HOST}/dl/6ad75bd16e979983cdce5ff4` },
            { title: "Digimon Adventure Episode 64", url: `${STREAM_HOST}/dl/6ad75db06e979983cdce5ff8` },
            { title: "Digimon Adventure Episode 65", url: `${STREAM_HOST}/dl/6ad75db06e979983cdce5ffa` },
            { title: "Digimon Adventure Episode 66", url: `${STREAM_HOST}/dl/6ad75db06e979983cdce5ff9` },
            { title: "Digimon Adventure Episode 67", url: `${STREAM_HOST}/dl/6ad75db06e979983cdce5ff7` }
        ])
    },
    "digimon_fusion_catalog": {
        id: "digimon_fusion",
        catalogId: "digimon_fusion_catalog",
        name: "Digimon Fusion",
        poster: "https://i.postimg.cc/GpDYbhKF/Digimon-Fusion-DP.jpg",
        background: "https://i.postimg.cc/DzGs7y6P/Digimon-Fusion-WP.jpg",
        backgroundShape: "Landscape",
        description: "Taiki menubuhkan kumpulan bernama Xros Heart (Fusion Fighters). Dengan menggunakan kuasa DigiXros, Taiki membantu Shoutmon bergabung dengan Digimon lain untuk membentuk kombinasi pahlawan yang kuat bagi membebaskan wilayah-wilayah (Zones) Dunia Digital daripada cengkaman Bagra Army, sebuah empayar jahat yang diketuai oleh Lord Bagramon.",
        episodes: createEpisodes([
            { title: "Episode 01", url: `${STREAM_HOST}/dl/6ae313ac6e979983cdce6479` },
            { title: "Episode 02", url: `${STREAM_HOST}/dl/6ae313ac6e979983cdce647a` },
            { title: "Episode 03", url: `${STREAM_HOST}/dl/6ae313ac6e979983cdce6477` },
            { title: "Episode 04", url: `${STREAM_HOST}/dl/6ae313ac6e979983cdce647c` },
            { title: "Episode 05", url: `${STREAM_HOST}/dl/6ae313ac6e979983cdce6478` },
            { title: "Episode 06", url: `${STREAM_HOST}/dl/6ae313ac6e979983cdce647b` },
            { title: "Episode 07", url: `${STREAM_HOST}/dl/6ae313b56e979983cdce647f` },
            { title: "Episode 08", url: `${STREAM_HOST}/dl/6ae313b56e979983cdce647d` },
            { title: "Episode 09", url: `${STREAM_HOST}/dl/6ae313b56e979983cdce647e` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6ae3145b6e979983cdce6481` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6ae3145b6e979983cdce6482` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6ae3145b6e979983cdce6480` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6ae3145b6e979983cdce6483` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6ae3145b6e979983cdce6485` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6ae3145b6e979983cdce6484` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6ae314656e979983cdce6486` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6ae314656e979983cdce6488` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6ae314656e979983cdce6487` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6ae314656e979983cdce6489` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6ae315056e979983cdce648f` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6ae315056e979983cdce648e` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6ae315056e979983cdce648a` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6ae315056e979983cdce648d` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6ae315056e979983cdce648b` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6ae315056e979983cdce648c` },
            { title: "Episode 26", url: `${STREAM_HOST}/dl/6ae3150d6e979983cdce6490` },
            { title: "Episode 27", url: `${STREAM_HOST}/dl/6ae3150d6e979983cdce6492` },
            { title: "Episode 28", url: `${STREAM_HOST}/dl/6ae3150d6e979983cdce6491` },
            { title: "Episode 29", url: `${STREAM_HOST}/dl/6ae3150d6e979983cdce6493` },
            { title: "Episode 30", url: `${STREAM_HOST}/dl/6ae315b46e979983cdce6498` },
            { title: "Episode 31", url: `${STREAM_HOST}/dl/6ae315b46e979983cdce6496` },
            { title: "Episode 32", url: `${STREAM_HOST}/dl/6ae315b46e979983cdce6494` },
            { title: "Episode 33", url: `${STREAM_HOST}/dl/6ae315b46e979983cdce6495` },
            { title: "Episode 34", url: `${STREAM_HOST}/dl/6ae315b46e979983cdce6499` },
            { title: "Episode 35", url: `${STREAM_HOST}/dl/6ae315b46e979983cdce6497` },
            { title: "Episode 36", url: `${STREAM_HOST}/dl/6ae315bc6e979983cdce649a` },
            { title: "Episode 37", url: `${STREAM_HOST}/dl/6ae315bc6e979983cdce649c` },
            { title: "Episode 38", url: `${STREAM_HOST}/dl/6ae315bc6e979983cdce649b` },
            { title: "Episode 39", url: `${STREAM_HOST}/dl/6ae315bd6e979983cdce649d` },
            { title: "Episode 40", url: `${STREAM_HOST}/dl/6ae316566e979983cdce64a1` },
            { title: "Episode 41", url: `${STREAM_HOST}/dl/6ae316566e979983cdce649e` },
            { title: "Episode 42", url: `${STREAM_HOST}/dl/6ae316566e979983cdce649f` },
            { title: "Episode 43", url: `${STREAM_HOST}/dl/6ae316566e979983cdce64a3` },
            { title: "Episode 44", url: `${STREAM_HOST}/dl/6ae316566e979983cdce64a0` },
            { title: "Episode 45", url: `${STREAM_HOST}/dl/6ae316566e979983cdce64a2` },
            { title: "Episode 46", url: `${STREAM_HOST}/dl/6ae3165e6e979983cdce64a4` },
            { title: "Episode 47", url: `${STREAM_HOST}/dl/6ae316606e979983cdce64a7` },
            { title: "Episode 48", url: `${STREAM_HOST}/dl/6ae316606e979983cdce64a6` },
            { title: "Episode 49", url: `${STREAM_HOST}/dl/6ae316606e979983cdce64a5` },
            { title: "Episode 50", url: `${STREAM_HOST}/dl/6ae316e26e979983cdce64ac` },
            { title: "Episode 51", url: `${STREAM_HOST}/dl/6ae316e26e979983cdce64a8` },
            { title: "Episode 52", url: `${STREAM_HOST}/dl/6ae316e26e979983cdce64ab` },
            { title: "Episode 53", url: `${STREAM_HOST}/dl/6ae316e26e979983cdce64a9` },
            { title: "Episode 54", url: `${STREAM_HOST}/dl/6ae316e26e979983cdce64aa` },
            { title: "Episode 55", url: `${STREAM_HOST}/dl/6ae317166e979983cdce64ad` },
            { title: "Episode 56", url: `${STREAM_HOST}/dl/6ae317166e979983cdce64b1` },
            { title: "Episode 57", url: `${STREAM_HOST}/dl/6ae317166e979983cdce64b0` },
            { title: "Episode 58", url: `${STREAM_HOST}/dl/6ae317166e979983cdce64b2` },
            { title: "Episode 59", url: `${STREAM_HOST}/dl/6ae317166e979983cdce64ae` },
            { title: "Episode 60", url: `${STREAM_HOST}/dl/6ae317166e979983cdce64af` },
            { title: "Episode 61", url: `${STREAM_HOST}/dl/6ae3171f6e979983cdce64b3` },
            { title: "Episode 62", url: `${STREAM_HOST}/dl/6ae3171f6e979983cdce64b4` },
            { title: "Episode 63", url: `${STREAM_HOST}/dl/6ae3171f6e979983cdce64b5` },
            { title: "Episode 64", url: `${STREAM_HOST}/dl/6ae3171f6e979983cdce64b6` },
            { title: "Episode 65", url: `${STREAM_HOST}/dl/6ae317a56e979983cdce64b8` },
            { title: "Episode 66", url: `${STREAM_HOST}/dl/6ae317a56e979983cdce64bb` },
            { title: "Episode 67", url: `${STREAM_HOST}/dl/6ae317a56e979983cdce64b7` },
            { title: "Episode 68", url: `${STREAM_HOST}/dl/6ae317a56e979983cdce64ba` },
            { title: "Episode 69", url: `${STREAM_HOST}/dl/6ae317a56e979983cdce64bc` },
            { title: "Episode 70", url: `${STREAM_HOST}/dl/6ae317a56e979983cdce64b9` },
            { title: "Episode 71", url: `${STREAM_HOST}/dl/6ae317ad6e979983cdce64bd` },
            { title: "Episode 72", url: `${STREAM_HOST}/dl/6ae317af6e979983cdce64c0` },
            { title: "Episode 73", url: `${STREAM_HOST}/dl/6ae317af6e979983cdce64bf` },
            { title: "Episode 74", url: `${STREAM_HOST}/dl/6ae317af6e979983cdce64be` },
            { title: "Episode 75", url: `${STREAM_HOST}/dl/6ae317c26e979983cdce64c5` },
            { title: "Episode 76", url: `${STREAM_HOST}/dl/6ae317c26e979983cdce64c2` },
            { title: "Episode 77", url: `${STREAM_HOST}/dl/6ae317c26e979983cdce64c4` },
            { title: "Episode 78", url: `${STREAM_HOST}/dl/6ae317c26e979983cdce64c3` },
            { title: "Episode 79", url: `${STREAM_HOST}/dl/6ae317c26e979983cdce64c1` }
        ])
    },
    "digimon_tamers_catalog": {
        id: "digimon_tamers",
        catalogId: "digimon_tamers_catalog",
        name: "Digimon Tamers",
        poster: "https://i.postimg.cc/NMwXFqPf/Digimon-Tamers-DP.webp",
        background: "https://i.postimg.cc/gkxFJ6sF/Digimon-TAmers-WP-New.jpg",
        backgroundShape: "Landscape",
        description: "Kisah bermula apabila seorang budak lelaki berusia 10 tahun bernama Takato Matsuki (Matsuda Takato), yang sangat meminati permainan kad Digimon, menemui sebuah Blue Card misteri. Apabila dia menggesek kad tersebut pada alat pembaca kadnya, alat itu bertukar menjadi sebuah Digivice yang dipanggil D-Power (D-Ark). Keajaiban berlaku apabila lukisan Digimon ciptaannya sendiri, Guilmon, diimbas oleh D-Power lalu menjelma menjadi makhluk hidup yang nyata di dunia sebenar.",
        episodes: createEpisodes([
            { title: "Digimon Tamers 1.avi", url: `${STREAM_HOST}/dl/6ad76add6e979983cdce6002` },
            { title: "Digimon Tamers 2.avi", url: `${STREAM_HOST}/dl/6ad76add6e979983cdce5ffe` },
            { title: "Digimon Tamers 3.avi", url: `${STREAM_HOST}/dl/6ad76add6e979983cdce6000` },
            { title: "Digimon Tamers 4.avi", url: `${STREAM_HOST}/dl/6ad76add6e979983cdce5fff` },
            { title: "Digimon Tamers 5.avi", url: `${STREAM_HOST}/dl/6ad76add6e979983cdce6001` },
            { title: "Digimon Tamers 6.avi", url: `${STREAM_HOST}/dl/6ad76ade6e979983cdce6003` },
            { title: "Digimon Tamers 7.avi", url: `${STREAM_HOST}/dl/6ad76ae56e979983cdce6004` },
            { title: "Digimon Tamers 8.avi", url: `${STREAM_HOST}/dl/6ad76ae66e979983cdce6005` },
            { title: "Digimon Tamers 9.avi", url: `${STREAM_HOST}/dl/6ad76ae66e979983cdce6007` },
            { title: "Digimon Tamers 10.avi", url: `${STREAM_HOST}/dl/6ad76ae66e979983cdce6006` },
            { title: "Digimon Tamers 11.avi", url: `${STREAM_HOST}/dl/6ad76be46e979983cdce6008` },
            { title: "Digimon Tamers 12.avi", url: `${STREAM_HOST}/dl/6ad76be46e979983cdce6009` },
            { title: "Digimon Tamers 13.avi", url: `${STREAM_HOST}/dl/6ad76be46e979983cdce600a` },
            { title: "Digimon Tamers 14.avi", url: `${STREAM_HOST}/dl/6ad76be46e979983cdce600b` },
            { title: "Digimon Tamers 15.avi", url: `${STREAM_HOST}/dl/6ad76be46e979983cdce600d` },
            { title: "Digimon Tamers 16.avi", url: `${STREAM_HOST}/dl/6ad76be46e979983cdce600c` },
            { title: "Digimon Tamers 17.avi", url: `${STREAM_HOST}/dl/6ad76bef6e979983cdce600f` },
            { title: "Digimon Tamers 18.avi", url: `${STREAM_HOST}/dl/6ad76bef6e979983cdce600e` },
            { title: "Digimon Tamers 19.avi", url: `${STREAM_HOST}/dl/6ad76bef6e979983cdce6010` },
            { title: "Digimon Tamers 20.avi", url: `${STREAM_HOST}/dl/6ad76bef6e979983cdce6011` },
            { title: "Digimon Tamers 21.avi", url: `${STREAM_HOST}/dl/6ad76cfd6e979983cdce6015` },
            { title: "Digimon Tamers 22.avi", url: `${STREAM_HOST}/dl/6ad76cfd6e979983cdce6012` },
            { title: "Digimon Tamers 23.avi", url: `${STREAM_HOST}/dl/6ad76cfd6e979983cdce6013` },
            { title: "Digimon Tamers 24.avi", url: `${STREAM_HOST}/dl/6ad76cfe6e979983cdce6017` },
            { title: "Digimon Tamers 25.avi", url: `${STREAM_HOST}/dl/6ad76cfe6e979983cdce6016` },
            { title: "Digimon Tamers 26.avi", url: `${STREAM_HOST}/dl/6ad76cfd6e979983cdce6014` },
            { title: "Digimon Tamers 27.avi", url: `${STREAM_HOST}/dl/6ad76d066e979983cdce6018` },
            { title: "Digimon Tamers 28.avi", url: `${STREAM_HOST}/dl/6ad76d086e979983cdce601a` },
            { title: "Digimon Tamers 29.avi", url: `${STREAM_HOST}/dl/6ad76d086e979983cdce601b` },
            { title: "Digimon Tamers 30.avi", url: `${STREAM_HOST}/dl/6ad76d086e979983cdce6019` },
            { title: "Digimon Tamers 31.avi", url: `${STREAM_HOST}/dl/6ad76e2f6e979983cdce601e` },
            { title: "Digimon Tamers 32.avi", url: `${STREAM_HOST}/dl/6ad76e2f6e979983cdce601d` },
            { title: "Digimon Tamers 33.avi", url: `${STREAM_HOST}/dl/6ad76e2f6e979983cdce6020` },
            { title: "Digimon Tamers 34.avi", url: `${STREAM_HOST}/dl/6ad76e2f6e979983cdce6021` },
            { title: "Digimon Tamers 35.avi", url: `${STREAM_HOST}/dl/6ad76e2f6e979983cdce601c` },
            { title: "Digimon Tamers 36.avi", url: `${STREAM_HOST}/dl/6ad76e2f6e979983cdce601f` },
            { title: "Digimon Tamers 37.avi", url: `${STREAM_HOST}/dl/6ad76e376e979983cdce6023` },
            { title: "Digimon Tamers 38.avi", url: `${STREAM_HOST}/dl/6ad76e376e979983cdce6022` },
            { title: "Digimon Tamers 39.avi", url: `${STREAM_HOST}/dl/6ad76e376e979983cdce6025` },
            { title: "Digimon Tamers 40.avi", url: `${STREAM_HOST}/dl/6ad76e376e979983cdce6024` },
            { title: "Digimon Tamers 41.avi", url: `${STREAM_HOST}/dl/6ad76f0c6e979983cdce602a` },
            { title: "Digimon Tamers 42.avi", url: `${STREAM_HOST}/dl/6ad76f0c6e979983cdce602b` },
            { title: "Digimon Tamers 43.avi", url: `${STREAM_HOST}/dl/6ad76f0c6e979983cdce6028` },
            { title: "Digimon Tamers 44.avi", url: `${STREAM_HOST}/dl/6ad76f0c6e979983cdce6027` },
            { title: "Digimon Tamers 45.avi", url: `${STREAM_HOST}/dl/6ad76f0c6e979983cdce6026` },
            { title: "Digimon Tamers 46.avi", url: `${STREAM_HOST}/dl/6ad76f0c6e979983cdce6029` },
            { title: "Digimon Tamers 47.avi", url: `${STREAM_HOST}/dl/6ad76f156e979983cdce602e` },
            { title: "Digimon Tamers 48.avi", url: `${STREAM_HOST}/dl/6ad76f156e979983cdce602d` },
            { title: "Digimon Tamers 49.avi", url: `${STREAM_HOST}/dl/6ad76f156e979983cdce602c` },
            { title: "Digimon Tamers 50.avi", url: `${STREAM_HOST}/dl/6ad76f156e979983cdce602f` },
            { title: "Digimon Tamers 51.avi", url: `${STREAM_HOST}/dl/6ad76f1c6e979983cdce6030` }
        ])
    },
    "digimon_frontier_catalog": {
        id: "digimon_frontier",
        catalogId: "digimon_frontier_catalog",
        name: "Digimon Frontier",
        poster: "https://i.postimg.cc/nVkSJctz/Digimon-Frontier.jpg",
        background: "https://i.postimg.cc/gcDtWkPr/Digimon-Frontier-WP.avif",
        backgroundShape: "Landscape",
        description: "10 Pahlawan Legenda yang pernah menyelamatkan dunia ini pada zaman purba dengan mengorbankan nyawa mereka sendiri telah tiada. Dalam detik yang paling kritikal, roh-roh pahlawan legenda (Spirits) ini memanggil sekumpulan kanak-kanak manusia dari Dunia Sebenar menerusi mesej misteri di telefon bimbit mereka.",
        episodes: createEpisodes([
            { title: "Digimon Frontier Episode 5", url: "https://files.catbox.moe/d1rk16.mp4" },
            { title: "Digimon Frontier Episode 6", url: "https://files.catbox.moe/towgxx.mp4" },
            { title: "Digimon Frontier Episode 7", url: "https://files.catbox.moe/pof1f8.mp4" },
            { title: "Digimon Frontier Episode 8", url: "https://files.catbox.moe/0pzsha.mp4" },
            { title: "Digimon Frontier Episode 9", url: "https://files.catbox.moe/bq3a6n.mp4" },
            { title: "Digimon Frontier Episode 10", url: "https://files.catbox.moe/h53t2q.mp4" },
            { title: "Digimon Frontier Episode 11", url: "https://files.catbox.moe/9flbux.mp4" },
            { title: "Digimon Frontier Episode 12", url: "https://files.catbox.moe/n9yojg.mp4" },
            { title: "Digimon Frontier Episode 13", url: "https://files.catbox.moe/xujojm.mp4" },
            { title: "Digimon Frontier Episode 14", url: "https://files.catbox.moe/jhxl48.mp4" },
            { title: "Digimon Frontier Episode 15", url: "https://files.catbox.moe/bp1c6h.mp4" },
            { title: "Digimon Frontier Episode 16", url: "https://files.catbox.moe/qi06cc.mp4" },
            { title: "Digimon Frontier Episode 17", url: "https://files.catbox.moe/b28v21.mp4" },
            { title: "Digimon Frontier Episode 18", url: "https://files.catbox.moe/b66h5n.mp4" },
            { title: "Digimon Frontier Episode 19", url: "https://files.catbox.moe/waedqs.mp4" },
            { title: "Digimon Frontier Episode 20", url: "https://files.catbox.moe/lz445u.mp4" },
            { title: "Digimon Frontier Episode 22", url: "https://files.catbox.moe/h9fenw.mp4" },
            { title: "Digimon Frontier Episode 23", url: "https://files.catbox.moe/798vdw.mp4" },
            { title: "Digimon Frontier Episode 24", url: "https://files.catbox.moe/af5n39.mp4" },
            { title: "Digimon Frontier Episode 25", url: "https://files.catbox.moe/xw0dlc.mp4" },
            { title: "Digimon Frontier Episode 26", url: "https://files.catbox.moe/lmn8xy.mp4" },
            { title: "Digimon Frontier Episode 27", url: "https://files.catbox.moe/j9b3be.mp4" },
            { title: "Digimon Frontier Episode 28", url: "https://files.catbox.moe/wmflr5.mp4" },
            { title: "Digimon Frontier Episode 41", url: "https://files.catbox.moe/t9uom3.mp4" },
            { title: "Digimon Frontier Episode 42", url: "https://files.catbox.moe/7ilpfn.mp4" },
            { title: "Digimon Frontier Episode 43", url: "https://files.catbox.moe/png7kx.mp4" },
            { title: "Digimon Frontier Episode 44", url: "https://files.catbox.moe/lol623.mp4" },
            { title: "Digimon Frontier Episode 45", url: "https://files.catbox.moe/fgi2yj.mp4" },
            { title: "Digimon Frontier Episode 46", url: "https://files.catbox.moe/x3xk3y.mp4" },
            { title: "Digimon Frontier Episode 47", url: "https://files.catbox.moe/fyruao.mp4" },
            { title: "Digimon Frontier Episode 48", url: "https://files.catbox.moe/fuy9jb.mp4" },
            { title: "Digimon Frontier Episode 49", url: "https://files.catbox.moe/7lqobg.mp4" },
            { title: "Digimon Frontier Episode 50", url: "https://files.catbox.moe/5736bl.mp4" }
        ])
    },
    "chiquititas_song_catalog": {
        id: "chiquititas_song",
        catalogId: "chiquititas_song_catalog",
        name: "Chiquititas Song",
        poster: "https://i.postimg.cc/vZCqkvy4/Chiquititas-Tilin-Tilin-DP.png",
        background: "https://i.postimg.cc/nznNt30F/Chiquititas-WP.jpg",
        backgroundShape: "Landscape",
        episodes: createEpisodes([
            { title: "Abre Entra", url: "https://files.catbox.moe/37g4sv.mp4" },
            { title: "Compañero", url: "https://files.catbox.moe/5zb5qh.mp4" },
            { title: "Chiquititas", url: "https://files.catbox.moe/dwax3b.mp4" },
            { title: "Mi Chica", url: "https://files.catbox.moe/wdbau9.mp4" },
            { title: "PAN Y QUESO", url: "https://files.catbox.moe/0iau5b.mp4" },
            { title: "COMPAÑERO", url: "https://files.catbox.moe/77dweh.mp4" },
            { title: "TILIN TILIN", url: "https://files.catbox.moe/98s63q.mp4" },
            { title: "Pequeño Amor", url: "https://files.catbox.moe/t5bgpd.mp4" },
            { title: "Rebelde", url: "https://files.catbox.moe/l1sv7q.mp4" }
        ])
    },
    "chiquititas_catalog": {
        id: "chiquititas",
        catalogId: "chiquititas_catalog",
        name: "Chiquititas",
        poster: "https://i.postimg.cc/vZCqkvy4/Chiquititas-Tilin-Tilin-DP.png",
        background: "https://i.postimg.cc/nznNt30F/Chiquititas-WP.jpg",
        backgroundShape: "Landscape",
        description: "Di sebalik keceriaan itu, rumah agam tersebut menyimpan rahsia besar. Pemilik asal rumah itu, Rafael Sander, ialah seorang lelaki misteri yang menyembunyikan wajahnya di sebalik topeng akibat kemalangan ngeri masa lalu. Sepanjang musim ini, kanak-kanak tersebut berhadapan dengan pelbagai konflik: cabaran membesar, cinta monyet (seperti kisah cinta Camila & Felipe serta Luisana & Bautista), penemuan rahsia keluarga, sehinggalah usaha mempertahankan rumah mereka daripada ancaman orang dewasa yang tamak.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6ad8c1db6e979983cdce60fd` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6ad8c1db6e979983cdce60f9` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6ad8c1db6e979983cdce60fb` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6ad8c1db6e979983cdce60fa` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6ad8c1db6e979983cdce60fc` },
            { title: "Episode 6", url: `${STREAM_HOST}/dl/6ad8c1db6e979983cdce60f8` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6ad8c1e36e979983cdce60fe` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6ad8c1e56e979983cdce60ff` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6ad8c1e56e979983cdce6101` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6ad8c1e56e979983cdce6100` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6ad8c2356e979983cdce6103` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6ad8c2356e979983cdce6102` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6ad8c2356e979983cdce6106` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6ad8c2356e979983cdce6105` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6ad8c2356e979983cdce6107` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6ad8c2356e979983cdce6104` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6ad8c23d6e979983cdce6108` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6ad8c23d6e979983cdce6109` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6ad8c23d6e979983cdce610a` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6ad8c23d6e979983cdce610b` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6ad8c2976e979983cdce610e` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6ad8c2976e979983cdce610d` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6ad8c2976e979983cdce610f` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6ad8c2976e979983cdce6110` },
            { title: "Episode 26", url: `${STREAM_HOST}/dl/6ad8c2976e979983cdce610c` },
            { title: "Episode 28", url: `${STREAM_HOST}/dl/6ad8c2976e979983cdce6111` },
            { title: "Episode 29", url: `${STREAM_HOST}/dl/6ad8c2a06e979983cdce6112` },
            { title: "Episode 30", url: `${STREAM_HOST}/dl/6ad8c2a06e979983cdce6114` },
            { title: "Episode 31", url: `${STREAM_HOST}/dl/6ad8c2a06e979983cdce6113` },
            { title: "Episode 32", url: `${STREAM_HOST}/dl/6ad8c2a06e979983cdce6115` },
            { title: "Episode 34", url: `${STREAM_HOST}/dl/6ad8c2e56e979983cdce611a` },
            { title: "Episode 35", url: `${STREAM_HOST}/dl/6ad8c2e56e979983cdce6117` },
            { title: "Episode 36", url: `${STREAM_HOST}/dl/6ad8c2e56e979983cdce6116` },
            { title: "Episode 37", url: `${STREAM_HOST}/dl/6ad8c2e56e979983cdce6118` },
            { title: "Episode 38", url: `${STREAM_HOST}/dl/6ad8c2e56e979983cdce611b` },
            { title: "Episode 39", url: `${STREAM_HOST}/dl/6ad8c2e56e979983cdce6119` },
            { title: "Episode 40", url: `${STREAM_HOST}/dl/6ad8c2ee6e979983cdce611c` },
            { title: "Episode 41", url: `${STREAM_HOST}/dl/6ad8c2ee6e979983cdce611d` },
            { title: "Episode 42", url: `${STREAM_HOST}/dl/6ad8c2ee6e979983cdce611f` },
            { title: "Episode 43", url: `${STREAM_HOST}/dl/6ad8c2ee6e979983cdce611e` },
            { title: "Episode 44", url: `${STREAM_HOST}/dl/6ad8c3286e979983cdce6122` },
            { title: "Episode 45", url: `${STREAM_HOST}/dl/6ad8c3286e979983cdce6125` },
            { title: "Episode 46", url: `${STREAM_HOST}/dl/6ad8c3286e979983cdce6121` },
            { title: "Episode 47", url: `${STREAM_HOST}/dl/6ad8c3286e979983cdce6124` },
            { title: "Episode 48", url: `${STREAM_HOST}/dl/6ad8c3286e979983cdce6120` },
            { title: "Episode 49", url: `${STREAM_HOST}/dl/6ad8c3286e979983cdce6123` },
            { title: "Episode 50", url: `${STREAM_HOST}/dl/6ad8c3306e979983cdce6126` },
            { title: "Episode 51", url: `${STREAM_HOST}/dl/6ad8c3326e979983cdce6127` },
            { title: "Episode 52", url: `${STREAM_HOST}/dl/6ad8c3326e979983cdce6128` },
            { title: "Episode 53", url: `${STREAM_HOST}/dl/6ad8c3326e979983cdce6129` },
            { title: "Episode 54", url: `${STREAM_HOST}/dl/6ad8c35c6e979983cdce612b` },
            { title: "Episode 55", url: `${STREAM_HOST}/dl/6ad8c35c6e979983cdce612a` },
            { title: "Episode 56", url: `${STREAM_HOST}/dl/6ad8c35c6e979983cdce612d` },
            { title: "Episode 58", url: `${STREAM_HOST}/dl/6ad8c35c6e979983cdce612c` },
            { title: "Episode 59", url: `${STREAM_HOST}/dl/6ad8c35c6e979983cdce612f` },
            { title: "Episode 60", url: `${STREAM_HOST}/dl/6ad8c35c6e979983cdce612e` },
            { title: "Episode 61", url: `${STREAM_HOST}/dl/6ad8c36c6e979983cdce6130` },
            { title: "Episode 62", url: `${STREAM_HOST}/dl/6ad8c36e6e979983cdce6132` },
            { title: "Episode 63", url: `${STREAM_HOST}/dl/6ad8c36e6e979983cdce6131` },
            { title: "Episode 64", url: `${STREAM_HOST}/dl/6ad8c36e6e979983cdce6133` },
            { title: "Episode 66", url: `${STREAM_HOST}/dl/6ad8c39e6e979983cdce6137` },
            { title: "Episode 67", url: `${STREAM_HOST}/dl/6ad8c39e6e979983cdce6134` },
            { title: "Episode 68", url: `${STREAM_HOST}/dl/6ad8c39e6e979983cdce6138` },
            { title: "Episode 69", url: `${STREAM_HOST}/dl/6ad8c39e6e979983cdce6135` },
            { title: "Episode 70", url: `${STREAM_HOST}/dl/6ad8c39e6e979983cdce6136` },
            { title: "Episode 71", url: `${STREAM_HOST}/dl/6ad8c39e6e979983cdce6139` },
            { title: "Episode 73", url: `${STREAM_HOST}/dl/6ad8c3a76e979983cdce613a` },
            { title: "Episode 74", url: `${STREAM_HOST}/dl/6ad8c3ac6e979983cdce613c` },
            { title: "Episode 75", url: `${STREAM_HOST}/dl/6ad8c3ac6e979983cdce613b` },
            { title: "Episode 76", url: `${STREAM_HOST}/dl/6ad8c3b16e979983cdce613d` },
            { title: "Episode 77", url: `${STREAM_HOST}/dl/6ad8c3ec6e979983cdce6142` },
            { title: "Episode 78", url: `${STREAM_HOST}/dl/6ad8c3ec6e979983cdce613f` },
            { title: "Episode 79", url: `${STREAM_HOST}/dl/6ad8c3ec6e979983cdce6141` },
            { title: "Episode 80", url: `${STREAM_HOST}/dl/6ad8c3ec6e979983cdce6140` },
            { title: "Episode 81", url: `${STREAM_HOST}/dl/6ad8c3ec6e979983cdce6143` },
            { title: "Episode 82", url: `${STREAM_HOST}/dl/6ad8c3ec6e979983cdce613e` },
            { title: "Episode 83", url: `${STREAM_HOST}/dl/6ad8c3f46e979983cdce6145` },
            { title: "Episode 84", url: `${STREAM_HOST}/dl/6ad8c3f46e979983cdce6144` },
            { title: "Episode 85", url: `${STREAM_HOST}/dl/6ad8c3f46e979983cdce6147` },
            { title: "Episode 86", url: `${STREAM_HOST}/dl/6ad8c3f46e979983cdce6146` },
            { title: "Episode 87", url: `${STREAM_HOST}/dl/6ad8c4386e979983cdce614b` },
            { title: "Episode 88", url: `${STREAM_HOST}/dl/6ad8c4386e979983cdce6148` },
            { title: "Episode 89", url: `${STREAM_HOST}/dl/6ad8c4386e979983cdce614c` },
            { title: "Episode 90", url: `${STREAM_HOST}/dl/6ad8c4386e979983cdce614a` },
            { title: "Episode 91", url: `${STREAM_HOST}/dl/6ad8c4386e979983cdce614d` },
            { title: "Episode 92", url: `${STREAM_HOST}/dl/6ad8c4386e979983cdce6149` },
            { title: "Episode 93", url: `${STREAM_HOST}/dl/6ad8c4406e979983cdce614e` },
            { title: "Episode 94", url: `${STREAM_HOST}/dl/6ad8c4406e979983cdce614f` },
            { title: "Episode 97", url: `${STREAM_HOST}/dl/6ad8c4406e979983cdce6150` },
            { title: "Episode 98", url: `${STREAM_HOST}/dl/6ad8c4406e979983cdce6151` },
            { title: "Episode 101", url: `${STREAM_HOST}/dl/6ad8c4846e979983cdce6156` },
            { title: "Episode 103", url: `${STREAM_HOST}/dl/6ad8c4846e979983cdce6153` },
            { title: "Episode 104", url: `${STREAM_HOST}/dl/6ad8c4846e979983cdce6155` },
            { title: "Episode 105", url: `${STREAM_HOST}/dl/6ad8c4846e979983cdce6157` },
            { title: "Episode 107", url: `${STREAM_HOST}/dl/6ad8c4846e979983cdce6152` },
            { title: "Episode 108", url: `${STREAM_HOST}/dl/6ad8c4846e979983cdce6154` },
            { title: "Episode 109", url: `${STREAM_HOST}/dl/6ad8c48c6e979983cdce6158` },
            { title: "Episode 110", url: `${STREAM_HOST}/dl/6ad8c48c6e979983cdce615b` },
            { title: "Episode 111", url: `${STREAM_HOST}/dl/6ad8c48c6e979983cdce6159` },
            { title: "Episode 112", url: `${STREAM_HOST}/dl/6ad8c48c6e979983cdce615a` },
            { title: "Episode 114", url: `${STREAM_HOST}/dl/6ad8c4cc6e979983cdce6160` },
            { title: "Episode 115", url: `${STREAM_HOST}/dl/6ad8c4cc6e979983cdce615e` },
            { title: "Episode 117", url: `${STREAM_HOST}/dl/6ad8c4cc6e979983cdce615c` },
            { title: "Episode 118", url: `${STREAM_HOST}/dl/6ad8c4cc6e979983cdce615d` },
            { title: "Episode 120", url: `${STREAM_HOST}/dl/6ad8c4cc6e979983cdce6161` },
            { title: "Episode 121", url: `${STREAM_HOST}/dl/6ad8c4cc6e979983cdce615f` },
            { title: "Episode 122", url: `${STREAM_HOST}/dl/6ad8c4d46e979983cdce6162` },
            { title: "Episode 123", url: `${STREAM_HOST}/dl/6ad8c4d66e979983cdce6163` },
            { title: "Episode 124", url: `${STREAM_HOST}/dl/6ad8c4d66e979983cdce6164` },
            { title: "Episode 125", url: `${STREAM_HOST}/dl/6ad8c4d66e979983cdce6165` },
            { title: "Episode 126", url: `${STREAM_HOST}/dl/6ad8c5206e979983cdce616b` },
            { title: "Episode 127", url: `${STREAM_HOST}/dl/6ad8c5206e979983cdce6168` },
            { title: "Episode 128", url: `${STREAM_HOST}/dl/6ad8c5206e979983cdce616a` },
            { title: "Episode 130", url: `${STREAM_HOST}/dl/6ad8c5206e979983cdce6166` },
            { title: "Episode 131", url: `${STREAM_HOST}/dl/6ad8c5206e979983cdce6169` },
            { title: "Episode 132", url: `${STREAM_HOST}/dl/6ad8c5206e979983cdce6167` },
            { title: "Episode 134", url: `${STREAM_HOST}/dl/6ad8c5296e979983cdce616c` },
            { title: "Episode 135", url: `${STREAM_HOST}/dl/6ad8c5296e979983cdce616e` },
            { title: "Episode 136", url: `${STREAM_HOST}/dl/6ad8c5296e979983cdce616d` },
            { title: "Episode 139", url: `${STREAM_HOST}/dl/6ad8c5296e979983cdce616f` },
            { title: "Episode 140", url: `${STREAM_HOST}/dl/6ad8c53a6e979983cdce6173` },
            { title: "Episode 141", url: `${STREAM_HOST}/dl/6ad8c53a6e979983cdce6172` },
            { title: "Episode 142", url: `${STREAM_HOST}/dl/6ad8c53a6e979983cdce6171` },
            { title: "Episode 143", url: `${STREAM_HOST}/dl/6ad8c53a6e979983cdce6170` }
        ])
    },
    "shin_chan_catalog": {
        id: "shin_chan",
        catalogId: "shin_chan_catalog",
        name: "Crayon Shin Chan",
        poster: "https://i.postimg.cc/kGTdXWdR/Shin-Chan.jpg",
        background: "https://i.postimg.cc/tCyT1b7j/Shin-Chan-WP.jpg",
        backgroundShape: "Landscape",
        description: "Kisah ini berpusat pada kehidupan seharian Nohara Shinnosuke (Shin-chan), seorang budak lelaki berusia 5 tahun yang sangat nakal, kreatif, berimaginasi tinggi, dan gemar meniru kelakuan orang dewasa. Dia tinggal di pinggir bandar Kasukabe, Wilayah Saitama, bersama bapanya (Hiroshi), ibunya (Misae), adik perempuannya (Himawari), dan seekor anjing peliharaan bernama Shiro. Cerita ini dipenuhi dengan pelbagai ragam lucu dan huru-hara yang dicetuskan oleh gelagat spontan serta kelakuan kurang sopan Shin-chan di rumah, tadika (bersama Kumpulan Pertahanan Kasukabe), mahupun di tempat awam.",
        episodes: createEpisodes([
            "https://files.catbox.moe/b9vevt.mp4", "https://files.catbox.moe/7rag9o.mp4", "https://files.catbox.moe/m0edfm.mp4", "https://files.catbox.moe/pynt42.mp4", "https://files.catbox.moe/7yvdbd.mp4",
            "https://files.catbox.moe/w8huc2.mkv", "https://files.catbox.moe/nejhuv.mp4", "https://files.catbox.moe/8ca3cr.mp4", "https://files.catbox.moe/02x60l.mkv", "https://files.catbox.moe/8ea559.mp4",
            "https://files.catbox.moe/9t4e7x.webm", "https://files.catbox.moe/kk607w.mkv", "https://files.catbox.moe/tjtmqn.mkv", "https://files.catbox.moe/wy4h99.mkv", "https://files.catbox.moe/wdv2kj.mp4",
            "https://files.catbox.moe/t116gx.mkv", "https://files.catbox.moe/f5vmu3.mkv", "https://files.catbox.moe/vq10zw.mkv", "https://files.catbox.moe/et4g5i.mkv", "https://files.catbox.moe/rtzjgh.mp4",
            "https://files.catbox.moe/c2zjxo.mkv", "https://files.catbox.moe/oqiy2x.mkv", "https://files.catbox.moe/4hawk0.webm", "https://files.catbox.moe/tvef9t.mp4", "https://files.catbox.moe/ikw3wi.mkv"
        ])
    },
    "siri_sirah_catalog": {
        id: "siri_sirah",
        catalogId: "siri_sirah_catalog",
        name: "Siri Sirah",
        poster: "https://i.postimg.cc/TPYrCJfc/Siri_SIrah.jpg",
        posterShape: "poster",
        description: "Koleksi Episod Siri Sirah.",
        episodes: createEpisodes([
            { title: "Episode 1", url: `${STREAM_HOST}/dl/6ad7801b6e979983cdce6076` },
            { title: "Episode 2", url: `${STREAM_HOST}/dl/6ad780186e979983cdce6075` },
            { title: "Episode 3", url: `${STREAM_HOST}/dl/6ad780166e979983cdce6074` },
            { title: "Episode 4", url: `${STREAM_HOST}/dl/6ad780166e979983cdce6073` },
            { title: "Episode 5", url: `${STREAM_HOST}/dl/6ad780106e979983cdce6072` },
            { title: "Episode 7", url: `${STREAM_HOST}/dl/6ad780106e979983cdce6071` },
            { title: "Episode 8", url: `${STREAM_HOST}/dl/6ad7800a6e979983cdce606f` },
            { title: "Episode 9", url: `${STREAM_HOST}/dl/6ad7800a6e979983cdce6070` },
            { title: "Episode 10", url: `${STREAM_HOST}/dl/6ad77fe56e979983cdce606e` },
            { title: "Episode 11", url: `${STREAM_HOST}/dl/6ad77fe46e979983cdce606d` },
            { title: "Episode 12", url: `${STREAM_HOST}/dl/6ad77fdf6e979983cdce606c` },
            { title: "Episode 13", url: `${STREAM_HOST}/dl/6ad77fdf6e979983cdce606a` },
            { title: "Episode 14", url: `${STREAM_HOST}/dl/6ad77fdf6e979983cdce606b` },
            { title: "Episode 15", url: `${STREAM_HOST}/dl/6ad77fdb6e979983cdce6069` },
            { title: "Episode 16", url: `${STREAM_HOST}/dl/6ad77fda6e979983cdce6068` },
            { title: "Episode 17", url: `${STREAM_HOST}/dl/6ad77fda6e979983cdce6067` },
            { title: "Episode 18", url: `${STREAM_HOST}/dl/6ad77fd46e979983cdce6066` },
            { title: "Episode 19", url: `${STREAM_HOST}/dl/6ad77fd46e979983cdce6065` },
            { title: "Episode 20", url: `${STREAM_HOST}/dl/6ad77fce6e979983cdce6063` },
            { title: "Episode 21", url: `${STREAM_HOST}/dl/6ad77fce6e979983cdce6064` },
            { title: "Episode 22", url: `${STREAM_HOST}/dl/6ad77fa26e979983cdce6062` },
            { title: "Episode 23", url: `${STREAM_HOST}/dl/6ad77fa16e979983cdce6061` },
            { title: "Episode 24", url: `${STREAM_HOST}/dl/6ad77fa16e979983cdce6060` },
            { title: "Episode 25", url: `${STREAM_HOST}/dl/6ad77f9c6e979983cdce605f` },
            { title: "Episode 26", url: `${STREAM_HOST}/dl/6ad77f966e979983cdce605e` },
            { title: "Episode 27", url: `${STREAM_HOST}/dl/6ad77f966e979983cdce605d` },
            { title: "Episode 28", url: `${STREAM_HOST}/dl/6ad77f966e979983cdce605c` },
            { title: "Episode 29", url: `${STREAM_HOST}/dl/6ad77f926e979983cdce605b` },
            { title: "Episode 30", url: `${STREAM_HOST}/dl/6ad77f666e979983cdce605a` },
            { title: "Episode 31", url: `${STREAM_HOST}/dl/6ad77f666e979983cdce6059` },
            { title: "Episode 32", url: `${STREAM_HOST}/dl/6ad77f656e979983cdce6058` },
            { title: "Episode 33", url: `${STREAM_HOST}/dl/6ad77f616e979983cdce6057` },
            { title: "Episode 34", url: `${STREAM_HOST}/dl/6ad77f616e979983cdce6056` },
            { title: "Episode 35", url: `${STREAM_HOST}/dl/6ad77f606e979983cdce6055` },
            { title: "Episode 36", url: `${STREAM_HOST}/dl/6ad77f5c6e979983cdce6054` },
            { title: "Episode 37", url: `${STREAM_HOST}/dl/6ad77f5b6e979983cdce6053` },
            { title: "Episode 38", url: `${STREAM_HOST}/dl/6ad77f556e979983cdce6052` },
            { title: "Episode 39", url: `${STREAM_HOST}/dl/6ad77f556e979983cdce6051` },
            { title: "Episode 40", url: `${STREAM_HOST}/dl/6ad77f2a6e979983cdce6050` },
            { title: "Episode 41", url: `${STREAM_HOST}/dl/6ad77f2a6e979983cdce604f` },
            { title: "Episode 42", url: `${STREAM_HOST}/dl/6ad77f2a6e979983cdce604e` },
            { title: "Episode 43", url: `${STREAM_HOST}/dl/6ad77f2a6e979983cdce604d` },
            { title: "Episode 44", url: `${STREAM_HOST}/dl/6ad77f256e979983cdce604c` },
            { title: "Episode 45", url: `${STREAM_HOST}/dl/6ad77f246e979983cdce604b` },
            { title: "Episode 46", url: `${STREAM_HOST}/dl/6ad77f1f6e979983cdce604a` },
            { title: "Episode 47", url: `${STREAM_HOST}/dl/6ad77f1f6e979983cdce6049` },
            { title: "Episode 48", url: `${STREAM_HOST}/dl/6ad77f196e979983cdce6048` },
            { title: "Episode 49", url: `${STREAM_HOST}/dl/6ad77f196e979983cdce6047` },
            { title: "Episode 50", url: `${STREAM_HOST}/dl/6ad77f196e979983cdce6046` },
            { title: "Episode 51", url: `${STREAM_HOST}/dl/6ad77f136e979983cdce6045` },
            { title: "Episode 52", url: `${STREAM_HOST}/dl/6ad77f0e6e979983cdce6044` },
            { title: "Episode 53", url: `${STREAM_HOST}/dl/6ad77f0e6e979983cdce6043` },
            { title: "Episode 54", url: `${STREAM_HOST}/dl/6ad77f0e6e979983cdce6042` },
            { title: "Episode 55", url: `${STREAM_HOST}/dl/6ad77f086e979983cdce6041` },
            { title: "Episode 56", url: `${STREAM_HOST}/dl/6ad77f076e979983cdce603f` },
            { title: "Episode 57", url: `${STREAM_HOST}/dl/6ad77f076e979983cdce6040` },
            { title: "Episode 58", url: `${STREAM_HOST}/dl/6ad77f056e979983cdce603e` },
            { title: "Episode 59", url: `${STREAM_HOST}/dl/6ad77f056e979983cdce603d` },
            { title: "Episode 60", url: `${STREAM_HOST}/dl/6ad77f056e979983cdce603c` },
            { title: "Episode 61", url: `${STREAM_HOST}/dl/6ad77f056e979983cdce603b` }
        ])
    },
    "akhir_zaman_catalog": {
        id: "akhir_zaman",
        catalogId: "akhir_zaman_catalog",
        name: "Kisah Hidup Akhir Zaman",
        poster: "https://i.postimg.cc/rynQfgCF/Akhir-Zaman.jpg",
        posterShape: "poster",
        description: "Koleksi Episod Kisah Hidup Akhir Zaman.",
        episodes: createEpisodes([
            "https://files.catbox.moe/dmr7ys.mp4", "https://files.catbox.moe/c05jnq.mp4", "https://files.catbox.moe/sakwy1.mp4", "https://files.catbox.moe/8jcm2b.mp4", "https://files.catbox.moe/fcw4me.mp4",
            "https://files.catbox.moe/ve28k8.mp4", "https://files.catbox.moe/cml4j6.mp4", "https://files.catbox.moe/t9ta6d.mp4", "https://files.catbox.moe/991agh.mp4", "https://files.catbox.moe/grbp8x.mp4",
            "https://files.catbox.moe/38soe6.mp4", "https://files.catbox.moe/ler4ag.mp4", "https://files.catbox.moe/ec9jc1.mp4", "https://files.catbox.moe/e9ckzj.mp4", "https://files.catbox.moe/rwzqqg.mp4",
            "https://files.catbox.moe/lfr6y0.mp4", "https://files.catbox.moe/5lod2l.mp4", "https://files.catbox.moe/2u6jeq.mp4", "https://files.catbox.moe/y4dfdt.mp4", "https://files.catbox.moe/cupuua.mp4",
            "https://files.catbox.moe/xlfvy0.mp4", "https://files.catbox.moe/svf1ld.mp4", "https://files.catbox.moe/6dmnwt.mp4", "https://files.catbox.moe/xz9p55.mp4", "https://files.catbox.moe/1oeizf.mp4",
            "https://files.catbox.moe/1dpc4q.mp4", "https://files.catbox.moe/wkk250.mp4", "https://files.catbox.moe/ns7oqa.mp4", "https://files.catbox.moe/rikryy.mp4", "https://files.catbox.moe/v6lwxq.mp4",
            "https://files.catbox.moe/qoyb9l.mp4", "https://files.catbox.moe/fa0z2q.mp4", "https://files.catbox.moe/rb6n12.mp4", "https://files.catbox.moe/p5a2ds.mp4", "https://files.catbox.moe/n4ro3i.mp4",
            "https://files.catbox.moe/f926el.mp4", "https://files.catbox.moe/sa6gq8.mp4", "https://files.catbox.moe/edzksm.mp4", "https://files.catbox.moe/g6gx07.mp4",
            "https://files.catbox.moe/h3rt2t.mp4", "https://files.catbox.moe/7zgjio.mp4", "https://files.catbox.moe/nianl8.mp4", "https://files.catbox.moe/pk2ija.mp4", "https://files.catbox.moe/g6vzed.mp4",
            "https://files.catbox.moe/2xr42f.mp4", "https://files.catbox.moe/i636mu.mp4", "https://files.catbox.moe/2dh0kw.mp4", "https://files.catbox.moe/osqos3.mp4", "https://files.catbox.moe/clraet.mp4",
            "https://files.catbox.moe/02vue5.mp4", "https://files.catbox.moe/oih2ce.mp4", "https://files.catbox.moe/opbp3x.mp4", "https://files.catbox.moe/47lmkc.mp4", "https://files.catbox.moe/gh1des.mp4",
            "https://files.catbox.moe/ny4qqj.mp4", "https://files.catbox.moe/v3yvoh.mp4", "https://files.catbox.moe/2bmvek.mp4", "https://files.catbox.moe/rnkq3v.mp4", "https://files.catbox.moe/a6i9oa.mp4",
            "https://files.catbox.moe/wj13np.mp4", "https://files.catbox.moe/2uk8a3.mp4"
        ])
    },
    "hada_kiddy_catalog": {
        id: "hada_kiddy",
        catalogId: "hada_kiddy_catalog",
        name: "HaDa Kiddy",
        poster: "https://i.postimg.cc/8C8hy9ms/Ha-Da-Kiddy.jpg",
        background: "https://i.postimg.cc/gkdJwprb/Ha-Da-Kiddy-WP.jpg",
        backgroundShape: "Landscape",
        description: "Kisah Perjuangan 25 Nabi & Rasul.",
        episodes: createEpisodes([
            { title: "Nabi Adam AS - Manusia Pertama Di Bumi", url: `${STREAM_HOST}/dl/6ad727eb6e979983cdce5f8d` },
            { title: "Nabi Ibrahim AS - Dilempar Ke Dalam Api", url: `${STREAM_HOST}/dl/6ad727eb6e979983cdce5f8a` },
            { title: "Nabi Ismail AS - Perintah Menyembelih", url: `${STREAM_HOST}/dl/6ad727eb6e979983cdce5f8c` },
            { title: "Nabi Musa AS - Melawan Firaun", url: `${STREAM_HOST}/dl/6ad727eb6e979983cdce5f8b` },
            { title: "Nabi Nuh AS - Bahtera Menyelamat Dari Banjir Besar", url: `${STREAM_HOST}/dl/6ad727eb6e979983cdce5f8e` },
            { title: "Nabi Soleh AS - Unta Nabi Soleh", url: `${STREAM_HOST}/dl/6ad727ec6e979983cdce5f8f` },
            { title: "Nabi Sulaiman AS - Semut Bercakap Dengan Nabi Sulaiman", url: `${STREAM_HOST}/dl/6ad727f36e979983cdce5f90` },
            { title: "Nabi Sulaiman AS - Singgahsana Ratu Balqis", url: `${STREAM_HOST}/dl/6ad727f36e979983cdce5f91` },
            { title: "Nabi Syuaib AS - Kaum Yang Menipu", url: `${STREAM_HOST}/dl/6ad727f46e979983cdce5f92` },
            { title: "Nabi Yunus AS - Ditelan Ikan Nun", url: `${STREAM_HOST}/dl/6ad727f46e979983cdce5f93` },
            { title: "Nabi Yusuf AS - Dari Perigi Gelap Ke Takhta Mesir", url: `${STREAM_HOST}/dl/6ad72c2b6e979983cdce5f97` },
            { title: "Nabi Yusuf AS - Momen Dijual Paling Menyentuh Hati", url: `${STREAM_HOST}/dl/6ad72c2b6e979983cdce5f96` },
            { title: "Nabi Yusuf AS - Akhirnya Menjadi Kenyataan", url: `${STREAM_HOST}/dl/6ad72c2b6e979983cdce5f94` },
            { title: "Rahsia Air Zam-Zam Keluar Dari Tanah", url: `${STREAM_HOST}/dl/6ad72c2b6e979983cdce5f95` }
        ])
    },
    "kd_malay_catalog": {
        id: "kd_malay",
        catalogId: "kd_malay_catalog",
        name: "Kids Delights (Malay Vers)",
        poster: "https://i.postimg.cc/FsKg8hfM/KD.jpg",
        background: "https://i.postimg.cc/vHMB1yDd/Kids-Deligh-WP.jpg",
        backgroundShape: "Landscape",
        description: "Kisah Perjuangan 25 Nabi & Rasul Versi Bahasa Melayu.",
        episodes: createEpisodes([
            { title: "Nabi Nuh AS - Bahtera Penyelamat", poster: "https://i.postimg.cc/qMvTZV7c/Kisah-Nabi-Nuh.jpg", url: `${STREAM_HOST}/dl/6ace52a16e979983cdce5cf3` },
            { title: "Nabi Ibrahim AS - Kekasih Allah Yang Taat", poster: "https://i.postimg.cc/wTTfd9Lp/Kisah-Nabi-Ibrahim.jpg", url: `${STREAM_HOST}/dl/6ace52a16e979983cdce5cf1` },
            { title: "Nabi Ismail AS - Mukjizat Air Zam-Zam & Pengorbanan Besar", poster: "https://i.postimg.cc/bwMptCpb/Kisah-Nabi-Ismail.jpg", url: `${STREAM_HOST}/dl/6ace52a16e979983cdce5cf4` },
            { title: "Nabi Ishaq AS - Rezeki Anak Di Usia Senja", poster: "https://i.postimg.cc/xTwz3R04/Kisah-Nabi-Ishaq.jpg", url: `${STREAM_HOST}/dl/6ace52a16e979983cdce5cf2` },
            { title: "Nabi Yaaqub AS - Sifat Sabar Dan Wasiat Tauhid", poster: "https://i.postimg.cc/Tw30v9WR/Kisah-Nabi-Yaaqub.jpg", url: `${STREAM_HOST}/dl/6ace52a16e979983cdce5cf0` },
            { title: "Nabi Yusuf AS - Dari Perigi Gelap Ke Takhta Mesir", poster: "https://i.postimg.cc/PqzVjJ3D/Kisah-Nabi-Yusuf.jpg", url: `${STREAM_HOST}/dl/6ace52a26e979983cdce5cf5` },
            { title: "Nabi Yunus AS - Keajaiban Di Dalam Perut Ikan Nun", poster: "https://i.postimg.cc/bJtg3v77/image-c1cc390e.jpg", url: `${STREAM_HOST}/dl/6ace52aa6e979983cdce5cf6` }
        ])
    },
    "kd_eng_catalog": {
        id: "kd_eng",
        catalogId: "kd_eng_catalog",
        name: "Kids Delights (Eng Vers)",
        poster: "https://i.postimg.cc/FsKg8hfM/KD.jpg",
        background: "https://i.postimg.cc/vHMB1yDd/Kids-Deligh-WP.jpg",
        backgroundShape: "Landscape",
        description: "Kisah Perjuangan 25 Nabi & Rasul Versi Bahasa Inggeris.",
        episodes: createEpisodes([
            { title: "Prophet Nuh AS - The Ark Of Safety", poster: "https://i.postimg.cc/qMvTZV7c/Kisah-Nabi-Nuh.jpg", url: `${STREAM_HOST}/dl/6ace53996e979983cdce5cf9` },
            { title: "Prophet Ibrahim AS - The Close Friend Of Allah", poster: "https://i.postimg.cc/wTTfd9Lp/Kisah-Nabi-Ibrahim.jpg", url: `${STREAM_HOST}/dl/6ace53996e979983cdce5cf7` },
            { title: "Prophet Ismail AS - The Miracle Of Zam Zam & A Great Sacrifice", poster: "https://i.postimg.cc/bwMptCpb/Kisah-Nabi-Ismail.jpg", url: `${STREAM_HOST}/dl/6ace53996e979983cdce5cfb` },
            { title: "Prophet Ishaq AS - The Miracle Of A Long-Awaited Child", poster: "https://i.postimg.cc/xTwz3R04/Kisah-Nabi-Ishaq.jpg", url: `${STREAM_HOST}/dl/6ace53996e979983cdce5cfa` },
            { title: "Prophet Yaaqub AS - Patience And The Legacy Of Tawhid", poster: "https://i.postimg.cc/Tw30v9WR/Kisah-Nabi-Yaaqub.jpg", url: `${STREAM_HOST}/dl/6ace53996e979983cdce5cf8` },
            { title: "Prophet Yusuf AS - From Dark Well To The Throne Of Egypt", poster: "https://i.postimg.cc/PqzVjJ3D/Kisah-Nabi-Yusuf.jpg", url: `${STREAM_HOST}/dl/6ace53a16e979983cdce5cfd` },
            { title: "Prophet Yunus AS - A Miracle In The Belly Of The Fish", poster: "https://i.postimg.cc/bJtg3v77/image-c1cc390e.jpg", url: `${STREAM_HOST}/dl/6ace53996e979983cdce5cfc` }
         ])
    }
};

// ==========================================
// LAKSANA GABUNG MUSIM (jalan sekali semasa worker bermula)
// ==========================================
(function mergeSeasons() {
    for (const g of SEASON_GROUPS) {
        const parts = g.seasons.map((key, i) => ({ key, season: i + 1, cat: seriesDatabase[key] }));
        const found = parts.filter(p => p.cat && !p.cat.isMulti);
        parts.filter(p => !p.cat).forEach(p => console.warn(`Gabung musim "${g.name}": kunci tiada dalam database: ${p.key}`));
        if (!found.length) continue;

        const first = found[0];
        // Gambar setiap musim (poster & background asal musim itu)
        const seasonArt = {};
        for (const p of parts) {
            if (p.cat) seasonArt[p.season] = { poster: p.cat.poster, background: p.cat.background };
        }
        // Thumbnail episod: guna background musim; kalau semua musim kongsi background yang sama, guna poster
        const bgs = new Set(Object.values(seasonArt).map(a => a.background).filter(Boolean));
        const thumbOf = a => (bgs.size > 1 ? (a.background || a.poster) : (a.poster || a.background));

        const episodes = [];
        let offset = 0;
        for (const p of found) {
            const list = p.cat.episodes || [];
            const thumb = thumbOf(seasonArt[p.season]);
            for (const e of list) {
                episodes.push({ ...e, season: p.season, episode: g.continuous ? offset + e.episode : e.episode, thumbnail: e.thumbnail || thumb });
            }
            if (g.continuous) offset += list.length;
        }
        const merged = { ...first.cat, name: g.name, episodes, seasonArt };
        if (g.poster) merged.poster = g.poster;
        if (g.description !== undefined) merged.description = g.description;
        seriesDatabase[first.key] = merged;

        // buang musim lain dari database, manifest dan senarai kumpulan
        const removed = new Set();
        for (const p of found.slice(1)) {
            delete seriesDatabase[p.key];
            removed.add(p.key);
            if (p.cat.catalogId) removed.add(p.cat.catalogId);
        }
        manifest.catalogs = manifest.catalogs.filter(c => !removed.has(c.id));
        for (const c of manifest.catalogs) {
            if (c.id === first.key || c.id === first.cat.catalogId) c.name = g.name;
        }
        for (const grp of CATALOG_GROUPS) grp.members = grp.members.filter(k => !removed.has(k));
    }
})();

// ==========================================
// 3. ROUTING (CLOUDFLARE WORKERS)
// ==========================================
// Index untuk carian pantas (sama logik dengan versi Express: padanan pertama menang)
const itemById = new Map();
const seriesById = new Map();
for (const cat of Object.values(seriesDatabase)) {
    if (cat.isMulti) {
        for (const item of cat.items) {
            if (!itemById.has(item.id)) itemById.set(item.id, item);
        }
    } else if (!seriesById.has(cat.id)) {
        seriesById.set(cat.id, cat);
    }
}

// Carian katalog: ikut kunci database dahulu, kemudian ikut catalogId
// (membetulkan kes seperti digimon_2020_catalog vs digimon_adventure2020_catalog)
const catalogLookup = new Map(Object.entries(seriesDatabase));
for (const cat of Object.values(seriesDatabase)) {
    if (cat.catalogId && !catalogLookup.has(cat.catalogId)) catalogLookup.set(cat.catalogId, cat);
}

// ==========================================
// INDEKS CARIAN (untuk fungsi "search" dalam Nuvio/Stremio)
// ==========================================
const SEARCH_CATALOG_ID = "daryz_search";
const SEARCH_LIMIT = 100;
const normText = t => String(t || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const searchIndex = [];
{
    const seen = new Set();
    const add = e => {
        if (!e || !e.id || !e.name || seen.has(e.id)) return;
        seen.add(e.id);
        const words = normText(e.name);
        searchIndex.push({
            meta: { id: e.id, type: "series", name: e.name, poster: e.poster, description: e.description },
            words,
            compact: words.replace(/ /g, "")
        });
    };
    for (const cat of Object.values(seriesDatabase)) {
        if (cat.isMulti) (cat.items || []).forEach(add);
        else add(cat);
    }
}

// ==========================================
// LOGIK KUMPULAN KATALOG
// ==========================================
const GROUP_BY_ID = new Map(CATALOG_GROUPS.map(g => [g.id, g]));
const HIDDEN_KEYS = new Set(CATALOG_GROUPS.flatMap(g => g.members));
{
    const hiddenIds = new Map(); // id katalog (kunci / catalogId) -> kumpulan
    for (const g of CATALOG_GROUPS) {
        for (const key of g.members) {
            const cat = catalogLookup.get(key);
            if (!cat) { console.warn(`Kumpulan "${g.id}": kunci tidak wujud dalam database: ${key}`); continue; }
            hiddenIds.set(key, g);
            if (cat.catalogId) hiddenIds.set(cat.catalogId, g);
        }
    }
    const placed = new Set();
    const result = [];
    for (const c of manifest.catalogs) {
        const g = hiddenIds.get(c.id);
        if (!g) { result.push(c); continue; }
        if (!placed.has(g.id)) { placed.add(g.id); result.push({ type: "series", id: g.id, name: g.name }); }
    }
    for (const g of CATALOG_GROUPS) {
        if (placed.has(g.id)) continue;
        const si = result.findIndex(c => c.id === SEARCH_CATALOG_ID);
        const entry = { type: "series", id: g.id, name: g.name };
        if (si >= 0) result.splice(si, 0, entry); else result.push(entry);
    }
    manifest.catalogs = result;
}

function groupMetas(g) {
    const metas = [];
    const seen = new Set();
    for (const key of g.members) {
        const cat = catalogLookup.get(key);
        if (!cat) continue;
        for (const e of (cat.isMulti ? cat.items : [cat])) {
            if (!e || !e.id || seen.has(e.id)) continue;
            seen.add(e.id);
            metas.push({ id: e.id, type: "series", name: e.name, poster: e.poster, description: e.description });
        }
    }
    if (g.sortAZ) metas.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return metas;
}

// ==========================================
// HALAMAN CONFIGURE  (/<token>/configure)
// Pengguna boleh: susun semula katalog, sorok katalog, salin pautan addon, dan pasang terus.
// Pilihan disimpan setiap token dalam KV "TOKENS" (kunci "prefs~<token>") dan terpakai pada manifest.
// Butang "Configure" dalam Stremio muncul kerana manifest ada behaviorHints.configurable.
// ==========================================
manifest.behaviorHints = { ...(manifest.behaviorHints || {}), configurable: true };

const PREFS_MAX_BYTES = 20000;

// Latar halaman configure: pemandangan gaya Ghibli (SVG) disediakan.
// Nak guna gambar sendiri? Letak pautan https gambar di bawah (cth "https://i.postimg.cc/xxxx/latar.jpg"). Kosong = guna pemandangan SVG.
const CONFIGURE_BG_URL = "";


async function readTokenRecord(env, token) {
    if (!env.TOKENS || !/^[a-z0-9]*_[a-z0-9]{5,}$/.test(token || "")) return { state: "invalid" };
    const raw = await env.TOKENS.get(token);
    if (!raw) return { state: "invalid" };
    let rec;
    try { rec = JSON.parse(raw); } catch (e) { return { state: "invalid" }; }
    if (typeof rec.exp !== "number") return { state: "invalid" };
    return { state: Date.now() > rec.exp ? "expired" : "active", rec };
}

async function loadUserPrefs(env, token) {
    try {
        const p = env.TOKENS ? await env.TOKENS.get("prefs~" + token, "json") : null;
        return { order: Array.isArray(p && p.order) ? p.order : [], hidden: Array.isArray(p && p.hidden) ? p.hidden : [] };
    } catch (e) {
        return { order: [], hidden: [] };
    }
}

// Susun semua katalog (kecuali carian) ikut pilihan pengguna; katalog baharu diletak di hujung
function orderCatalogs(cats, prefs) {
    const search = cats.find(c => c.id === SEARCH_CATALOG_ID);
    const rest = cats.filter(c => c.id !== SEARCH_CATALOG_ID);
    const byId = new Map(rest.map(c => [c.id, c]));
    const ordered = [];
    const seen = new Set();
    for (const id of prefs.order || []) {
        const c = byId.get(id);
        if (c && !seen.has(id)) { ordered.push(c); seen.add(id); }
    }
    for (const c of rest) if (!seen.has(c.id)) ordered.push(c);
    if (search) ordered.push(search);
    return ordered;
}

function applyUserPrefs(m, prefs) {
    if (!prefs || (!prefs.order.length && !prefs.hidden.length)) return m;
    const hidden = new Set(prefs.hidden);
    const cats = orderCatalogs(m.catalogs, prefs).filter(c => c.id === SEARCH_CATALOG_ID || !hidden.has(c.id));
    return { ...m, catalogs: cats };
}

async function handlePrefsApi(request, env, token) {
    const tr = await readTokenRecord(env, token);
    if (tr.state !== "active") return json({ error: "Token tidak aktif." }, 403);

    if (request.method === "GET") return json(await loadUserPrefs(env, token));
    if (request.method !== "POST") return json({ error: "Method tidak dibenarkan" }, 405);

    const text = await request.text();
    if (text.length > PREFS_MAX_BYTES) return json({ error: "Data terlalu besar" }, 413);
    let body;
    try { body = JSON.parse(text); } catch (e) { return json({ error: "JSON tidak sah" }, 400); }

    if (body && body.reset) {
        await env.TOKENS.delete("prefs~" + token);
        return json({ ok: true, reset: true });
    }
    const valid = new Set(manifest.catalogs.map(c => c.id).filter(id => id !== SEARCH_CATALOG_ID));
    const clean = arr => [...new Set((Array.isArray(arr) ? arr : []).filter(id => typeof id === "string" && valid.has(id)))];
    const order = clean(body && body.order);
    const hidden = clean(body && body.hidden);
    if (!order.length && !hidden.length) await env.TOKENS.delete("prefs~" + token);
    else await env.TOKENS.put("prefs~" + token, JSON.stringify({ order, hidden, updated: Date.now() }));
    return json({ ok: true, order: order.length, hidden: hidden.length });
}

async function handleConfigurePage(request, env, token) {
    const url = new URL(request.url);
    const tr = await readTokenRecord(env, token);
    if (tr.state === "invalid") {
        return new Response("Pautan tidak sah. Guna pautan addon peribadi anda.", { status: 403, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
    const prefs = await loadUserPrefs(env, token);
    const base = await getManifest(env);
    const hidden = new Set(prefs.hidden);
    const catalogs = orderCatalogs(base.catalogs, prefs)
        .filter(c => c.id !== SEARCH_CATALOG_ID)
        .map(c => ({ id: c.id, name: c.name, hidden: hidden.has(c.id) }));

    const data = {
        name: tr.rec.name || "pengguna",
        active: tr.state === "active",
        expiry: new Date(tr.rec.exp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kuala_Lumpur" }),
        manifestUrl: `${url.origin}/${token}/manifest.json`,
        stremioUrl: `stremio://${url.host}/${token}/manifest.json`,
        apiUrl: `${url.origin}/${token}/api/prefs`,
        waUrl: `https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent(`Salam, saya nak sambung langganan DaRyz (${PRICE_TEXT}).`),
        catalogs
    };
    const dataJson = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    const bgCss = /^https:\/\/[^\s"'()<>\\]+$/.test(CONFIGURE_BG_URL)
        ? `<style>body{background:url("${CONFIGURE_BG_URL}") center/cover fixed no-repeat #8fd0ee}.scene{display:none}</style>`
        : "";
    return new Response(CONFIGURE_HTML.replace("__BGCSS__", () => bgCss).replace("__DATA__", () => dataJson), {
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
    });
}

const CONFIGURE_HTML = `<!doctype html>
<html lang="ms"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DaRyz VIP - Configure</title>
<style>
*{box-sizing:border-box}
html,body{margin:0}
body{min-height:100vh;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#3b2f2a;background:#8fd0ee}
.scene{position:fixed;left:0;top:0;width:100%;height:100%;z-index:-1}
.cloud{animation:drift 70s ease-in-out infinite alternate}
.cloud.b{animation-duration:100s;animation-delay:-30s}
.cloud.c{animation-duration:85s;animation-delay:-55s}
@keyframes drift{from{transform:translateX(-90px)}to{transform:translateX(90px)}}
@media(prefers-reduced-motion:reduce){.cloud{animation:none}}
.wrap{position:relative;max-width:1000px;margin:0 auto;padding:28px 16px;display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}
@media(max-width:820px){.wrap{grid-template-columns:1fr}}
.card{background:rgba(255,251,238,.9);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1px solid rgba(120,90,50,.28);border-radius:26px;padding:26px;box-shadow:0 12px 32px rgba(30,70,60,.28)}
.logo{display:flex;align-items:center;justify-content:center;gap:12px;font-family:Georgia,"Palatino Linotype",serif;font-size:30px;font-weight:700;letter-spacing:.05em;color:#2f7d5b;margin-bottom:14px}
.logo i{width:48px;height:48px;border-radius:50%;background:#dff1e4;border:1px solid #9cc9ab;display:grid;place-items:center}
h2{margin:0 0 6px;font-family:Georgia,"Palatino Linotype",serif;font-size:21px;text-align:center;color:#3b2f2a}
.sub{margin:0 0 18px;font-size:14px;color:#7a6a5c;text-align:center}
.row{display:flex;justify-content:space-between;align-items:center;border:1px solid rgba(120,90,50,.22);background:rgba(255,255,255,.7);border-radius:12px;padding:13px 16px;margin-bottom:10px;font-size:15px}
.row span:first-child{color:#7a6a5c}
.ok{color:#1f6b45;background:#d5efdd;padding:2px 10px;border-radius:99px;font-size:13px;font-weight:700}
.bad{color:#9b2c2c;background:#fadcdc;padding:2px 10px;border-radius:99px;font-size:13px;font-weight:700}
.btn{display:block;width:100%;border:0;border-radius:14px;padding:15px;font-size:16px;font-weight:700;text-align:center;text-decoration:none;cursor:pointer;color:#fff;
background:linear-gradient(90deg,#7cc39a,#3f9b6e);box-shadow:0 4px 12px rgba(47,125,91,.35);margin:16px 0}
.btn:disabled{opacity:.5;cursor:default}
.btn.alt{background:rgba(255,255,255,.8);border:1px solid rgba(120,90,50,.3);color:#4a3b30;box-shadow:none;margin:8px 0 0}
.man{border:1px solid rgba(120,90,50,.22);border-radius:14px;padding:14px 16px;font-size:14px;color:#5b4b3f;background:rgba(255,255,255,.55)}
.man b{color:#3b2f2a}.man ol{margin:8px 0 0;padding-left:20px;line-height:1.7}
.url{font-family:ui-monospace,Consolas,monospace;font-size:12px;word-break:break-all;border:1px solid rgba(120,90,50,.22);background:rgba(255,255,255,.75);border-radius:12px;padding:12px;margin-top:12px;color:#4a3b30}
h3{font-size:13px;letter-spacing:.06em;text-transform:uppercase;margin:20px 0 10px;color:#5b4b3f}
.cat{display:flex;align-items:center;gap:10px;border:1px solid rgba(120,90,50,.22);background:rgba(255,255,255,.72);border-radius:12px;padding:10px 12px;margin-bottom:8px}
.cat.off .nm{opacity:.45;text-decoration:line-through}
.nm{flex:1;font-weight:700;font-size:14px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ib{width:36px;height:34px;border-radius:9px;border:1px solid rgba(120,90,50,.3);background:#fffaf0;color:#4a3b30;cursor:pointer;font-size:13px}
.ib:disabled{opacity:.3;cursor:default}.eye{color:#2f7d5b}.eye.off{color:#a39182}
.msg{min-height:22px;text-align:center;font-size:14px;margin-top:10px;color:#1f6b45}.msg.err{color:#b42323}
.hint{font-size:12px;color:#7a6a5c;text-align:center;margin-top:4px}
</style>
__BGCSS__
</head><body>
<svg class="scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true">
 <defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fb0ea"/><stop offset=".55" stop-color="#9fd8f2"/><stop offset="1" stop-color="#e9f7ee"/></linearGradient>
  <radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff9d6" stop-opacity=".95"/><stop offset="1" stop-color="#fff9d6" stop-opacity="0"/></radialGradient>
  <linearGradient id="h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a7dc9a"/><stop offset="1" stop-color="#7fc98a"/></linearGradient>
  <linearGradient id="h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#76c16f"/><stop offset="1" stop-color="#4fa862"/></linearGradient>
  <linearGradient id="h3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4aa35b"/><stop offset="1" stop-color="#2f7d4c"/></linearGradient>
  <g id="cl"><ellipse cx="130" cy="112" rx="125" ry="15" fill="#bcd9ea" opacity=".55"/>
   <circle cx="35" cy="88" r="30" fill="#fff"/><circle cx="85" cy="66" r="44" fill="#fff"/><circle cx="150" cy="58" r="52" fill="#fff"/>
   <circle cx="212" cy="76" r="38" fill="#fff"/><circle cx="250" cy="94" r="22" fill="#fff"/><rect x="30" y="86" width="224" height="26" rx="13" fill="#fff"/></g>
 </defs>
 <rect width="1600" height="900" fill="url(#sky)"/>
 <circle cx="1280" cy="190" r="260" fill="url(#sun)"/>
 <g class="cloud"><use xlink:href="#cl" x="120" y="110" transform="translate(0 0)"/></g>
 <g class="cloud b"><use xlink:href="#cl" x="820" y="60" transform="translate(300 60) scale(1.5)"/></g>
 <g class="cloud c"><use xlink:href="#cl" x="420" y="260" transform="translate(120 130) scale(.8)"/></g>
 <g class="cloud b"><use xlink:href="#cl" x="1180" y="330" transform="translate(40 20) scale(.7)"/></g>
 <g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"><path d="M690 250q14-16 28 0q14-16 28 0"/><path d="M780 215q10-12 20 0q10-12 20 0"/><path d="M735 290q9-10 18 0q9-10 18 0"/></g>
 <path d="M0 560 C140 470 230 500 330 540 C450 440 560 470 660 540 C790 430 900 470 1010 540 C1130 450 1250 480 1350 540 C1450 480 1540 500 1600 540 L1600 900 L0 900Z" fill="#9cc7d9" opacity=".75"/>
 <path d="M0 620 C200 560 380 590 560 630 C760 560 960 590 1160 640 C1330 580 1470 600 1600 630 L1600 900 L0 900Z" fill="url(#h1)"/>
 <path d="M0 700 C180 640 360 650 560 700 C760 750 940 650 1160 690 C1340 720 1480 660 1600 680 L1600 900 L0 900Z" fill="url(#h2)"/>
 <g><rect x="1160" y="560" width="9" height="42" fill="#6b4a2f"/><circle cx="1164" cy="545" r="34" fill="#3f9a57"/><circle cx="1144" cy="562" r="24" fill="#4aa862"/><circle cx="1186" cy="560" r="26" fill="#4aa862"/></g>
 <g><rect x="1262" y="598" width="7" height="30" fill="#6b4a2f"/><circle cx="1266" cy="586" r="24" fill="#3f9a57"/><circle cx="1252" cy="598" r="17" fill="#4aa862"/></g>
 <path d="M0 790 C200 730 420 740 640 790 C860 840 1040 740 1260 770 C1420 790 1520 750 1600 760 L1600 900 L0 900Z" fill="url(#h3)"/>
 <g fill="#2f7d4c" opacity=".7"><path d="M120 800l6-22 6 22z"/><path d="M134 804l5-18 5 18z"/><path d="M430 782l6-20 6 20z"/><path d="M980 810l6-22 6 22z"/><path d="M1400 786l5-18 5 18z"/></g>
</svg>
<div class="wrap">
 <div class="card">
  <div class="logo"><i><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f7d5b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-5 6-8 11-11"/></svg></i>DARYZ</div>
  <h2>Pasang / Kemas kini Addon</h2>
  <p class="sub">Tambah atau muat semula pustaka DaRyz anda dalam Stremio / Nuvio.</p>
  <div class="row"><span>Pengguna</span><b id="u"></b></div>
  <div class="row"><span>Status</span><span id="st"></span></div>
  <div class="row"><span>Tamat</span><b id="ex"></b></div>
  <a class="btn" id="inst" href="#">Pasang / Kemas kini dalam Stremio</a>
  <div class="man"><b>Nak buat manual (atau guna Nuvio)?</b>
   <ol><li>Buka Stremio / Nuvio dan pergi ke tab <b>Addons</b></li><li>Tekan ruang <b>Search / URL</b></li><li>Tampal pautan di bawah dan tekan Enter</li></ol></div>
  <div class="url" id="url"></div>
  <button class="btn alt" id="copy">Salin pautan</button>
 </div>
 <div class="card">
  <h2>Peribadikan</h2>
  <p class="sub">Susun dan sorok katalog ikut citarasa anda. Selepas simpan, pasang semula (Install / Update) addon.</p>
  <h3>Katalog</h3>
  <div id="list"></div>
  <button class="btn" id="save">Simpan pilihan</button>
  <button class="btn alt" id="reset">Kembali ke susunan asal</button>
  <div class="msg" id="msg"></div>
  <div class="hint">Carian sentiasa ada di hujung senarai.</div>
 </div>
</div>
<script>
var D = __DATA__;
var items = D.catalogs.map(function (c) { return { id: c.id, name: c.name, hidden: c.hidden }; });
var $ = function (id) { return document.getElementById(id); };
var EYE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
var EYEOFF = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.9 17.9A10.9 10.9 0 0 1 12 19C5 19 1 12 1 12a18 18 0 0 1 5.1-5.9M9.9 4.2A10 10 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.2 3.2M1 1l22 22"/></svg>';

$("u").textContent = D.name;
$("ex").textContent = D.expiry;
$("url").textContent = D.manifestUrl;
var st = $("st"); st.textContent = D.active ? "Aktif" : "Tamat"; st.className = D.active ? "ok" : "bad";
var inst = $("inst");
if (D.active) { inst.href = D.stremioUrl; }
else { inst.href = D.waUrl; inst.textContent = "Sambung langganan (WhatsApp)"; $("save").disabled = true; $("reset").disabled = true; }

function say(t, err) { var m = $("msg"); m.textContent = t; m.className = "msg" + (err ? " err" : ""); }

function render() {
  var list = $("list"); list.innerHTML = "";
  items.forEach(function (it, i) {
    var row = document.createElement("div"); row.className = "cat" + (it.hidden ? " off" : "");
    var eye = document.createElement("button"); eye.className = "ib eye" + (it.hidden ? " off" : ""); eye.innerHTML = it.hidden ? EYEOFF : EYE;
    eye.title = it.hidden ? "Tunjuk katalog" : "Sorok katalog";
    eye.onclick = function () { it.hidden = !it.hidden; render(); };
    var nm = document.createElement("span"); nm.className = "nm"; nm.textContent = it.name;
    var up = document.createElement("button"); up.className = "ib"; up.textContent = "\\u25B2"; up.disabled = i === 0;
    up.onclick = function () { items.splice(i - 1, 0, items.splice(i, 1)[0]); render(); };
    var dn = document.createElement("button"); dn.className = "ib"; dn.textContent = "\\u25BC"; dn.disabled = i === items.length - 1;
    dn.onclick = function () { items.splice(i + 1, 0, items.splice(i, 1)[0]); render(); };
    row.appendChild(eye); row.appendChild(nm); row.appendChild(up); row.appendChild(dn);
    list.appendChild(row);
  });
}
render();

function post(body) {
  return fetch(D.apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); });
}
$("save").onclick = function () {
  say("Menyimpan...");
  post({ order: items.map(function (i) { return i.id; }), hidden: items.filter(function (i) { return i.hidden; }).map(function (i) { return i.id; }) })
    .then(function (r) { r.ok ? say("Disimpan. Sekarang tekan Pasang / Kemas kini addon.") : say(r.j.error || "Gagal simpan", true); })
    .catch(function () { say("Gagal simpan. Cuba lagi.", true); });
};
$("reset").onclick = function () {
  if (!confirm("Kembali ke susunan asal?")) return;
  post({ reset: true }).then(function (r) { if (r.ok) { location.reload(); } else { say(r.j.error || "Gagal", true); } });
};
$("copy").onclick = function () {
  var done = function () { $("copy").textContent = "Disalin!"; setTimeout(function () { $("copy").textContent = "Salin pautan"; }, 1500); };
  if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(D.manifestUrl).then(done); }
  else { var t = document.createElement("textarea"); t.value = D.manifestUrl; document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); done(); }
};
</script></body></html>`;

// ==========================================
// AUTO-KEMAS KINI MANIFEST
// Tak perlu lagi edit "idPrefixes" / "catalogs" tangan bila tambah filem atau katalog baru.
// Setiap kali worker di-deploy, manifest disemak terhadap seriesDatabase:
//  - ID filem/siri yang belum ada dalam idPrefixes ditambah automatik
//  - Katalog dalam database yang belum disenaraikan ditambah automatik
//  - Nombor versi manifest naik sendiri bila kandungan berubah (lihat autoVersion)
// ==========================================
const MANIFEST_HASH = (() => {
    const known = new Set(manifest.catalogs.map(c => c.id));
    const hasPrefix = id => manifest.idPrefixes.some(p => id.startsWith(p));
    const addPrefix = id => { if (id && !hasPrefix(id)) manifest.idPrefixes.push(id); };
    const sig = [];
    for (const [key, cat] of Object.entries(seriesDatabase)) {
        const cid = cat.catalogId || key;
        if (!known.has(key) && !known.has(cid) && cat.name && !HIDDEN_KEYS.has(key)) {
            // guna catalogId jika bersih (tiada ruang kosong), kalau tidak guna kunci database
            const id = /^\S+$/.test(cid) ? cid : key;
            const entry = { type: "series", id, name: cat.name };
            const si = manifest.catalogs.findIndex(c => c.id === SEARCH_CATALOG_ID);
            if (si >= 0) manifest.catalogs.splice(si, 0, entry); else manifest.catalogs.push(entry);
            known.add(id); known.add(key); known.add(cid);
        }
        if (cat.isMulti) {
            for (const item of (cat.items || [])) { addPrefix(item.id); sig.push(`${item.id}|${item.name}|${item.poster || ""}`); }
        } else {
            addPrefix(cat.id);
            sig.push(`${cat.id}|${cat.name}|${(cat.episodes || []).length}|${cat.poster || ""}`);
        }
        sig.push(`#${key}|${cat.name}`);
    }
    sig.push(manifest.catalogs.map(c => c.id).join(","));
    sig.push(JSON.stringify(CATALOG_GROUPS));
    sig.push("cfg1");
    let h = 0x811c9dc5; // FNV-1a
    const str = sig.join("\n");
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return (h >>> 0).toString(16);
})();

function parseExtra(extraStr, url) {
    const out = {};
    const raw = String(extraStr || "").replace(/\.json$/, "");
    for (const pair of raw.split("&")) {
        if (!pair) continue;
        const i = pair.indexOf("=");
        const k = i < 0 ? pair : pair.slice(0, i);
        let v = i < 0 ? "" : pair.slice(i + 1);
        try { v = decodeURIComponent(v.replace(/\+/g, " ")); } catch (e) {}
        out[k] = v;
    }
    // Sokong juga ?search=... (query string)
    if (!out.search && url && url.searchParams.get("search")) out.search = url.searchParams.get("search");
    return out;
}

function handleSearch(query) {
    const q = normText(query);
    if (!q) return json({ metas: [] });
    const tokens = q.split(" ");
    const qc = q.replace(/ /g, "");
    const hits = [];
    for (const e of searchIndex) {
        const ok = tokens.every(t => e.words.includes(t)) || e.compact.includes(qc);
        if (!ok) continue;
        let score = 2;
        if (e.words.startsWith(q) || e.compact.startsWith(qc)) score = 0;
        else if ((" " + e.words).includes(" " + q)) score = 1;
        hits.push({ score, name: e.words, meta: e.meta });
    }
    hits.sort((a, b) => a.score - b.score || (a.name < b.name ? -1 : 1));
    return json({ metas: hits.slice(0, SEARCH_LIMIT).map(h => h.meta) });
}

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-cache", ...CORS }
    });
}

// Nombor versi manifest naik sendiri (4.2.1, 4.2.2, ...) setiap kali kandungan database berubah.
// Ini yang memberitahu Nuvio/Stremio bahawa addon ada kemas kini. Disimpan dalam KV "PREFS".
// Nak naik versi besar: tukar "version" dalam manifest (cth 4.3.0) - kiraan mula semula.
async function autoVersion(env) {
    const [maj, min] = String(manifest.version).split(".");
    const base = `${maj}.${min}`;
    try {
        const st = await env.PREFS.get("manifestVer", "json");
        if (st && st.hash === MANIFEST_HASH && st.base === base) return `${base}.${st.n}`;
        const n = (st && st.base === base ? st.n : 0) + 1;
        await env.PREFS.put("manifestVer", JSON.stringify({ hash: MANIFEST_HASH, base, n }));
        return `${base}.${n}`;
    } catch (e) {
        console.error("Gagal kira versi:", e);
        return manifest.version;
    }
}

// Susunan katalog disimpan dalam KV (binding "PREFS") jika ada.
async function getManifest(env) {
    if (!env.PREFS) return manifest;
    let m = manifest;
    try {
        const order = await env.PREFS.get("catalogOrder", "json");
        if (Array.isArray(order)) {
            const byId = new Map(manifest.catalogs.map(c => [c.id, c]));
            const ordered = order.map(id => byId.get(id)).filter(c => c && c.id !== SEARCH_CATALOG_ID);
            // katalog baharu (belum ada dalam susunan tersimpan) diletak di hujung, sebelum carian
            const inOrder = new Set(ordered.map(c => c.id));
            for (const c of manifest.catalogs) {
                if (c.id !== SEARCH_CATALOG_ID && !inOrder.has(c.id)) ordered.push(c);
            }
            if (byId.get(SEARCH_CATALOG_ID)) ordered.push(byId.get(SEARCH_CATALOG_ID));
            if (ordered.length > 1) m = { ...manifest, catalogs: ordered };
        }
    } catch (e) {
        console.error("Gagal baca PREFS:", e);
    }
    return { ...m, version: await autoVersion(env) };
}

async function savePreferences(request, env) {
    if (!env.PREFS) {
        return json({ success: false, message: "KV 'PREFS' belum disambungkan." }, 501);
    }
    if (!env.ADMIN_TOKEN) {
        return json({ success: false, message: "Tetapkan secret ADMIN_TOKEN dahulu." }, 403);
    }
    if (request.headers.get("Authorization") !== `Bearer ${env.ADMIN_TOKEN}`) {
        return json({ success: false, message: "Tidak dibenarkan." }, 401);
    }
    let body;
    try { body = await request.json(); } catch { body = null; }
    const order = body && body.catalogOrder;
    if (Array.isArray(order) && order.every(id => typeof id === "string")) {
        const valid = new Set(manifest.catalogs.map(c => c.id));
        const clean = order.filter(id => valid.has(id));
        if (clean.length) {
            await env.PREFS.put("catalogOrder", JSON.stringify(clean));
            return json({ success: true, message: "Susunan berjaya disimpan!" });
        }
    }
    return json({ success: false, message: "Data tak sah!" }, 400);
}


// ==========================================
// LOGO & BACKGROUND AUTO (TMDB)
// ==========================================
// Cara guna: Cloudflare > Worker > Settings > Variables and Secrets > tambah secret "TMDB_KEY"
// (API Key v3 atau Read Access Token v4, percuma di themoviedb.org/settings/api).
// Kalau siri ada `logo:` / `background:` sendiri dalam database, itu yang diutamakan.
// Hasil carian disimpan dalam KV "PREFS" (jika ada) supaya TMDB tak dipanggil berulang kali.
const ART_TTL = 60 * 60 * 24 * 30; // 30 hari

function cleanTitle(name) {
    return String(name || "")
        .replace(/\(.*?\)/g, " ")
        .split(/\s[-–]\s/)[0]
        .replace(/\bS\d+\b/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function normTitle(t) {
    return String(t || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function tmdbGet(env, path) {
    const key = env.TMDB_KEY;
    const isV4 = key.length > 40;
    const url = `https://api.themoviedb.org/3${path}${isV4 ? "" : (path.includes("?") ? "&" : "?") + "api_key=" + key}`;
    const r = await fetch(url, { headers: isV4 ? { Authorization: `Bearer ${key}` } : {} });
    if (!r.ok) throw new Error("TMDB " + r.status);
    return r.json();
}

async function lookupArt(env, name) {
    const q = cleanTitle(name);
    const nq = normTitle(q);
    if (nq.length < 3) return {};
    for (const kind of ["tv", "movie"]) {
        const res = await tmdbGet(env, `/search/${kind}?query=${encodeURIComponent(q)}&include_adult=false`);
        const hit = (res.results || []).find(r => {
            const n = normTitle(r.name || r.title);
            const o = normTitle(r.original_name || r.original_title);
            return n === nq || o === nq || n.includes(nq) || nq.includes(n);
        });
        if (!hit) continue;
        const img = await tmdbGet(env, `/${kind}/${hit.id}/images?include_image_language=en,null`);
        const logoFile = ((img.logos || []).find(l => l.iso_639_1 === "en") || (img.logos || [])[0] || {}).file_path;
        const bgFile = ((img.backdrops || []).find(b => !b.iso_639_1) || (img.backdrops || [])[0] || {}).file_path || hit.backdrop_path;
        return {
            logo: logoFile ? `https://image.tmdb.org/t/p/w500${logoFile}` : undefined,
            background: bgFile ? `https://image.tmdb.org/t/p/w1280${bgFile}` : undefined
        };
    }
    return {};
}

// Pulangkan { logo, background } untuk satu entri (siri atau item filem)
async function resolveArt(env, entry) {
    const art = { logo: entry.logo, background: entry.background };
    if ((art.logo && art.background) || !env || !env.TMDB_KEY) {
        return { logo: art.logo, background: art.background || entry.poster };
    }
    const cacheKey = "art~" + entry.id;
    try {
        let found = env.PREFS ? await env.PREFS.get(cacheKey, "json") : null;
        if (!found) {
            found = await lookupArt(env, entry.name);
            if (env.PREFS) await env.PREFS.put(cacheKey, JSON.stringify(found), { expirationTtl: ART_TTL });
        }
        return {
            logo: art.logo || found.logo,
            background: art.background || found.background || entry.poster
        };
    } catch (e) {
        console.error("resolveArt:", e);
        return { logo: art.logo, background: art.background || entry.poster };
    }
}

function handleCatalog(catalogId, extraStr, url) {
    if (catalogId === SEARCH_CATALOG_ID) return handleSearch(parseExtra(extraStr, url).search);
    const group = GROUP_BY_ID.get(catalogId);
    if (group) return json({ metas: groupMetas(group) });
    const series = catalogLookup.get(catalogId);
    if (!series) return json({ metas: [] });
    if (series.isMulti) {
        return json({
            metas: series.items.map(item => ({
                id: item.id,
                type: "series",
                name: item.name,
                poster: item.poster,
                description: item.description
            }))
        });
    }
    return json({
        metas: [{
            id: series.id,
            type: "series",
            name: series.name,
            poster: series.poster,
            description: series.description
        }]
    });
}

async function handleMeta(rawId, env) {
    const targetId = rawId.split(":")[0];

    const item = itemById.get(targetId);
    if (item) {
        return json({
            meta: {
                id: item.id,
                type: "series",
                name: item.name,
                poster: item.poster,
                ...(await resolveArt(env, item)),
                description: item.description,
                videos: [{
                    id: `${item.id}:1:1`,
                    title: item.name,
                    overview: item.description,
                    season: 1,
                    episode: 1,
                    released: new Date().toISOString()
                }]
            }
        });
    }

    const series = seriesById.get(targetId);
    if (!series) return json({ error: "Series not found" }, 404);

    // Kalau app minta meta dengan ID episod (cth courage1:3:5), guna gambar musim itu
    const seasonReq = parseInt(String(rawId).split(":")[1], 10);
    const sArt = series.seasonArt && series.seasonArt[seasonReq];

    return json({
        meta: {
            id: series.id,
            type: "series",
            name: series.name,
            poster: (sArt && sArt.poster) || series.poster,
            ...(await resolveArt(env, series)),
            ...(sArt && sArt.background ? { background: sArt.background } : {}),
            description: series.description,
            videos: series.episodes.map(e => ({
                id: `${series.id}:${e.season || 1}:${e.episode}`,
                title: e.title,
                overview: e.overview || e.description || "",
                season: e.season || 1,
                episode: e.episode,
                ...(e.thumbnail ? { thumbnail: e.thumbnail } : {}),
                released: new Date().toISOString()
            }))
        }
    });
}

function handleStream(rawId) {
  const parts = rawId.split(":");
  const targetId = parts[0];
  const seasonNum = parseInt(parts[1], 10) || 1;
  const episodeNum = parseInt(parts[2], 10) || 1;

  const item = itemById.get(targetId);
  if (item) {
    const fileName = item.url.split("/").pop();
    return json({
    streams: [{
      title: `Direct HD [CATBOX] (${item.name})`,
      url: `https://addon.daryz.uk/proxy/${fileName}`,
      behaviorHints: { bingeGroup: `${item.id}-catbox` }
    },
    {
      title: `Backup [TELEGRAM] (${item.name})`,
      url: `https://addon.daryz.uk/telegram-proxy/${fileName}`,
      behaviorHints: { bingeGroup: `${item.id}-telegram` }
    }]
    });
  }

  const series = seriesById.get(targetId);
  if (series) {
    const ep = series.episodes.find(e => e.episode == episodeNum && (e.season || 1) == seasonNum)
      || (series.episodes.some(e => e.season) ? null : series.episodes.find(e => e.episode == episodeNum));
    if (ep) {
      const fileName = ep.url.split("/").pop();
      return json({
        streams: [{
          title: `DARYZ HD - ${ep.season ? `S${ep.season}E${ep.episode} - ` : ""}${ep.title}`,
          url: `https://addon.daryz.uk/proxy/${fileName}`,
          behaviorHints: { bingeGroup: `${series.id}-hd` }
                }]
            });
        }
    }
    return json({ streams: [] });
}

const LANDING_HTML = `<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DaRyz Nuvio / Stremio Addon Config</title>
    <style>
        body { font-family: sans-serif; background: #18181c; color: #e1e1e6; padding: 40px; display: flex; justify-content: center; }
        .card { background: #202026; padding: 24px; border-radius: 16px; border: 1px solid #2d2d36; width: 100%; max-width: 500px; text-align: center; }
        a { color: #ffcc00; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="card">
        <h2>DaRyz Addon Server Active 🚀</h2>
        <p>Server sedang berjalan di Cloudflare Workers.</p>
    </div>
</body>
</html>`;

// ==========================================================
// PROXY VIDEO (logik asal worker kau - kekal sama)
// Catbox  : fail ada sambungan (.mp4) -> proxy ke files.catbox.moe
// Telegram: id tanpa sambungan -> KV FILES + Bot API, fallback Render
// ==========================================================
// Cache laluan fail Telegram (sah sekurang-kurangnya 1 jam) supaya getFile tak diulang
// setiap request/seek pemain.
async function getTelegramPath(env, fileId) {
  let cache = null;
  try { cache = caches.default; } catch (e) {}
  const key = new Request(`https://cache.local/tgpath/${fileId}`);
  if (cache) {
    const hit = await cache.match(key);
    if (hit) return await hit.text();
  }
  let p = null;
  try {
    const gf = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/getFile?file_id=${fileId}`).then(r => r.json());
    if (gf && gf.ok) p = gf.result.file_path;
  } catch (e) {
    console.error("getFile:", e);
  }
  if (p && cache) await cache.put(key, new Response(p, { headers: { "Cache-Control": "max-age=3000" } }));
  return p;
}

// Tanda sumber video + masa sebelum upstream balas (nampak dalam Chrome > Network > Headers/Timing)
function tagSource(headers, src, t0) {
  headers.set("X-Source", src);
  headers.set("Server-Timing", `resolve;dur=${Date.now() - t0}`);
  headers.set("Access-Control-Expose-Headers", "X-Source, Server-Timing");
}

// ==========================================
// CLOUDFLARE R2: stream video terus dari bucket (binding "VIDEOS")
// Nama objek dalam bucket = nama fail dalam URL (cth 6ae27d5f061e57f7e995fdf5 atau filem.mp4)
// ==========================================
function guessVideoType(name) {
  const ext = String(name).split(".").pop().toLowerCase();
  return { mkv: "video/x-matroska", webm: "video/webm", flv: "video/x-flv", m4v: "video/x-m4v" }[ext] || "video/mp4";
}

async function serveFromR2(request, env, fileName, t0) {
  if (!env.VIDEOS) return null;
  let obj;
  try {
    obj = await env.VIDEOS.get(fileName, { range: request.headers });
  } catch (e) {
    console.error("R2 get:", e);
    return null;
  }
  if (!obj) return null;

  const h = new Headers();
  try { obj.writeHttpMetadata(h); } catch (e) {}
  h.set("etag", obj.httpEtag);
  const ct = h.get("Content-Type") || "";
  if (!ct || /octet-stream/i.test(ct)) h.set("Content-Type", guessVideoType(fileName));
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Accept-Ranges", "bytes");
  h.set("Cache-Control", "private, max-age=3600");

  const size = obj.size;
  let status = 200;
  if (obj.range && request.headers.get("Range")) {
    let start, end;
    if (obj.range.suffix !== undefined) {
      start = Math.max(0, size - obj.range.suffix);
      end = size - 1;
    } else {
      start = obj.range.offset || 0;
      end = obj.range.length !== undefined ? start + obj.range.length - 1 : size - 1;
    }
    h.set("Content-Range", `bytes ${start}-${end}/${size}`);
    h.set("Content-Length", String(end - start + 1));
    status = 206;
  } else {
    h.set("Content-Length", String(size));
  }
  tagSource(h, "r2", t0);
  return new Response(obj.body, { status, headers: h });
}

async function handleProxy(request, env, path) {
  const t0 = Date.now();
  const fileName = decodeURIComponent(path.split("/").pop().split("?")[0]);
  const isCatbox = fileName.includes(".");

  // 1) R2 dahulu (laju, tiada server tidur)
  const fromR2 = await serveFromR2(request, env, fileName, t0);
  if (fromR2) return fromR2;

  if (isCatbox) {
    const upstreamUrl = `https://files.catbox.moe/${fileName}`;
    const headersToForward = new Headers();
    headersToForward.set("User-Agent", "Mozilla/5.0");
    const rangeHeader = request.headers.get("Range");
    if (rangeHeader) headersToForward.set("Range", rangeHeader);

    const upstreamResp = await fetch(new Request(upstreamUrl, {
      method: request.method,
      headers: headersToForward,
      redirect: "follow"
    }));
    const newHeaders = new Headers(upstreamResp.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Accept-Ranges", "bytes");
    tagSource(newHeaders, "catbox", t0);
    return new Response(upstreamResp.body, { status: upstreamResp.status, headers: newHeaders });
  }

  // Telegram ID
  let fileData = null;
  try {
    fileData = await env.FILES.get(fileName, "json");
  } catch (e) {}

  if (!fileData && typeof itemById !== "undefined") {
    const it = itemById.get(fileName);
    if (it) fileData = { telegram_file_id: it.telegram_file_id || it.file_id };
  }

  if (fileData && fileData.telegram_file_id) {
    const filePath = await getTelegramPath(env, fileData.telegram_file_id);
    if (filePath) {
      const tgUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}/${filePath}`;
      const h = new Headers();
      const rangeHeader = request.headers.get("Range");
      if (rangeHeader) h.set("Range", rangeHeader);
      const tgRes = await fetch(tgUrl, { headers: h });
      const newHeaders = new Headers(tgRes.headers);
      newHeaders.set("Access-Control-Allow-Origin", "*");
      newHeaders.set("Accept-Ranges", "bytes");
      tagSource(newHeaders, "telegram", t0);
      return new Response(tgRes.body, { status: tgRes.status, headers: newHeaders });
    }
  }

  // Bila semua fail dah dipindah ke R2: tambah pembolehubah NO_RENDER = 1 dalam Settings > Variables
  // supaya worker tak lagi cuba Render.
  if (env.NO_RENDER === "1" || env.NO_RENDER === 1) {
    return new Response("Fail tiada dalam R2", { status: 404, headers: { "Access-Control-Allow-Origin": "*" } });
  }

  // Fallback: server Render (NOTA: daryz-addon.onrender.com, bukan nuvio-telegram-addon)
  const renderHeaders = new Headers();
  const rangeHeader = request.headers.get("Range");
  if (rangeHeader) renderHeaders.set("Range", rangeHeader);
  const renderResp = await fetch(new Request(`https://daryz-addon.onrender.com/dl/${fileName}`, {
    method: request.method,
    headers: renderHeaders
  }));
  const finalHeaders = new Headers(renderResp.headers);
  finalHeaders.set("Access-Control-Allow-Origin", "*");
  finalHeaders.set("Accept-Ranges", "bytes");
  tagSource(finalHeaders, "render", t0);
  return new Response(renderResp.body, { status: renderResp.status, headers: finalHeaders });
}

function stripJson(s) { return decodeURIComponent((s || "").replace(/\.json$/, "")); }

// ==========================================================
// MESEJ KEPADA USER (tamat tempoh / had penuh / token tak sah)
// Dipaparkan sebagai kad dalam app Stremio/Nuvio
// ==========================================================
const WA_NUMBER = "601118828093";     // format antarabangsa untuk wa.me
const WA_DISPLAY = "01118828093";     // format yang user nampak
const PRICE_TEXT = "RM10 sebulan";
const NOTICE_ID = "mm_langganan_tamat"; // awalan "mm_" ada dalam idPrefixes, jadi app sentiasa hantar request ke addon

function noticeText(code, maxUsers) {
  const hubungi = `WhatsApp ${WA_DISPLAY} untuk sambung / langgan (${PRICE_TEXT}).`;
  if (code === "expired") return `Langganan DaRyz anda telah TAMAT. ${hubungi}`;
  if (code === "full") return `Had ${maxUsers || ""} pengguna untuk link ini telah penuh. ${hubungi}`;
  return `Link ini tidak sah atau telah dibatalkan. ${hubungi}`;
}

function noticeResponse(code, sub, id, maxUsers) {
  const text = noticeText(code, maxUsers);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent(`Salam, saya nak sambung langganan DaRyz (${PRICE_TEXT}).`);

  if (sub === "manifest.json") {
    return json({
      ...manifest,
      name: code === "expired" ? "DaRyz VIP [TAMAT]" : "DaRyz VIP [TIDAK AKTIF]",
      description: text,
      catalogs: [manifest.catalogs[0]],
      idPrefixes: ["mm_"]
    });
  }
  if (sub === "catalog") {
    // Papar kad mesej dalam katalog pertama sahaja; katalog lain kosong
    if (id !== manifest.catalogs[0].id) return json({ metas: [] });
    return json({
      metas: [{
        id: NOTICE_ID,
        type: "series",
        name: `Langganan tamat - WhatsApp ${WA_DISPLAY}`,
        description: text
      }]
    });
  }
  if (sub === "meta") {
    return json({
      meta: {
        id: id || NOTICE_ID,
        type: "series",
        name: "Langganan DaRyz",
        description: text,
        videos: [{
          id: `${id || NOTICE_ID}:1:1`,
          title: `WhatsApp ${WA_DISPLAY} - ${PRICE_TEXT}`,
          overview: text,
          season: 1,
          episode: 1,
          released: new Date().toISOString()
        }]
      }
    });
  }
  // stream
  return json({
    streams: [{
      name: "DaRyz VIP",
      title: text,
      description: text,
      externalUrl: waUrl
    }]
  });
}

// Cap jari "pengguna" = IP (IPv6 dipotong ke /64), di-hash supaya IP sebenar tak disimpan
async function clientId(request, token) {
  let ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (ip.includes(":")) ip = ip.split(":").slice(0, 4).join(":");
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token + "|" + ip));
  return [...new Uint8Array(buf)].slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function checkToken(env, token, request) {
  if (!env.TOKENS) return { ok: false, code: "config", msg: "KV 'TOKENS' belum disambungkan." };
  // Format token sahaja (elak kunci dalaman seperti stats~... dianggap token)
  if (!/^[a-z0-9]*_[a-z0-9]{5,}$/.test(token || "")) return { ok: false, code: "invalid", msg: "Token tidak sah." };
  // cacheTtl 60s: kurangkan bacaan KV bila pemain buat banyak request Range (seek)
  const raw = await env.TOKENS.get(token, { cacheTtl: 60 });
  if (!raw) return { ok: false, code: "invalid", msg: "Token tidak sah." };
  let u;
  try { u = JSON.parse(raw); } catch (e) { return { ok: false, code: "invalid", msg: "Token rosak." }; }
  if (typeof u.exp !== "number") return { ok: false, code: "invalid", msg: "Token tidak sah." };
  if (Date.now() > u.exp) return { ok: false, code: "expired", msg: "Token telah tamat tempoh." };

  // Had pengguna (hanya jika token ada maxUsers)
  if (u.maxUsers > 0) {
    const id = await clientId(request, token);
    if (!(u.users || []).includes(id)) {
      // Pengguna baru: baca data TERKINI (tanpa cache) sebelum tambah
      const freshRaw = await env.TOKENS.get(token);
      if (!freshRaw) return { ok: false, code: "invalid", msg: "Token tidak sah." };
      const fresh = JSON.parse(freshRaw);
      fresh.users = fresh.users || [];
      if (!fresh.users.includes(id)) {
        if (fresh.users.length >= fresh.maxUsers) {
          return { ok: false, code: "full", msg: `Had ${fresh.maxUsers} pengguna untuk token ini telah penuh.`, maxUsers: fresh.maxUsers };
        }
        fresh.users.push(id);
        await env.TOKENS.put(token, JSON.stringify(fresh));
      }
      u = fresh;
    }
  }
  return { ok: true, user: u };
}

// Rekod peranti yang guna token (tanpa simpan IP sebenar: hanya cap jari ter-hash + negara + nama app)
// Tulis ke KV hanya bila peranti baru, atau paling kerap sekali sejam setiap peranti.
async function trackVisit(env, request, token) {
  try {
    const id = await clientId(request, token);
    let cache = null;
    try { cache = caches.default; } catch (e) {}
    const mark = new Request(`https://track.internal/${token}/${id}`);
    if (cache && await cache.match(mark)) return;
    if (cache) await cache.put(mark, new Response("1", { headers: { "Cache-Control": "max-age=3600" } }));

    const key = "stats~" + token;
    const raw = await env.TOKENS.get(key);
    const st = raw ? JSON.parse(raw) : { devices: {} };
    const now = Date.now();
    const d = st.devices[id] || {
      first: now,
      country: (request.cf && request.cf.country) || "?",
      app: (request.headers.get("User-Agent") || "?").slice(0, 60)
    };
    d.last = now;
    st.devices[id] = d;
    await env.TOKENS.put(key, JSON.stringify(st));
  } catch (e) {
    console.error("trackVisit:", e);
  }
}

// Letak token dalam URL video supaya proxy boleh semak
async function streamWithToken(rawId, token) {
  const resp = handleStream(rawId);
  const data = await resp.json();
  for (const st of data.streams || []) {
    if (st.url) {
      st.url = st.url
        .replace("https://addon.daryz.uk/proxy/", `https://addon.daryz.uk/${token}/proxy/`)
        .replace("https://addon.daryz.uk/telegram-proxy/", `https://addon.daryz.uk/${token}/telegram-proxy/`);
    }
  }
  return json(data);
}

// ==========================================
// KEKALKAN RENDER SENTIASA TERJAGA  (supaya video terus main, tak perlu tunggu server bangun)
// 1) Cron Trigger: ping Render setiap 10 minit (Render tidurkan servis percuma selepas 15 minit tanpa trafik)
//    Aktifkan: Worker > Settings > Triggers > Cron Triggers > Add > */10 * * * *
// 2) Bila pengguna buka halaman tajuk atau minta stream, Render dikejutkan di latar (terhad sekali setiap 4 minit)
// Servis Render yang dipasang mesti servis percuma pertama anda (kuota 750 jam sebulan dikongsi seluruh workspace).
// ==========================================
const RENDER_PING_URL = "https://daryz-addon.onrender.com/";

async function warmRender() {
    try {
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), 25000);
        const r = await fetch(`${RENDER_PING_URL}?ping=${Date.now()}`, { signal: ctl.signal, headers: { "User-Agent": "daryz-keepalive" } });
        clearTimeout(timer);
        return r.status;
    } catch (e) {
        // Walaupun permintaan ditamatkan, Render tetap menerima trafik dan mula bangun
        return 0;
    }
}

async function warmIfNeeded() {
    try {
        const cache = caches.default;
        const key = new Request("https://cache.local/render-warm");
        if (await cache.match(key)) return;
        await cache.put(key, new Response("1", { headers: { "Cache-Control": "max-age=240" } }));
    } catch (e) {}
    await warmRender();
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(warmRender());
  },

  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const parts = path.split("/").filter(Boolean);

    try {
      // Halaman utama (tiada data)
      if (path === "/" && request.method === "GET") {
        return new Response(LANDING_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
      }

      // Admin (dilindungi ADMIN_TOKEN)
      if (path === "/api/save-preferences" && request.method === "POST") {
        return await savePreferences(request, env);
      }

      if (parts[0] === "admin" && parts[1] === "generate") {
        if (!env.ADMIN_TOKEN) return json({ error: "Set secret ADMIN_TOKEN dulu." }, 403);
        if (url.searchParams.get("secret") !== env.ADMIN_TOKEN) {
          return new Response("Unauthorized", { status: 401, headers: CORS });
        }
        if (!env.TOKENS) return json({ error: "KV 'TOKENS' belum disambungkan." }, 501);
        const name = url.searchParams.get("name") || "customer";
        const days = parseInt(url.searchParams.get("days") || "30", 10);
        const token = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10) + "_" + crypto.randomUUID().replace(/-/g, "").slice(0, 12);
        const exp = Date.now() + days * 86400000;
        const maxUsers = parseInt(url.searchParams.get("users") || "0", 10) || 0; // 0 = tiada had
        await env.TOKENS.put(token, JSON.stringify({ exp, name, maxUsers, users: [] }));
        return json({
          success: true,
          token,
          maxUsers,
          link: `https://addon.daryz.uk/${token}/manifest.json`,
          name,
          expiry: new Date(exp).toLocaleDateString("ms-MY")
        });
      }

      if (parts[0] === "admin" && (parts[1] === "reset" || parts[1] === "status")) {
        if (!env.ADMIN_TOKEN || url.searchParams.get("secret") !== env.ADMIN_TOKEN) {
          return new Response("Unauthorized", { status: 401, headers: CORS });
        }
        const tk = url.searchParams.get("token") || "";
        const raw = env.TOKENS ? await env.TOKENS.get(tk) : null;
        if (!raw) return json({ error: "Token tidak jumpa." }, 404);
        const rec = JSON.parse(raw);
        if (parts[1] === "reset") {
          rec.users = [];
          await env.TOKENS.put(tk, JSON.stringify(rec));
        }
        const stRaw = await env.TOKENS.get("stats~" + tk);
        const st = stRaw ? JSON.parse(stRaw) : { devices: {} };
        const fmt = t => new Date(t).toLocaleString("ms-MY", { timeZone: "Asia/Kuala_Lumpur" });
        const devices = Object.entries(st.devices).map(([id, d]) => ({
          peranti: id, pertama: fmt(d.first), terakhir: fmt(d.last), negara: d.country, app: d.app
        })).sort((a, b) => a.pertama < b.pertama ? -1 : 1);
        return json({
          token: tk, name: rec.name, maxUsers: rec.maxUsers || 0,
          usersUsed: (rec.users || []).length,
          expiry: fmt(rec.exp),
          jumlahPeranti: devices.length,
          devices,
          reset: parts[1] === "reset"
        });
      }

      // Halaman Configure + API pilihan pengguna (tidak mendaftar peranti, tidak guna slot pengguna)
      if (parts.length === 2 && parts[1] === "configure" && request.method === "GET") {
        return await handleConfigurePage(request, env, parts[0]);
      }
      if (parts.length === 3 && parts[1] === "api" && parts[2] === "prefs") {
        return await handlePrefsApi(request, env, parts[0]);
      }

      // SEMUA yang lain WAJIB ada token: /<token>/{manifest.json|catalog|meta|stream|proxy|telegram-proxy}
      const token = parts[0];
      const sub = parts[1];
      const allowed = ["manifest.json", "catalog", "meta", "stream", "proxy", "telegram-proxy"];
      if (!token || !allowed.includes(sub)) {
        return json({ error: "Token diperlukan. Guna link addon peribadi anda." }, 403);
      }

      const t = await checkToken(env, token, request);
      if (!t.ok) {
        // Video & ralat konfigurasi: balas 403 biasa. Selain itu: kad mesej dalam app.
        if (sub === "proxy" || sub === "telegram-proxy" || t.code === "config") {
          return json({ error: t.msg }, 403);
        }
        const nid = sub === "catalog" ? stripJson(parts[3]) : stripJson(parts[3]);
        return noticeResponse(t.code, sub, nid, t.maxUsers);
      }

      if (sub === "proxy" || sub === "telegram-proxy") {
        return await handleProxy(request, env, path);
      }
      ctx.waitUntil(trackVisit(env, request, token));
      if (sub === "manifest.json") {
        const m = applyUserPrefs(await getManifest(env), await loadUserPrefs(env, token));
        return json({ ...m, name: `DaRyz VIP [${t.user.name}]` });
      }
      const id = stripJson(parts[3]);
      if (sub === "catalog") return handleCatalog(id, parts[4], url);
      if (sub === "meta") { ctx.waitUntil(warmIfNeeded()); return await handleMeta(id, env); }
      ctx.waitUntil(warmIfNeeded());
      return await streamWithToken(id, token);
    } catch (e) {
      console.error("Ralat:", e);
      return json({ error: "Bad request", detail: String(e && e.message) }, 400);
    }
  }
};
