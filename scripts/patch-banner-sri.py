import os
import shutil
from PIL import Image

def patch_desktop():
    banner_path = 'public/images/home-festival-banner.jpg'
    backup_path = 'public/images/home-festival-banner.backup.jpg'
    if not os.path.exists(backup_path):
        shutil.copyfile(banner_path, backup_path)
        print(f"Backed up desktop banner to {backup_path}")

    banner = Image.open(banner_path).convert('RGB')

    # Heal band x: 574..824, y: 66..132
    for y in range(66, 133):
        v_t = (y - 66) / (133 - 66)
        base_r = int(0 * (1 - v_t) + 1 * v_t)
        base_g = int(34 * (1 - v_t) + 36 * v_t)
        base_b = int(78 * (1 - v_t) + 84 * v_t)
        for x in range(572, 826):
            dist_x = min(x - 572, 825 - x)
            dist_y = min(y - 66, 132 - y)
            dist = min(dist_x, dist_y)
            alpha = min(1.0, dist / 8.0)
            orig_r, orig_g, orig_b = banner.getpixel((x, y))
            r = int(orig_r * (1 - alpha) + base_r * alpha)
            g = int(orig_g * (1 - alpha) + base_g * alpha)
            b = int(orig_b * (1 - alpha) + base_b * alpha)
            banner.putpixel((x, y), (r, g, b))

    s_img = Image.open('scratch/flooded_s.png')
    r_img = Image.open('scratch/clean_desktop_r.png')
    i_orig = Image.open('scratch/perfect_i_clean.png')

    # Scale I: height 52px, width 19px
    i_scaled = i_orig.resize((19, 52), Image.Resampling.LANCZOS)

    y_pos = 71
    s_x = 636
    r_x = s_x + s_img.width + 12
    i_x = r_x + r_img.width + 14

    banner.paste(s_img, (s_x, y_pos), s_img)
    banner.paste(r_img, (r_x, y_pos), r_img)
    banner.paste(i_scaled, (i_x, y_pos), i_scaled)

    banner.save(banner_path, quality=95, subsampling=0)
    print(f"Successfully patched {banner_path} with SRI")

def patch_mobile():
    banner_path = 'public/images/home-festival-banner-mobile.jpg'
    backup_path = 'public/images/home-festival-banner-mobile.backup.jpg'
    if not os.path.exists(backup_path):
        shutil.copyfile(banner_path, backup_path)
        print(f"Backed up mobile banner to {backup_path}")

    m_img = Image.open(banner_path).convert('RGB')

    # Heal band x: 340..555, y: 56..120
    for y in range(56, 121):
        v_t = (y - 56) / (121 - 56)
        base_r = int(0 * (1 - v_t) + 1 * v_t)
        base_g = int(14 * (1 - v_t) + 18 * v_t)
        base_b = int(48 * (1 - v_t) + 58 * v_t)
        for x in range(340, 556):
            dist_x = min(x - 340, 555 - x)
            dist_y = min(y - 56, 120 - y)
            dist = min(dist_x, dist_y)
            alpha = min(1.0, dist / 8.0)
            orig_r, orig_g, orig_b = m_img.getpixel((x, y))
            r = int(orig_r * (1 - alpha) + base_r * alpha)
            g = int(orig_g * (1 - alpha) + base_g * alpha)
            b = int(orig_b * (1 - alpha) + base_b * alpha)
            m_img.putpixel((x, y), (r, g, b))

    s_img = Image.open('scratch/m_s_exact.png')
    src_letters = Image.open('scratch/m_shree_letters.png').convert('RGB')
    lh = src_letters.height
    r_clean = Image.new('RGBA', (132 - 100 + 1, lh), (0, 0, 0, 0))
    for y in range(lh):
        for x in range(100, 133):
            r, g, b = src_letters.getpixel((x, y))
            if (r > b + 10) or (r > 60 and g > 50) or (r > 15 and b < 35):
                a = 255
                if r < 100 and b > 30:
                    a = int(255 * (r / 90.0))
                r_clean.putpixel((x - 100, y), (r, g, b, a))

    i_orig = Image.open('scratch/perfect_i_clean.png')
    target_h = 46
    target_w = 16
    i_scaled = i_orig.resize((target_w, target_h), Image.Resampling.LANCZOS)

    y_pos = 68
    s_x = 398
    r_x = s_x + s_img.width + 10
    i_x = r_x + r_clean.width + 12

    m_img.paste(s_img, (s_x, y_pos), s_img)
    m_img.paste(r_clean, (r_x, y_pos), r_clean)
    m_img.paste(i_scaled, (i_x, y_pos + 1), i_scaled)

    m_img.save(banner_path, quality=95, subsampling=0)
    print(f"Successfully patched {banner_path} with SRI")

if __name__ == '__main__':
    patch_desktop()
    patch_mobile()
    print("All banners patched successfully!")
