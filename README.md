[![Netlify Status](https://api.netlify.com/api/v1/badges/7f96c299-f07e-4785-b9c6-8c778097764d/deploy-status)](https://app.netlify.com/sites/archonadventures/deploys)

Projekt można wesprzeć przez [PATREON](https://www.patreon.com/GSoftDev)

Na dzień 17.05.2021 Projekt jest zawieszony :(

# O projekcie

Projekt jest adaptacją strony internetowej z implementacją następujących technologii:

- [x] React
- [x] MongoDB Realm
- [x] Netlify
- [ ] Radium

# Założenia projektu

Chciałem stworzyć stronę internetową która nie potrzebowałaby **_dedykowanego backendu_**. W jak **_najmniejszym_** stopniu wykorzystywała przetwarzanie po stronie serwera.

# Co zawiera projekt?

Projekt składa się z dwóch części:

- aplikacja strony
- zaplecze CMS oraz administracja aplikacji

## Aplikacja strony

To nic innego, jak "parser" informacji zawartych w bazie danych na podstawie których, budowany jest szkielet routingu oraz wyświetlana jest treści.

## Zaplecze CMS

W projekcie "zaszyte" jest zaplecze CMSa, pozwalające na zarządzanie wyglądem strony oraz zawartymi w niej treściami.

Aktualny postęp:

- Proces autoryzacji

  - [x] logowanie
  - [x] wylogowanie
  - [x] podział na role użytkowników
    - Dostępne role
      - **Super-User** - nieograniczony dostęp do zasobów
      - **Maker** - Administrator strony
      - **Writer** - Administrator treści
      - **Mod** - Moderator treści
      - **User** - może przeglądać treści oraz je komentować
      - **Guest** - przeglądanie treści
    - Implementacja ról po stronie bazy danych.

- Profile użytkowników

  - [ ] Zakładanie kont
  - [x] Edycja profili
  - [x] Resetowane hasła

- Zarządzanie szablonami

  - [ ] tworzenie nowego szablonu
  - [x] modyfikacja
    - [x] widok okna właściwości szablonu
    - [x] zapis właściwości szablonu
  - [ ] usuwanie
  - Operacje na elementach
    - [x] tworzenie nowych elementów
    - [x] edycja
    - [ ] usuwanie
  - Elementy

    Poszczególne elementy zostały opisane [TU](/doc/elements.md)

    Zastosowałem oznaczenia "CRUD" (od Create/Read/Update/Delete, gdzie Read należy czytać jako Wyświetlenie :) ) _Występowanie symbolu jest równoważne z implementacją._

    - [x] - elementy blokowe
      - [x] - Header `[CR--]`
      - [x] - Router-Menu `[CRU-]`
      - [x] - Router-Content `[CRU-]`
      - [x] - Footer `[CR--]`
      - [x] - Row `[CR--]`
    - [x] - elementy kontekstowe
      - [x] - Menu-Item `[CRU-]`
      - [x] - Lang-Selector `[CR--]
      - [x] - Card `[CRUD]`
      - [x] - Calendar (odpowiednik bloga) `[CRU-]`
      - [x] - Galery `[C---]`
      - [x] - Comments `[C---]`

  - [ ] - Style elementów `[----]`

    Jak na razie, cały wygląd strony definiowany jest [stylami SCSS](/src/components/layout/page-elements/scss/) "zaszytymi" w aplikacji.

    Przewiduję możliwość definiowania własnych styli dla każdego elementu, z pomocą biblioteki [**Radium**](https://github.com/FormidableLabs/radium/tree/master/docs/guides) i zaszyciu ich w bazie danych.

## Administracja aplikacji

## Podsumowanie

Jak widać, dużo jeszcze zostało do zrobienia.
