# Taskly – Görev & Proje Yönetimi (Mobil)

**Taskly (Mobil)**, bireysel kullanıcılar ve ekiplerin görev/proje takibini **iOS & Android** üzerinde kolaylaştıran **React Native** tabanlı uygulamadır.  
Bu depo **mobil istemciyi (React Native)** içerir. (Web: React / Backend API: ASP.NET Core)

## 🎯 Amaç
- Proje ve görevlerinizi **her yerden** yönetmek
- Web ve mobil arasında **sorunsuz senkronizasyon** sağlamak
- Basit, hızlı ve dokunmatik odaklı bir deneyim sunmak

## 🚀 Öne Çıkan Özellikler
- **Proje & Görev Yönetimi:** Durum, öncelik, son tarih, atama
- **Atamalar & Ekip:** Görevleri kullanıcılara atama, ekiplerle çalışma
- **Bildirimler:** Uygulama içi / push bildirim tercihleri
- **Doküman/Dosya Ekleme:** Projelere dosya/doküman iliştirme
- **Arama & Filtreler:** Durum/öncelik/etiket ve tarih bazlı filtreler
- **Sade Mobil UI:** Tek elle kullanım, erişilebilirlik, karanlık/aydınlık tema
- **Güvenli Oturum:** JWT tabanlı kimlik doğrulama, güvenli depolama

## 🧭 Ekran Haritası (Mobil)
- **Onboarding / Giriş** (01): Kısa tanıtım ve kimlik doğrulama
- **Ana Ekran / Dashboard** (02): Özet metrikler, hızlı eylemler
- **Projeler** (03–04): Proje listesi & proje oluşturma
- **Görevler** (05–06): Görev listesi & görev oluşturma
- **Takımlar** (07): Ekipler ve yeni takım oluşturma
- **Dokümanlar** (08): Proje dokümanları / ekler
- **Bildirimler** (09): Okunmamış bildirimler ve tercihler
- **Ayarlar** (10): Profil, güvenlik, bildirim tercihleri, dil/tema

## 🛠️ Teknolojiler
- **Mobil (bu repo):** React Native  
- **Navigasyon:** React Navigation  
- **Backend API:** ASP.NET Core (C#), **JWT** kimlik doğrulama  
- **Veritabanı:** PostgreSQL (sunucu tarafı)  
- **Mimari:** RESTful API

---
## 📸 Taskly Mobil – Ekran Görüntüleri

<table>
  <tr>
    <td align="center">
      <a href="./docs/01-auth-landing-mobile.png">
        <img src="./docs/01-auth-landing-mobile.png" alt="01-auth-landing-mobile" width="360">
      </a><br>
      <sub>01 — Açılış (Giriş/Kayıt) • <a href="./docs/01-auth-landing-mobile.png">Dosya</a></sub>
    </td>
    <td align="center">
      <a href="./docs/02-login-mobile.png">
        <img src="./docs/02-login-mobile.png" alt="02-login-mobile" width="360">
      </a><br>
      <sub>02 — Giriş Ekranı • <a href="./docs/02-login-mobile.png">Dosya</a></sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <a href="./docs/03-dashboard-home-mobile.png">
        <img src="./docs/03-dashboard-home-mobile.png" alt="03-dashboard-home-mobile" width="360">
      </a><br>
      <sub>03 — Ana Ekran / Dashboard • <a href="./docs/03-dashboard-home-mobile.png">Dosya</a></sub>
    </td>
    <td align="center">
      <a href="./docs/04-projects-list-mobile.png">
        <img src="./docs/04-projects-list-mobile.png" alt="04-projects-list-mobile" width="360">
      </a><br>
      <sub>04 — Projeler (Liste) • <a href="./docs/04-projects-list-mobile.png">Dosya</a></sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <a href="./docs/05-project-create-mobile.png">
        <img src="./docs/05-project-create-mobile.png" alt="05-project-create-mobile" width="360">
      </a><br>
      <sub>05 — Yeni Proje Oluştur • <a href="./docs/05-project-create-mobile.png">Dosya</a></sub>
    </td>
    <td align="center">
      <a href="./docs/06-teams-list-mobile.png">
        <img src="./docs/06-teams-list-mobile.png" alt="06-teams-list-mobile" width="360">
      </a><br>
      <sub>06 — Takımlar (Liste) • <a href="./docs/06-teams-list-mobile.png">Dosya</a></sub>
    </td>
  </tr>

  <tr>
    <td align="center">
      <a href="./docs/07-team-create-mobile.png">
        <img src="./docs/07-team-create-mobile.png" alt="07-team-create-mobile" width="360">
      </a><br>
      <sub>07 — Yeni Takım Oluştur • <a href="./docs/07-team-create-mobile.png">Dosya</a></sub>
    </td>
    <td align="center">
      <a href="./docs/08-tasks-list-mobile.png">
        <img src="./docs/08-tasks-list-mobile.png" alt="08-tasks-list-mobile" width="360">
      </a><br>
      <sub>08 — Görevler (Liste) • <a href="./docs/08-tasks-list-mobile.png">Dosya</a></sub>
    </td>
  <

