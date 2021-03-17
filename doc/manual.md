# Instrukcja obsługi aplikacji

---

# Część Administracyjna

## Widok

Po zalogowaniu do aplikacji, wita nas **Dashboard** części Administracyjnej aplikacji.

Po prawej stronie, znajduje się Sidebar z opcjami.

## Opcje Sidebaru

- [x] **Account** - sekcja dt. konta użytkownika
- [ ] **Dashboard**
- [ ] **User Management** - Zarządzanie Użytkownikami
- [ ] **Policy Management** - Zarządzanie Polityką Aplikacji
- [x] **Site Manager** - Przejście do Zrządzania stroną

## Omówienie opcji Sidebaru

### Account

Sekcja **Account** jest rozwijana, a w niej:

- **Profile** - opcje ustawień konta

- **Log out** - wylogowanie z aplikacji

#### Acount->Profile - Ustawienia dt. konta użytkownika

Po otwarciu **Profile** ukazuje się strona, która podzielona jest na trzy bloki.

- **Blok informacji podstawowych**

Zawiera informacje które są widoczne dla wszystkich użytkowników aplikacji - nawet tych niezalogowanych.

- **Blok informacji rozszerzonych**

  Tu można zdefiniować pola, które będą widoczne Tylko dla użytkowników zalogowanych.

  Korzystając z przycisku "Add fields..." można utworzyć nowe pole, wybierając z listy interesujący na element.

  Po wpisaniu treści, akceptujemy klikając w "zielonego ptaszka" i voila - pole dodane.

  Dodatkowo, możemy określić, czy dane pole ma być widoczne dla wszystkich, klikając w ikonę "Oka".

  Edycji dokonuje się, klikając w "trzy kropeczki" umieszczone przy każdym polu po prawej stronie.

  Po kliknięciu, ukazuje sie niewielki pasek z ikonami.

  - Ikona "Ołówka" - pozwala edytować pole.

  - Ikona "Śmietnika" - usuwa pole.

Ostatnim blokiem na tej stronie jest

- **Sekcja bezpieczeństwa**

  W tym miejscu, zawarte są kluczowe dla bezpieczeństwa użytkownika informacje związane z **Polityką Bezpieczeństwa**, oraz możliwość **Zresetowania hasła** dostępowego do konta.

- **Aktualizacja profilu**

  Ostatnim elementem strony jest przycisk "Update" który zapisuje wprowadzane dane.

Użytkownik jest informowany o Konieczności zaktualizowania profilu, przy każdej jego modyfikacji stosownym dymkiem.

#### Acount->Wylogowanie

Wylogowanie odbywa się odrazu po kliknięciu w opcję "Logout", stąd decyzja o umieszczeniu go w rozwijalnym menu.

### Dashboard

### Policy Management

### User Management

Wyświetlana jest lista zarejestrowanych użytkowników, wraz z podstawowymi informacjami oraz przypisanymi im rolami.

#### Omówienie ról użytkowników

W aplikacji można przydzielać role użytkownikom, ustalając tym samym dostęp do zasobów.

Obecnie dostępnych jest 6 ról, jakie można przydzielić:

- **Super-User** - posiadający nieograniczony dostęp do zasobów, oraz mogący nadawać role.

- **Maker** - administrator strony, mający pełny dostęp do wyglądu strony.

- **Writer** - administrator treści.

- **Mod** - Moderator treści, mający dostęp do komentarzy wystawianych przez innych użytkowników.

- **User** - mogący przeglądać treści oraz je komentować

- **Guest** - mogąct Tylko przeglądać treści

### Przejście do Zarządzania stroną (Site Manager)

---

# Site Manager - Zarządzanie stroną

## Widok

### W pełni operatywna strona

Po przejściu do Zarządzania stroną, ukazuje się nam widok w pełni operatywnej strony.
Dokładnie tak samo wyglądać będzie dla każdego użytkownika.

### Panel

Niewielki obszar znajdujący się w prawym dolnym rogu ekranu to Panel zarządzania stroną.

W widocznej (zwiniętej) wersji, zawiera on informację dt. użytkownika oraz jego rolę.
Jednocześnie jest to przycisk powrotu do części Administracyjnej aplikacji.

Tuż obok informacji o użytkowniku, znajduje się przycisk rozwijania Sidebara.

### Sidebar

Po rozwinięciu, ukazuje się Panel zarządzania, w którym (w zależności o roli użytkownika) znajdują się sekcje w których może działać.

#### Layouts - schematy

W tej sekcji znajdziemy wszystko, co jest związane z wyglądem strony.

#### Cards - podstawowy nośnik informacji

Karty są podstawowym nośnikiem informacji.

Zawartość tej sekcji to drzewo katalogów oraz plików (kart) które można wykorzystać w różnych częściach aplikacji.

#### Calendars aka Blog

Kalendarze, lub inaczej Blogi to sekcja, w której informacje zorganizowane są z podziałem na katalogi oraz chronologicznie.

#### Galleries

Galerie. Sekcja jeszcze niezaimplementowana.
Tutaj będzie można zorganizować wszystkie treści multimedialne w postaci galerii.

#### Comments

Komentarze. Sekcja jeszcze niezaimplementowana.

#### Assets - zasoby

---

# Omówienie sekcji Sidebara

## Layouts - schematy

To, jak strona będzie wyglądała dla użytkownika koncowego opisuje Layout (schemat).
Takich schematów można zdefiniować wiele i w zależności od potrzeb, przełączać się pomiędzy nimi.

### Budowa schematu

Schemat ma budowę hierarchiczną.

### Omówienie rodzaji elementów

Do budowy schematów wykorzystywane są dwa rodzaje elementów:

#### Elementy blokowe

Te elementy budują strukturę szablonu i na jej podstawie budowany jest widok strony.

- [x] - **Layout**
- [ ] - Header
- [ ] - Footer
- [ ] - Menu-Router
- [x] - **Router-Content**
- [ ] - Row/Column

#### Elementy kontekstowe

Tworzą lub przechowują treść, która jest widoczna na stronie.

- [x] - **Menu-Link**
- [ ] - Lang-Selector
- [x] - **Card**
- [x] - **Calendar**
- [ ] - Galleries
- [ ] - Comments
- [ ] - Asset

### Layout

Elementem źródłowym szablonu, jest **Layout** - lecz może on mieć różne nazwy. Znajduje się on na szczycie drzewa i od niego zaczyna się budowa szablonu.

Aplikacja uruchomi się ze schematem, który opisany jest jako "Default"

#### Tworzenie

#### Edycja

Po otwarciu sekcji **Layouts**, wybieramy nazwę szablonu poprzedzoną z ikoną "Diagramu".

W otwartym panelu "Property of Layout" znajdziemy:

- **Name** - pole nazwy Layoutu - będzie ono widoczne w sekcji **Layouts** oraz będzie stanowić identyfikator szablonu

- **Languages** - obszar definicji języków

W stopce panelu umieszczone są dwa przyciski:

- **Set as default Layout** - pozwala ustawić szablon jako domyślny, czyli ten, który będzie się pojawiaj po wczytaniu strony

- **Save** - zapisuje ustawienia elementu

#### Obsługa wielu języków - Layout Props

Obsługa wielu języków jest (moim zdaniem) bardzo intuicyjna.
Lewa strona obszaru **Languages** to lista zdefiniowanych języków, prawa zaś, to przyciski:

- **Add** - dodanie nowego języka

  Klikając w ten przycisk, otworzy się okno **Add language** (u dołu panelu właściwości) W nim będą dwa pola do wprowadzenia informacji:

  - **Symbol** - dwuliterowe oznaczenie języka w standardzie ISO 3166-1 Alpha-2
  - **Name** - nazwa kraju

  U dołu, dwa przyciski **Add** - dodający definicję; **Cancel** - anulujący akcję.

- **Delete** - usuwanie wybranego języka

  Po wybraniu definicji z listy i kliknięciu tego przycisku, otworzy się okno **Delete confirmation** celem, potwierdzenia akcji usunięcia języka.

  ***

  :information_source: Usunięcie języka nie ma wpływu na treści dla niego zdefiniowane w elementach kontekstowych!

  ***

- **Set Default** - ustawia wybrany język jako domyślny dla szablonu

## Cards

Jak już wspomniałem wcześniej, tutaj trzymane są treści które aplikacja będzie prezentować.

Po otwarciu sekcji "Cards" ukazuje sie lista katalogów oraz dokumentów (kart).

W dolnej części panelu, dostępne są opcje, pozwalające zarządać tą sekcją.

---

:information_source: W tym miejscu należy wspomnieć, że katalog jest częścią nazwy.

**Co to znaczy?**

Znaczy to tyle, że nie istnieje on jako "odrębny byt" i usuwając
dokument, który jest jedynym elementem w katalogu, usunięty
zostanie również katalog!

Ma to swoje plusy jak i minusy. Plusem jest to, że nie
trzebabyło implementować osobnych funkcji do ich zarządzania,
co w efekcie, pozwala na automatyczne tworzenie katalogów.

---

### Tworzenie

Po otwarciu sekcji **Cards**, w obszarze opcji klikamy w przycisk "New...".
W otwartym oknie, przeważającą częscią jest obszar treści karty "Content body", gdzie używając języka znaczników Markdown, możemy definiować treść dokumentu.

Nad obszarem edycji w prawej części, znajdują się przyciski przełączające język, dla którego tworzona jest karta.

Tuż poniżej obszaru edycji, zawarte są informacje o użytkowniku i czasie powstania dokumentu, oraz niewielka sekcja, zawierająca ilość znaków oraz słów jakie zawiera dokument (w aktualnie wybranym języku).

Na samym dole, umieszczony jest przycisk **Save** zapisu dokumentu, który ukazuje pola w których możemy określić ścieżkę oraz nazwe karty.

Aplikacja automatycznie tworzy katalogi!

### Edycja

Otwarcia dokumentu do edycji można dokonać klikając dwukrotnie w nazwę karty lub wybierając dokument i klikając przycisk w obszarze opcji "Edit"

### Usuwanie

Kartę można usunąć poprzez wybranie dokumentu i kliknięcie w obszarze opcji w ikonę "Śmietnika".

Otworzy się okno potwierdzające wykonanie operacji.

## Calendars

### Tworzenie

### Edycja

### Usuwanie

## Galeries

## Comments

## Assets

---

# Elementy szablonu

## Tworzenie

Dodanie (utworzenie) elementu w szablonie to czynność dość prosta.

Po otwarciu sekcji **Layouts**, otwieramy modyfikowany szablon poprzez kliknięcie w ikonę "Folderu". Wykonujemy tą operację do miejsca w którym chcemy dodać nowy element szablonu.

W obszarze opcji **Panelu zarządzania**, znajduje się przycisk **Add** - klikając w niego, otworzy nam się nowy panel **Add new element**.

Z listy dostępnych elementów, wybieramy ten, który chcemy dodać do szablonu i przeciągając go, przemieszczamy go w miejsce dodania po stronie **Panelu zarządania** w sekcji **Layouts**.

Miejsce dodania elementu, będzie wyróżnione podświetleniem.

## Edycja

W sekcji **Layouts** wyszukujemy element który chcemy edytować i klikamy dwa razy na nazwie, lub po wybraniu elementu, w sekcji opcji (dół Panelu Zarządania) klikamy przycisk "Props"

Otworzy się nowy panel z właściwościami wybranego elementu.

Każdy panel zawiera w dolnej części, przycisk **Save** do zapisania dokonanych zmian w elemencie.

### Router-Content

**Router-Content** - oznaczony w drzewie szablonu ikoną "szpilki".

Element blokowy, definiujący punkt końcowy szablonu (lub inaczej podstronę).

Właściwości:

- **Route ID** - identyfikator punktu końcowego. Ułatwia on przypisanie celu odnośnika "Menu-Link".

- **End point of route** - właściwy punkt końcowy adresu URL.

- **Exact match route path** - nakazuje aplikacji rozpatrywać punkt końcowy dokładnie takim, jakim został zapisany.

- **Switch to layout** - pozwala przełączyć definicję szablonu.

### Menu-Link

**Menu-Link** - oznaczony w drzewie szablonu ikoną "łańcucha"

Jest elementem kontekstowym. Wyświetla on aktywne łącze odwołujące się do punktu końcowego, zdefiniowanego przez element **Router-Content**

Właściwości:

- **Destination route** - cel łącza (punkt końcowy). W polu tym, określamy adres punktu końcowego (bez domeny!). Aby ułatwić sobie życie, można wykorzystać identyfikator podany w elemencie **Router-Content** - należy go poprzedzić znakiem Hash (#)

- **Link title** - Tytuł łącza.

### Card

**Card** - oznaczony w drzewie szablonu ikoną "Kartki" (z kołonotatnika :P)

Element kontekstowy, wyświetlający zdefiniowaną w właściwościach kartę.

Właściwości:

- **Card file** - plik karty (dokumentu) z pełną ścieżką. Aby ułatwić sobie życie, można otworzyć sekcję "Cards" w Panelu Zarządzania i przeciągnąć interesującą nas kartę w to pole. Zostanie ono uzupełnione automatycznie o wymagane informacje.

- **Attributes** - sekcja atrybutów elementu.

  - **Prevent language warnings** - atrybut pozwalający wyłączyć komunikat ostrzegawczy, dla treści niezdefiniowanych w aktualnie wyranym języku.

  - **Use Markdown to format card** - _ten atrybut, prawdopodobnie zostanie usunięty_ Jego celem jest wymuszenie na aplikacji formatowania z użyciem parsera Markdown.

  - **Allow users to comment** - zezwala na dodawanie komentarzy do karty przez zalogowanych użytkowników
  - **Allow anonimous to comment** - podobnie jak wcześniej, tylko dla użytkowników anonimowych (nie zalogowanych)

### Calendar (aka Blog)

**Calendar** - oznaczony w drzewie szablonu ikoną "Kalendarza"

Element kontekstowy, pozwalający wyświetlić listę kalendarza oraz przeglądać powiązane z nim artykuły (karty)

---

_Ten element zostanie podzielony na mniejsze, celem umożliwienia lepszego dopasowania przez administratora aplikacji jego wyglądu i zachowania_

---

W obecnej wersji, jego właściwości to:

- **Calendar data source path** - ścieżka źródłowa przetwarzanego kalendarza. Podobnie jak w elemencie "Card" możemy ułatwić sobie życie, przez otwarcie sekcji **Calendars** w Panelu Zarządzania i przeciągnięciu interesującego nas kalendarza (folderu)

- **Visible content** - definiuje widoczne części składowe kalendarza podczas wyświetlania listy.

  - **Show date** -
  - **Show title** -
  - **Show descriptio** -

- **Attributes** - sekcja atrybutów elementu:

  - **Use pagination** - pozwala zastosować stronicowanie dla listy kalendarza
  - **Limit number of entries** - określa ilość widocznych elementów listy kalendarza.

---

# Aktualne prace

- Calendars
- Galleries
- Comments
- Assets

  - Integracja z API Uploadcare

- Stylizacja elementów

- Udostępnianie do edycji

- Dashboard
- Zarządzanie użytkownikami
- Zarządzanie politką aplikacji

  - Definiowanie

    - bezpieczeństwa
    - ciasteczka
    - RODO
    - inne...

  - Integracja ze stroną

Tworzenie kart polityki z poziomu Menadżera Strony. Łączenie z zapleczem.

**KONIEC**
