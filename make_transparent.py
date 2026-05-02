from PIL import Image

def make_white_transparent(image_path, output_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    # A simple approach: if pixel is close to white, make it transparent
    for item in datas:
        # Check if it's white or very close to white
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

make_white_transparent("public/logo.jpg", "public/logo1.jpg")
