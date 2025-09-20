import pygame
import random
import os
import MainMenu # Import the main menu file for the full gameplay🤩

# Initialize pygame 
pygame.init()

# Initialize mixer for sound
pygame.mixer.init()     

# Load sound effects
collision_sound = pygame.mixer.Sound("Assets/Collision sound.mp3")  # Load collision sound
coin_sound = pygame.mixer.Sound("Assets/Coin sound.mp3")  # Load coin sound
coin_sound.set_volume(2.0)

# Screen setup
display_width = 800
display_height = 600
display = pygame.display.set_mode((display_width, display_height))
pygame.display.set_caption("Hell Storm")

# Colors
color1 = (255, 255, 255)
color2 = (255, 0, 0)
color3 = (255, 0, 0)

# Clock
frame_rate = pygame.time.Clock()

bg_img = pygame.transform.scale(pygame.image.load("Assets/Hell Fire.png"), (display_width, display_height))

# Gamer setup
gamer_detail = 50
gamer_movement = [display_width // 2, display_height - 2 * gamer_detail]
gamer_speed = 15
gamer_image = pygame.image.load("Assets/Player.png")
gamer_image = pygame.transform.scale(gamer_image, (gamer_detail, gamer_detail))

# Obstacles
to_dodge_detail = 50
to_dodge_position1 = [random.randint(0, display_width - to_dodge_detail), 0]
to_dodge_position2 = [random.randint(0, display_width - to_dodge_detail), 0]
to_dodge_speed = 7
obstacle_image = pygame.image.load("Assets/Fire Drop.png")
obstacle_image = pygame.transform.scale(obstacle_image, (to_dodge_detail, to_dodge_detail))


# Coin setup
coin_detail = 40
coin_position = [random.randint(0, display_width - coin_detail), -coin_detail]
coin_speed = 8
coins_collected = 0
coin_image = pygame.image.load("Assets/Coin.png")
coin_image = pygame.transform.scale(coin_image, (coin_detail, coin_detail))

# Shield Power up setup
shield_detail = 50
shield_image = pygame.image.load("Assets/ShieldPowerUP.png")
shield_image = pygame.transform.scale(shield_image, (shield_detail, shield_detail))
force_field_image = pygame.image.load("Assets/Force field.png")
force_field_image = pygame.transform.scale(force_field_image, (gamer_detail+60, gamer_detail+60))
shield_position = None
shield_spawn_time = pygame.time.get_ticks()
shield_active = False
shield_end_time = 0

# Score
points = 0
font = pygame.font.SysFont("BOLD", 45)

# High Score
high_score_file = "high_score.txt"

def load_high_score():
    if os.path.exists(high_score_file):
        with open(high_score_file, "r") as file:
            try:
                return int(file.read())
            except ValueError:
                return 0
    return 0

def save_high_score(score):
    with open(high_score_file, "w") as file:
        file.write(str(score))

high_score = load_high_score()

# Collision functions
def check_for_collision(gamer_movement, enemy_pos):
    p_x, p_y = gamer_movement
    e_x, e_y = enemy_pos
    if (e_x < p_x < e_x + to_dodge_detail or e_x < p_x + gamer_detail < e_x + to_dodge_detail) and \
        (e_y < p_y < e_y + to_dodge_detail or e_y < p_y + gamer_detail < e_y + to_dodge_detail):
        return True
    return False

def check_coin_collision(gamer_movement, coin_pos):
    p_x, p_y = gamer_movement
    c_x, c_y = coin_pos
    if (c_x < p_x < c_x + coin_detail or c_x < p_x + gamer_detail < c_x + coin_detail) and \
        (c_y < p_y < c_y + coin_detail or c_y < p_y + gamer_detail < c_y + coin_detail):
        return True
    return False

def check_shield_collision(gamer_movement, shield_pos):
    if shield_pos is None:
        return False
    p_x, p_y = gamer_movement
    s_x, s_y = shield_pos
    if (s_x < p_x < s_x + shield_detail or s_x < p_x + gamer_detail < s_x + shield_detail) and \
        (s_y < p_y < s_y + shield_detail or s_y < p_y + gamer_detail < s_y + shield_detail):
        return True
    return False

def run_game():
    global points, coins_collected, to_dodge_speed, to_dodge_position1, to_dodge_position2, coin_position, gamer_movement, high_score
    global shield_position, shield_spawn_time, shield_active, shield_end_time
    game_over = False
    while not game_over:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_over = True

        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            gamer_movement[0] -= gamer_speed
        if keys[pygame.K_RIGHT]:
            gamer_movement[0] += gamer_speed

        if gamer_movement[0] < 0:
            gamer_movement[0] = 0
        elif gamer_movement[0] > display_width - gamer_detail:
            gamer_movement[0] = display_width - gamer_detail

        # Move objects
        to_dodge_position1[1] += to_dodge_speed
        to_dodge_position2[1] += to_dodge_speed
        coin_position[1] += coin_speed

        # Shield spawn logic
        now = pygame.time.get_ticks()
        if shield_position is None and now - shield_spawn_time > 15000:
            shield_position = [random.randint(0, display_width - shield_detail), -shield_detail]
            shield_spawn_time = now

        # Move shield down if active
        if shield_position:
            shield_position[1] += 7  # Same speed as fire obstacles
            if shield_position[1] > display_height:
                shield_position = None

        # Shield collision
        if shield_position and check_shield_collision(gamer_movement, shield_position):
            shield_active = True
            shield_end_time = now + 7000
            shield_position = None

        # Shield timer
        if shield_active and now > shield_end_time:
            shield_active = False

        if to_dodge_position1[1] > display_height:
            to_dodge_position1 = [random.randint(0, display_width - to_dodge_detail), 0]
            points += 1
            to_dodge_speed += 0.5
        if to_dodge_position2[1] > display_height:
            to_dodge_position2 = [random.randint(0, display_width - to_dodge_detail), 0]
            points += 1
            to_dodge_speed += 0.5
        if coin_position[1] > display_height:
            coin_position = [random.randint(0, display_width - coin_detail), -coin_detail]

        # Only check collision if shield not active
        if not shield_active and (check_for_collision(gamer_movement, to_dodge_position1) or check_for_collision(gamer_movement, to_dodge_position2)):
            collision_sound.play()
            game_over = True
            break

        if check_coin_collision(gamer_movement, coin_position):
            coins_collected += 1
            coin_position = [random.randint(0, display_width - coin_detail), -coin_detail]
            coin_sound.play()

        # Draw everything
        display.blit(bg_img, [0, 0])
        display.blit(obstacle_image, (to_dodge_position1[0], to_dodge_position1[1]))
        display.blit(obstacle_image, (to_dodge_position2[0], to_dodge_position2[1]))
        display.blit(coin_image, (coin_position[0], coin_position[1]))
        if shield_position:
            display.blit(shield_image, (shield_position[0], shield_position[1]))
        if shield_active:
            # Center force field on player
            ff_width, ff_height = force_field_image.get_size()
            ff_x = gamer_movement[0] + gamer_detail//2 - ff_width//2
            ff_y = gamer_movement[1] + gamer_detail//2 - ff_height//2
            display.blit(force_field_image, (ff_x, ff_y))
        display.blit(gamer_image, (gamer_movement[0], gamer_movement[1]))
        score_text = font.render(f"Score: {points}", True, color1)
        coins_text = font.render(f"Coins: {coins_collected}", True, color1)
        high_score_text = font.render(f"High Score: {high_score}", True, color1)
        
        display.blit(score_text, (10, 10))
        display.blit(coins_text, (10, 50))
        display.blit(high_score_text, (10, 90))

        pygame.display.update()
        frame_rate.tick(30)

    # Update high score if needed
    if points > high_score:
        high_score = points
        save_high_score(high_score)

    # Show Game Over screen
    display.blit(bg_img, [0, 0])
    game_over_text = font.render(f"Game Over! Your score is {points}, you have {coins_collected} coins", True, color1)
    final_high_score = font.render(f"High Score: {high_score}", True, color1)
    display.blit(game_over_text, (display_width // 2 - 300, display_height // 2 - 20))
    display.blit(final_high_score, (display_width // 2 - 100, display_height // 2 + 30))
    pygame.display.update()
    pygame.time.wait(3000)
    pygame.quit()

if __name__ == "__main__":
    run_game()