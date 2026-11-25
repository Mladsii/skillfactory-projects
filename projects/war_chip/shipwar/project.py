import random

# Класс корабля
class Ship:
    def __init__(self, coordinates):
        self.coordinates = set(coordinates)  # Координаты корабля
        self.hits = set()  # Попадания по кораблю

    def hit(self, point):
        """Обработка попадания."""
        if point in self.coordinates:
            self.hits.add(point)
            return True
        return False

    @property
    def is_sunk(self):
        """Проверка, потоплен ли корабль."""
        return self.hits == self.coordinates


# Класс игровой доски
class Board:
    def __init__(self, ships):
        self.ships = ships  # Список кораблей
        self.shots = set()  # Все выстрелы
        self.misses = set()  # Промахи

    def get_surrounding_cells(self, coord):
        """Возвращает все соседние клетки вокруг заданной координаты."""
        x, y = coord
        return {
            (x + dx, y + dy)
            for dx in [-1, 0, 1]
            for dy in [-1, 0, 1]
            if 0 <= x + dx < 6 and 0 <= y + dy < 6
        }

    def mark_surrounding_cells(self, ship):
        """Закрашивает все соседние клетки вокруг потопленного корабля."""
        for coord in ship.coordinates:
            surrounding_cells = self.get_surrounding_cells(coord)
            for cell in surrounding_cells:
                if cell not in self.shots:  # Не затрагиваем уже использованные клетки
                    self.misses.add(cell)

    def make_shot(self, point):
        """Выполнение выстрела."""
        if point in self.shots:
            raise ValueError("Вы уже стреляли в эту клетку!")

        self.shots.add(point)

        for ship in self.ships:
            if ship.hit(point):
                if ship.is_sunk:
                    print(f"Корабль потоплен! ({point})")
                    self.mark_surrounding_cells(ship)  # Закрашиваем соседние клетки
                else:
                    print(f"Попадание! ({point})")
                return True

        self.misses.add(point)
        print(f"Промах! ({point})")
        return False

    def is_all_sunk(self):
        """Проверка, все ли корабли потоплены."""
        return all(ship.is_sunk for ship in self.ships)

    def display(self, show_ships=False):
        """Отображение доски с буквами наверху и цифрами слева."""
        board = [["O" for _ in range(6)] for _ in range(6)]

        # Отметка кораблей и попаданий
        for ship in self.ships:
            for coord in ship.coordinates:
                if show_ships:
                    board[coord[0]][coord[1]] = "■"
                if coord in ship.hits:
                    board[coord[0]][coord[1]] = "X"

        for miss in self.misses:
            board[miss[0]][miss[1]] = "T"

        # Вывод заголовка (буквы наверху)
        print("    " + " ".join(chr(65 + i) for i in range(6)))  # Буквы A-F

        # Вывод доски с цифрами слева
        for i, row in enumerate(board):
            print(f"{i + 1:2}  " + " ".join(row))  # Цифры 1-6


# Класс игры
class Game:
    def __init__(self):
        self.player_board = self.create_board()
        self.ai_board = self.create_board()

    def create_board(self):
        """Создание доски с кораблями."""
        ships = [
            Ship([(0, 0), (0, 1), (0, 2)]),  # Корабль на 3 клетки
            Ship([(1, 4), (1, 5)]),          # Первый корабль на 2 клетки
            Ship([(3, 3), (3, 4)]),          # Второй корабль на 2 клетки
            Ship([(5, 0)]),                  # Одноклеточный корабль
            Ship([(4, 2)]),                  # Одноклеточный корабль
            Ship([(2, 5)]),                  # Одноклеточный корабль
            Ship([(5, 5)])                   # Одноклеточный корабль
        ]
        return Board(ships)

    def player_move(self):
        """Ход игрока."""
        while True:
            try:
                coords = input("Введите координаты выстрела (например, 'A1'): ").upper()
                x = int(coords[1:]) - 1
                y = ord(coords[0]) - ord('A')

                if not (0 <= x < 6 and 0 <= y < 6):
                    raise ValueError("Неверные координаты!")

                self.ai_board.make_shot((x, y))
                break
            except Exception as e:
                print(f"Ошибка: {e}")

    def ai_move(self):
        """Ход компьютера."""
        while True:
            x, y = random.randint(0, 5), random.randint(0, 5)
            if (x, y) not in self.player_board.shots:
                self.player_board.make_shot((x, y))
                break

    def play(self):
        """Основной цикл игры."""
        print("Игра началась!")
        while True:
            print("\nВаша доска:")
            self.player_board.display(show_ships=True)
            print("\nДоска ИИ:")
            self.ai_board.display()

            print("\nВаш ход:")
            self.player_move()

            if self.ai_board.is_all_sunk():
                print("Вы победили!")
                break

            print("\nХод ИИ:")
            self.ai_move()

            if self.player_board.is_all_sunk():
                print("ИИ победил!")
                break


# Запуск игры
if __name__ == "__main__":
    game = Game()
    game.play()