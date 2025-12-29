# 1  Opis projektu studenckiego

**StudY** to aplikacja webowa do planowania i organizacji nauki dla studentów. 
Umożliwia zarządzanie harmonogramem zajęć, zadaniami, wydarzeniami oraz współpracę grupową.
Aplikacja łączy w sobie funkcje kalendarza, listy zadań, planu zajęć oraz platformy do współpracy grupowej.  
Dzięki intuicyjnemu interfejsowi i responsywnemu designowi, StudY pozwala skutecznie zarządzać obowiązkami akademickimi 
z dowolnego urządzenia.


# 2  Technologie

## 2.1  Frontend:
- **React** (z React Router)
- **JavaScript** (71. 4%)
- **CSS Modules** (28.1%)
- **Vite** (build tool)
- **Zustand** (state management)
- **React Grid Layout** (drag & drop)
- **React DatePicker**
- **Lucide React** (ikony)
- **Font Awesome** (ikony)

## 2.2  Backend:
- **Node. js** + **Express. js**
- **MySQL** (baza danych)
- **UUID** (generowanie unikalnych ID)

## 2.3  Inne: 
- **RESTful API**
- **JWT Authentication**


# 3  Funkcjonalności

## 3.1  Autoryzacja i profil użytkownika
- Rejestracja i logowanie
- Zarządzanie profilem użytkownika
- Edycja danych osobowych i zdjęcia profilowego
- Reset hasła

## 3.2  Kalendarz
- Dodawanie, edycja i usuwanie wydarzeń
- Kategoryzacja wydarzeń (różne rodzaje wydarzeń)
- Określanie priorytetu wydarzeń
- Automatyczne powiadomienia o nadchodzących wydarzeniach
- Załączanie plików do wydarzeń
- Widok kalendarza z możliwością nawigacji po datach

## 3.3  Lista zadań (To-Do)
- Tworzenie zadań z terminem wykonania
- Oznaczanie priorytetu zadań (1-4 flame level)
- Określanie wysiłku potrzebnego do wykonania zadania (1-4 circles)
- Automatyczne powiadomienia przed deadline: 
  - 7 dni przed terminem
  - 3 dni przed terminem
  - 1 dzień przed terminem
- Oznaczanie zadań jako wykonane
- Sortowanie i filtrowanie zadań

## 3.4  Plan zajęć
- Zarządzanie planem zajęć w układzie tygodniowym
- Dodawanie przedmiotów, sal i prowadzących
- Określanie typu zajęć (wykład, ćwiczenia, laboratorium)
- Edycja i usuwanie zajęć
- Przypisywanie godzin i dni tygodnia

## 3.5  Grupy studenckie
- Tworzenie i dołączanie do grup
- Widok szczegółów grupy z: 
  - Listą członków
  - Wspólnymi notatkami
  - Ogłoszeniami
- Responsywny układ z możliwością przeciągania widgetów (drag & drop)

## 3.6  Powiadomienia
- Automatyczne powiadomienia o zadaniach i wydarzeniach
- System oznaczania powiadomień jako przeczytane
- Wyświetlanie powiadomień w menu nawigacyjnym


# 4  Instrukcja instalacji

## 4.1  Wymagania wstępne:
- **Node.js** (v16 lub nowszy)
- **npm** lub **yarn**
- **MySQL** (v8 lub nowszy)

## 4.2  Krok 1: Sklonuj repozytorium
```bash
git clone https://github.com/NatalkaLazecka/study-app.git
cd study-app
```

## 4.3  Krok 2: Instalacja zależności

###  Backend:
```bash
cd server
npm install
```

###  Frontend:
```bash
cd ../client
npm install
```

## 4.4  Krok 3: Konfiguracja bazy danych
1. Utwórz bazę danych MySQL
2. Skonfiguruj połączenie w pliku `server/src/database/db.js`
3. Uruchom migracje/skrypty SQL (jeśli są dostępne)

## 4.5  Krok 4: Konfiguracja zmiennych środowiskowych

###  Backend (server/. env):
```
PORT=3001
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=study_app
```

###  Frontend (client/.env):
```
VITE_RAILWAY_API_URL=http://localhost:3001
```

## 4.6  Krok 5: Uruchomienie aplikacji

###  Backend:
```bash
cd server
npm start
```

###  Frontend:
```bash
cd client
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`


# 5  Instrukcja użytkowania

## 5.1  Rejestracja i logowanie
- Otwórz aplikację i kliknij **REGISTER**
- Wypełnij formularz rejestracyjny
- Po rejestracji zaloguj się używając przycisku **LOG IN**

## 5.2  Strona główna (Home)
Po zalogowaniu zobaczysz kafelki z głównymi funkcjami:
- **To-Do** - lista zadań
- **Calendar** - kalendarz wydarzeń
- **Groups** - grupy studenckie
- **Schedule** - plan zajęć

## 5.3  Dodawanie zadań
1. Kliknij kafelek **To-Do**
2. Kliknij przycisk **+ Add Task**
3. Wypełnij szczegóły zadania:
   - Tytuł
   - Opis
   - Termin wykonania
   - Priorytet (🔥)
   - Wysiłek (⭕)
   - Włącz automatyczne powiadomienia (opcjonalne)
4. Kliknij **Save**

## 5.4  Tworzenie wydarzeń w kalendarzu
1. Przejdź do **Calendar**
2. Kliknij **+ Add Event**
3. Podaj: 
   - Tytuł
   - Opis
   - Datę rozpoczęcia i zakończenia
   - Kategorię wydarzenia
   - Załącz pliki (opcjonalne)
4. Zapisz wydarzenie

## 5.5  Zarządzanie planem zajęć
1. Przejdź do **Schedule**
2. Kliknij **+ Add Class**
3. Wybierz: 
   - Przedmiot
   - Prowadzącego
   - Dzień tygodnia
   - Godzinę
   - Salę
   - Typ zajęć
4. Zapisz

## 5.6  Praca w grupach
1. Przejdź do **Groups**
2. Dołącz do istniejącej grupy lub utwórz nową
3. W szczegółach grupy możesz:
   - Zobacz członków grupy
   - Dodawać notatki
   - Przeglądać ogłoszenia
   - Przeciągać widgety aby dostosować widok


# 6  Autorzy

Natalka Lazecka - GitHub: [@NatalkaLazecka](https://github.com/NatalkaLazecka)
Zuzanna Kurpik - GitHub: [@ZUZIAKURPIK](https://github.com/ZUZIAKURPIK)


# 7  Licencja

Ten projekt został stworzony na potrzeby akademickie. 


# 8  Podziękowania

Dziękuję za skorzystanie z aplikacji **StudY**!

© 2025 StudY
