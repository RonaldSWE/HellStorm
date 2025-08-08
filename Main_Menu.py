import pygame
import os
import subprocess
import sys


#Initialise pygame
pygame.init()
pygame.mixer.init()

display_width = 800
display_height = 600
display = pygame.display.set_mode((display_width, display_height))
pygame.display.set_caption("Hell Storm")

bg_img = pygame.transform.scale(pygame.image.load("Assets/Main Menu pic.png"), (display_width, display_height))

def draw_window():
    display.blit(bg_img, (0, 0))

def main_menu():
    # Play Hell Screams sound
    hell_screams = pygame.mixer.Sound("Assets/Hell Screams.mp3")
    hell_screams.set_volume(1.0)
    hell_screams.play()
    # Try to use a scary font, fallback to BOLD if not available
    try:
        font = pygame.font.Font("Assets/ScaryFont.ttf", 120)
    except:
        font = pygame.font.SysFont("BOLD", 120)
    button_font = pygame.font.SysFont("BOLD", 50)
    play_button_rect = pygame.Rect(display_width//2 - 100, display_height//2 + 50, 200, 70)
    running = True
    while running:
        draw_window()
        # Draw title
        # Use red color for scary effect
        title_text = font.render("HELL STORM", True, (255, 0, 0))
        # Add a shadow for extra effect
        shadow = font.render("HELL STORM", True, (0, 0, 0))
        display.blit(shadow, (display_width//2 - title_text.get_width()//2 + 5, display_height//2 - 120 + 5))
        display.blit(title_text, (display_width//2 - title_text.get_width()//2, display_height//2 - 120))
        # Draw Play button
        pygame.draw.rect(display, (255, 0, 0), play_button_rect)
        play_text = button_font.render("PLAY", True, (255, 255, 255))
        display.blit(play_text, (play_button_rect.x + play_button_rect.width//2 - play_text.get_width()//2, play_button_rect.y + play_button_rect.height//2 - play_text.get_height()//2))
        pygame.display.update()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if play_button_rect.collidepoint(event.pos):
                    running = False
                    pygame.quit()
                    # Run the game play file immediately
                    subprocess.Popen(["python", "GamePlay.py"])
                    sys.exit()

if __name__ == "__main__":
    main_menu()