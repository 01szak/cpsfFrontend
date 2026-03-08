# Analiza Widoku Osi Czasu (Gantt) dla Camper Park

Na podstawie załączonego obrazu `public/img.png`, przedstawiam propozycję wdrożenia zaawansowanego widoku kalendarza dla systemu rezerwacji parcel.

## 1. Charakterystyka Wizualna (Inspiracja)
*   **Oś czasu:** Poziomy układ siatki (grid), gdzie kolumny reprezentują jednostki czasu (dni).
*   **Paski rezerwacji (Pills):** Zaokrąglone elementy reprezentujące czas trwania rezerwacji.
*   **Elementy wewnątrz paska:** 
    *   Ikona (np. źródło rezerwacji: Booking, Airbnb, strona własna).
    *   Tekst (imię i nazwisko gościa).
*   **Interaktywność:** Sugerowany "drag-and-drop" dla zmiany terminu lub parceli.
*   **Kolorystyka:** Różne kolory pasków mogą oznaczać statusy (opłacone, zaliczka, do potwierdzenia).

## 2. Zastosowanie w Projekcie CPSF
Widok ten idealnie zastąpi lub uzupełni standardowy kalendarz, dając podgląd obłożenia wszystkich parcel jednocześnie.

### Proponowana struktura:
*   **Oś Y (Pionowa):** Numery/Indeksy Parcel (z `CamperPlaceForTable`).
*   **Oś X (Pozioma):** Daty (dni miesiąca).
*   **Zdarzenia (Bars):** Rezerwacje (`Reservation`).

## 3. Szczegóły Techniczne Implementacji

### Model Danych (Propozycja)
```typescript
interface TimelineReservation {
  id: number;
  guestName: string;
  startDate: Date;
  endDate: Date;
  placeId: number;
  statusColor: string;
  sourceIcon: string;
}
```

### Wykorzystanie CSS Grid/Flexbox
Zamiast ciężkich bibliotek, widok można zbudować responsywnie:
*   **Kontener:** `display: grid;` gdzie liczba kolumn = liczba dni w widoku + 1 (na etykiety parcel).
*   **Rzędy:** Każdy rząd reprezentuje jedną parcelę.
*   **Pozycjonowanie pasków:** Wykorzystanie `grid-column-start` i `grid-column-end` na podstawie różnicy dni między `startDate` a początkiem widoku.

## 4. Proponowane Funkcjonalności
1.  **Szybki Podgląd (Tooltip):** Najechanie na pasek wyświetla szczegóły (liczba osób, cena, uwagi).
2.  **Wyróżnienie weekendów:** Pionowe cieniowanie (widoczne na zdjęciu jako niebieskie pasy) ułatwi orientację w kalendarzu.
3.  **Tworzenie przez przeciąganie:** Kliknięcie i przeciągnięcie po pustych komórkach otwiera `PopupForm` z pre-definiowanymi datami i parcelą.
4.  **Filtrowanie:** Możliwość filtrowania widoku po typie parceli (np. tylko duże parcele).

## 5. Przewaga nad Standardowym Widokiem
Taki układ pozwala natychmiastowo zidentyfikować "dziury" w rezerwacjach (tzw. gap management), co jest kluczowe dla optymalizacji przychodów pola kempingowego.
