[![Netlify Status](https://api.netlify.com/api/v1/badges/7f96c299-f07e-4785-b9c6-8c778097764d/deploy-status)](https://app.netlify.com/sites/archonadventures/deploys)

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

To nic innego, jak "parser" informacji zawartych w bazie danych na podstawie których, buduje szkielet routingu oraz wyświetla treści.

## Zaplecze CMS

W projekcie "zaszyte" jest zaplecze CMSa do zarządzania stroną oraz część administracyjna aplikacji. Są one w zaawansowanej fazie rozwoju i zawierą:

- Proces autoryzacji

  - [x] logowanie
  - [x] wylogowanie
  - [x] podział na role użytkowników
    - Dostępne role
      - Super-User - nieograniczony dostęp do zasobów
      - Maker - Administrator strony
      - Writer - Administrator treści
      - Mod - Moderator treści
      - User - może przeglądać treści oraz je komentować
      - Guest - przeglądanie treści
    - Implementacja ról po stronie bazy danych.

- Profile użytkowników

  - [ ] Zakładanie kont
  - [x] Edycja profili

- Zarządzanie szablonami

  - [ ] tworzenie nowego szablonu
  - [x] modyfikacja
    - [x] widok okna właściwości szablonu
    - [x] zapis właściwości szablonu
  - [ ] usuwanie
  - Operacje na elementach
    - [ ] tworzenie nowych elementów
    - [x] edycja
    - [ ] usuwanie
  - Elementy

  Poszczególne elementy zostały opisane [TU](/src/components/page-elements/elements.md)

  Zastosowałem oznaczenia "CRUD" (od Create/Read/Update/Delete, gdzie Read należy czytać jako Wyświetlenie :) ) _Występowanie symbolu jest równoważne z implementacją._

  - [x] - elementy blokowe
    - [x] - Header `[-R--]`
    - [x] - Router-Menu `[-R--]`
    - [x] - Router-Content `[-R--]`
    - [x] - Footer `[-R--]`
    - [x] - Row `[-R--]`
  - [x] - elementy kontekstowe
    - [x] - Menu-Item `[-R--]`
    - [x] - Lang-Selector `[-R--]
    - [x] - Card `[CRUD]`
    - [x] - Calendar (odpowiednik bloga) `[-RU-]`
    - [ ] - Galery `[----]`
    - [ ] - Comments `[----]`
  - [ ] - Style elementów `[----]`
      Jak na razie, cały wygląd strony definiowany jest [stylami SCSS](/src/components/page-elements/scss/) "zaszytymi" w aplikacji.

    Przewiduję możliwość definiowania własnych styli dla każdego elementu, z pomocą biblioteki [**Radium**](https://github.com/FormidableLabs/radium/tree/master/docs/guides) i zaszyciu ich w bazie danych.

## Zaplecze

## Podsumowanie

Jak widać, dużo jeszcze zostało do zrobienia.
