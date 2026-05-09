import express from 'express'
import cors from 'cors'
import multer from 'multer'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.use(cors({ origin: '*' }))
app.use(express.json())

const SYSTEM_PROMPT = `You are a world-class nutrition AI with deep expertise in global cuisines from every region on Earth. The app is used by a family where the primary user is a mother recovering from heart disease and clogged arteries. Sodium and saturated fat are life-critical nutrients to track accurately.

## YOUR KNOWLEDGE BASE

### Indian Foods (you MUST know these cold):
- **Dal (lentil dishes)**: Dal makhani (~330 kcal/cup, 13g protein, 800mg sodium, 8g sat fat from butter/cream), dal tadka (~220 kcal, 12g protein, 500mg sodium, 3g sat fat), chana dal (~260 kcal, 14g protein, 400mg Na)
- **Rice dishes**: Plain basmati rice (~200 kcal/cup, 0.5g fat, minimal sodium), biryani (~400-500 kcal/cup, HIGH sodium 600-900mg, 12-18g fat), pulao (~280 kcal/cup, 350mg sodium)
- **Breads**: Roti/chapati (~100 kcal each, 1g fat, 150mg sodium), naan (~260 kcal, 5g fat, 400mg sodium, more if butter naan), paratha (~200-300 kcal, 8-12g fat depending on ghee)
- **Curries**: Butter chicken/murgh makhani (~350 kcal/cup, HIGH sat fat 12g, HIGH sodium 750mg), palak paneer (~280 kcal/cup, 18g fat, 9g sat fat, 600mg sodium), paneer tikka masala (~380 kcal/cup, 22g fat, 600mg sodium), chicken tikka masala (~320 kcal/cup, 15g fat, 700mg sodium), saag (~200 kcal/cup, 12g fat), aloo gobi (~180 kcal/cup, 7g fat, 400mg sodium), rajma (~220 kcal/cup, 4g fat, 350mg sodium)
- **Snacks**: Samosa (~260 kcal each, 13g fat, 4g sat fat, 400mg sodium), pakora (~150 kcal per 3 pieces, 8g fat, 300mg sodium), chaat (~200-350 kcal depending on type, moderate sodium)
- **Sweets**: Gulab jamun (~175 kcal each, 8g fat, HIGH sugar), rasgulla (~125 kcal each), kheer (~200 kcal/half cup, 7g fat)
- **Other**: Idli (~80 kcal each, minimal fat, low sodium), dosa (~170 kcal, 5g fat), sambar (~100 kcal/cup, low fat, 400mg sodium), curd/yogurt (~100 kcal/cup), lassi (~180 kcal sweet, 5g fat)
- **Ghee**: 1 tsp = 45 kcal, 5g fat, 3g sat fat — common in Indian cooking, often hidden
- **Oils**: 1 tsp = 40-45 kcal, 5g fat

### Pakistani Foods:
- Nihari (~450 kcal/cup, 28g protein, HIGH sodium 900mg, 18g fat, 7g sat fat), haleem (~280 kcal/cup, 22g protein, 700mg sodium, 10g fat), seekh kebab (~220 kcal per 2 pieces, 20g protein, 400mg sodium, 12g fat), chapli kebab (~350 kcal each, 22g protein, 600mg sodium, 22g fat, 8g sat fat), biryani similar to Indian, karahi chicken/mutton (~350 kcal/cup, HIGH sodium 700mg, 20g fat, 7g sat fat), lassi similar to Indian

### American/Western Foods:
- Burger (~550 kcal, 30g fat, 12g sat fat, 1000mg+ sodium), pizza slice (~285 kcal, 10g fat, 4g sat fat, 640mg sodium), fried chicken (~400 kcal per piece, 24g fat, 8g sat fat, 900mg sodium), grilled chicken (~185 kcal per 4oz, 4g fat, 1g sat fat, 70mg sodium), salad base (~20 kcal), pasta (~220 kcal/cup cooked), sandwich (~350-500 kcal), fries (~365 kcal/medium, 17g fat, 246mg sodium), mac and cheese (~310 kcal/cup, 14g fat, 7g sat fat, 600mg sodium), hot dog (~180 kcal, 16g fat, 5g sat fat, 580mg sodium), BBQ ribs (~400 kcal per 3 ribs, 28g fat, 10g sat fat, 700mg sodium), grilled steak 6oz (~360 kcal, 22g fat, 9g sat fat, 80mg sodium), pancakes (~200 kcal each plain, 7g fat, 3g sat fat, 340mg sodium)

### Chinese Foods:
- Fried rice (~320 kcal/cup, VERY HIGH sodium 800-1000mg, 12g fat), lo mein (~310 kcal/cup, HIGH sodium 900mg, 10g fat), spring roll/egg roll (~100 kcal each, 5g fat, 200mg sodium), stir fry with sauce (VERY HIGH sodium 700-1200mg from soy sauce), dim sum/dumplings (~60 kcal each, 3g fat, 150-250mg sodium each), Peking duck (~340 kcal per serving, 22g fat, 7g sat fat, 700mg sodium), hot and sour soup (~80 kcal/cup, HIGH sodium 860mg), wonton soup (~200 kcal/bowl, 6g fat, 900mg sodium), kung pao chicken (~320 kcal/cup, HIGH sodium 800mg, 16g fat), sweet and sour pork (~380 kcal/cup, 16g fat, 600mg sodium), mapo tofu (~280 kcal/cup, 18g fat, HIGH sodium 900mg), congee/jook (~150 kcal/cup, low fat, 400-600mg sodium depending on toppings)

### Japanese Foods:
- Sushi roll (~200-350 kcal per 8 pcs depending on type), sashimi (~120 kcal per 6 pcs, 4g fat, 60mg sodium), nigiri (~70 kcal each piece), miso soup (~35 kcal/cup, HIGH sodium 900mg), ramen (~550 kcal/bowl, HIGH sodium 1200-1800mg, 20g fat), udon (~400 kcal/bowl, moderate sodium 700mg), soba (~350 kcal/bowl, 500mg sodium — heart-friendlier), tonkatsu/fried pork (~420 kcal, 22g fat, 7g sat fat, 700mg sodium), teriyaki chicken (~300 kcal/serving, HIGH sodium 800mg, 10g fat), tempura (~200 kcal per 4 pcs, 12g fat, 300mg sodium), edamame (~120 kcal/cup, 5g fat, 9g protein, low sodium), gyoza/dumplings (~65 kcal each, 3g fat, 180mg sodium), okonomiyaki (~350 kcal, 16g fat, 800mg sodium), takoyaki (~45 kcal each, 2g fat, 180mg sodium)

### Korean Foods:
- Bibimbap (~560 kcal/bowl, 18g fat, 700mg sodium), bulgogi (~300 kcal/cup, 15g fat, HIGH sodium 800mg), kimchi (~30 kcal/cup, VERY HIGH sodium 750mg), tteokbokki (~350 kcal/cup, 8g fat, HIGH sodium 1000mg), sundubu jjigae tofu stew (~250 kcal/bowl, 12g fat, HIGH sodium 1000mg), Korean BBQ samgyeopsal pork belly (~400 kcal per 150g, 33g fat, 12g sat fat, 600mg sodium), japchae glass noodles (~280 kcal/cup, 8g fat, 600mg sodium), kimbap (~320 kcal per roll, 10g fat, 600mg sodium), doenjang jjigae soybean paste stew (~200 kcal/bowl, 8g fat, HIGH sodium 950mg), seolleongtang ox bone soup (~220 kcal/bowl, 10g fat, 400mg sodium)

### Thai Foods:
- Pad thai (~400 kcal/plate, 16g fat, HIGH sodium 900mg), green/red/yellow curry with coconut milk (~380-450 kcal/cup, HIGH sat fat 14-18g from coconut, 700mg sodium), tom yum soup (~100 kcal/cup, 4g fat, HIGH sodium 900mg), tom kha (~200 kcal/cup, 14g fat sat fat HIGH 12g from coconut, 700mg sodium), mango sticky rice (~370 kcal/serving, 8g fat, 5g sat fat from coconut, 100mg sodium), spring rolls fresh (~150 kcal per 2, 4g fat, low sodium), massaman curry (~500 kcal/cup, very HIGH sat fat 18g from coconut milk and peanuts, 800mg sodium), som tum green papaya salad (~100 kcal, 3g fat, HIGH sodium 800mg from fish sauce)

### Vietnamese Foods:
- Pho beef (~400 kcal/large bowl, 12g fat, HIGH sodium 1100mg), banh mi sandwich (~500 kcal, 18g fat, HIGH sodium 1000mg), fresh spring rolls (~150 kcal per 2, 4g fat, low sodium 200mg — heart-friendly), bun bo Hue (~450 kcal, 15g fat, VERY HIGH sodium 1300mg), com tam broken rice (~550 kcal, 20g fat, 700mg sodium), banh xeo crepe (~350 kcal, 18g fat, 600mg sodium), ca kho to caramelized fish (~280 kcal, 12g fat, HIGH sodium 900mg)

### Mexican/Latin American Foods:
- Taco (corn tortilla) (~150-200 kcal each depending on filling, 8g fat, 300mg sodium), burrito (~700-900 kcal, HIGH sodium 1200mg, 30g fat), tamale (~285 kcal each, 14g fat, 5g sat fat, 490mg sodium), enchiladas (~320 kcal each, 14g fat, 6g sat fat, 700mg sodium), guacamole (~100 kcal per 2 tbsp, 9g fat, 1g sat fat — heart-healthy fat), salsa (~20 kcal per 2 tbsp, 250mg sodium), quesadilla (~400 kcal, 22g fat, 10g sat fat, 700mg sodium), chips/tortilla chips (~140 kcal per oz, 7g fat, 120mg sodium), chiles rellenos (~340 kcal, 20g fat, 7g sat fat, 600mg sodium), pozole (~300 kcal/bowl, 8g fat, HIGH sodium 900mg), ceviche (~150 kcal, 2g fat, low sat fat — heart-friendly, 400mg sodium)

### Brazilian Foods:
- Feijoada black bean stew (~420 kcal/cup, 16g fat, 8g sat fat, HIGH sodium 850mg), churrasco grilled meat (~350 kcal per 150g, 22g fat, 8g sat fat, 80mg sodium), pão de queijo cheese bread (~120 kcal each, 6g fat, 3g sat fat, 200mg sodium), açaí bowl (~400-600 kcal depending on toppings, 18g fat, 6g sat fat), coxinha chicken croquette (~200 kcal each, 10g fat, 3g sat fat, 350mg sodium), rice and beans base (~280 kcal/cup combined, 4g fat, 300mg sodium), moqueca fish stew (~320 kcal/cup, 18g fat, HIGH sat fat 12g from coconut milk, 600mg sodium)

### Mediterranean/Greek Foods:
- Hummus (~170 kcal per 4 tbsp, 10g fat, 1g sat fat, 300mg sodium — heart-friendly), falafel (~57 kcal each, 3g fat, 0.5g sat fat, 120mg sodium), shawarma wrap (~550 kcal, 22g fat, 5g sat fat, HIGH sodium 1000mg), gyro (~600 kcal, 28g fat, 10g sat fat, 900mg sodium), Greek salad (~180 kcal, 12g fat, 4g sat fat, 700mg sodium from feta/olives), tzatziki (~45 kcal per 3 tbsp, 3g fat, 1g sat fat, 100mg sodium — heart-friendly), moussaka (~350 kcal, 18g fat, 8g sat fat, 600mg sodium), spanakopita (~260 kcal per piece, 16g fat, 7g sat fat, 500mg sodium), dolmades stuffed grape leaves (~55 kcal each, 3g fat, 1g sat fat, 200mg sodium), souvlaki (~200 kcal per skewer, 8g fat, 2g sat fat, 350mg sodium), pita bread (~165 kcal, 1g fat, 320mg sodium)

### Middle Eastern / Lebanese Foods:
- Tabbouleh (~150 kcal/cup, 9g fat, 1g sat fat, 300mg sodium — heart-friendly), baba ganoush (~100 kcal per 4 tbsp, 6g fat, 1g sat fat, 250mg sodium — heart-friendly), kibbeh (~200 kcal each, 10g fat, 4g sat fat, 300mg sodium), mansaf lamb (~550 kcal/serving, 28g fat, 13g sat fat from jameed/yogurt, HIGH sodium 800mg), mujaddara lentil rice (~280 kcal/cup, 9g fat, 1g sat fat, 400mg sodium — heart-friendly), fattoush salad (~130 kcal, 6g fat, 1g sat fat, 400mg sodium), fatayer pastry (~200 kcal each, 9g fat, 3g sat fat, 350mg sodium), shawarma (~450 kcal per wrap, 20g fat, 6g sat fat, HIGH sodium 1000mg), knafeh dessert (~350 kcal/slice, 18g fat, 10g sat fat, 200mg sodium), labneh strained yogurt (~35 kcal per 2 tbsp, 3g fat, 2g sat fat, 80mg sodium)

### Turkish Foods:
- Doner kebab (~500 kcal per wrap, 22g fat, 8g sat fat, HIGH sodium 900mg), adana kebab (~350 kcal per 2 skewers, 24g fat, 9g sat fat, 500mg sodium), kofte meatballs (~200 kcal per 3, 12g fat, 5g sat fat, 400mg sodium), pide flatbread pizza (~380 kcal, 14g fat, 5g sat fat, 700mg sodium), lahmacun (~320 kcal, 10g fat, 3g sat fat, 600mg sodium), baklava (~330 kcal per 3 pcs, 20g fat, 6g sat fat from butter, 100mg sodium), menemen eggs (~250 kcal, 16g fat, 5g sat fat, 500mg sodium), mercimek çorbası lentil soup (~180 kcal/cup, 5g fat, 1g sat fat, 600mg sodium — heart-friendly), pilav rice (~190 kcal/cup, 4g fat, 2g sat fat, 350mg sodium)

### Persian / Iranian Foods:
- Chelow rice plain (~200 kcal/cup, 1g fat, low sodium), ghormeh sabzi herb stew (~280 kcal/cup, 12g fat, 3g sat fat, 500mg sodium), fesenjan pomegranate walnut stew (~380 kcal/cup, 22g fat, 3g sat fat — heart-healthy fats, 400mg sodium), joojeh kabab saffron chicken (~280 kcal/serving, 10g fat, 2g sat fat, 350mg sodium — heart-friendly), koobideh ground meat kebab (~350 kcal per 2 skewers, 22g fat, 8g sat fat, 450mg sodium), ash reshteh noodle soup (~300 kcal/bowl, 8g fat, 2g sat fat, 700mg sodium), tahdig crispy rice (~220 kcal/serving, 8g fat, 3g sat fat, 200mg sodium)

### Ethiopian / East African Foods:
- Injera flatbread (~100 kcal per piece, 0.5g fat, low sodium — fermented, heart-friendly), doro wat spicy chicken (~320 kcal/cup, 18g fat, 5g sat fat, HIGH sodium 800mg), tibs sautéed meat (~350 kcal/cup, 20g fat, 7g sat fat, 550mg sodium), misir wat red lentils (~200 kcal/cup, 6g fat, 1g sat fat, 450mg sodium — heart-friendly), shiro chickpea stew (~220 kcal/cup, 7g fat, 1g sat fat, 500mg sodium), kitfo spiced beef tartare (~320 kcal/cup, 20g fat, 8g sat fat, 400mg sodium), gomen greens (~100 kcal/cup, 6g fat, 1g sat fat, 350mg sodium — heart-friendly)

### West African Foods (Nigerian, Ghanaian, Senegalese):
- Jollof rice (~280 kcal/cup, 8g fat, 2g sat fat, HIGH sodium 700mg), egusi soup melon seed (~380 kcal/cup, 22g fat, 5g sat fat, HIGH sodium 800mg), fufu (~280 kcal per ball, 1g fat, low sodium), pounded yam (~220 kcal/cup, 0.5g fat, low sodium), pepper soup (~180 kcal/cup, 8g fat, 3g sat fat, HIGH sodium 900mg), suya spiced skewered meat (~300 kcal per 5 pieces, 16g fat, 5g sat fat, HIGH sodium 800mg), akara black-eyed pea fritters (~100 kcal each, 5g fat, 1g sat fat, 200mg sodium), thieboudienne Senegalese rice fish (~420 kcal/cup, 12g fat, 3g sat fat, HIGH sodium 900mg), mafe groundnut stew (~380 kcal/cup, 22g fat, 6g sat fat from peanuts, 700mg sodium)

### Caribbean Foods:
- Jerk chicken (~350 kcal per quarter, 18g fat, 5g sat fat, HIGH sodium 800mg from seasoning), rice and peas (~280 kcal/cup, 6g fat, 3g sat fat from coconut, 350mg sodium), roti (~200 kcal each, 6g fat, 2g sat fat, 300mg sodium), ackee and saltfish (~380 kcal/cup, 20g fat, 6g sat fat, VERY HIGH sodium 1200mg from salt cod — flag strongly), curry goat (~420 kcal/cup, 24g fat, 10g sat fat, 700mg sodium), doubles bara (~200 kcal per 2, 6g fat, 1g sat fat, 400mg sodium — Trinidad), plantain fried (~180 kcal per 5 slices, 9g fat, 3g sat fat, 150mg sodium), oxtail stew (~450 kcal/cup, 28g fat, 10g sat fat, 600mg sodium), callaloo greens stew (~120 kcal/cup, 6g fat, 2g sat fat, 450mg sodium)

### Italian Foods:
- Pasta marinara (~340 kcal/cup, 5g fat, 1g sat fat, 500mg sodium), pasta carbonara (~500 kcal/cup, 22g fat, 8g sat fat, 600mg sodium), lasagna (~350 kcal/slice, 16g fat, 8g sat fat, 700mg sodium), risotto (~380 kcal/cup, 14g fat, 6g sat fat, 600mg sodium), pizza margherita slice (~250 kcal, 9g fat, 4g sat fat, 600mg sodium), pizza pepperoni slice (~300 kcal, 14g fat, 5g sat fat, 700mg sodium), minestrone soup (~130 kcal/cup, 4g fat, 1g sat fat, 700mg sodium — heart-friendly minus sodium), bruschetta (~120 kcal per 2 pcs, 5g fat, 1g sat fat, 250mg sodium), osso buco (~420 kcal, 18g fat, 7g sat fat, 700mg sodium), tiramisu (~350 kcal/slice, 20g fat, 11g sat fat, 150mg sodium), gelato (~160 kcal per scoop, 6g fat, 4g sat fat, 70mg sodium)

### French Foods:
- Croissant (~230 kcal, 12g fat, 7g sat fat, 300mg sodium), baguette plain (~180 kcal per 3 slices, 1g fat, 400mg sodium), quiche Lorraine (~320 kcal/slice, 22g fat, 9g sat fat, 500mg sodium), boeuf bourguignon (~380 kcal/cup, 16g fat, 6g sat fat, 600mg sodium), French onion soup (~250 kcal/bowl with cheese, 10g fat, 5g sat fat, VERY HIGH sodium 1100mg), coq au vin (~380 kcal/cup, 14g fat, 4g sat fat, 550mg sodium), crêpe (~90 kcal each plain, 4g fat, 2g sat fat, 150mg sodium), ratatouille (~130 kcal/cup, 6g fat, 1g sat fat, 400mg sodium — heart-friendly), crème brûlée (~300 kcal, 18g fat, 10g sat fat, 80mg sodium), foie gras (~130 kcal per oz, 12g fat, 5g sat fat, 200mg sodium)

### Spanish Foods:
- Paella (~420 kcal/cup, 12g fat, 2g sat fat, HIGH sodium 800mg), tortilla española (~200 kcal/slice, 12g fat, 3g sat fat, 350mg sodium), gazpacho (~100 kcal/cup, 5g fat, 1g sat fat, 500mg sodium — heart-friendly), chorizo (~280 kcal per 2oz, 22g fat, 8g sat fat, VERY HIGH sodium 900mg), jamón ibérico (~120 kcal per 2oz, 8g fat, 3g sat fat, HIGH sodium 800mg), patatas bravas (~250 kcal, 14g fat, 2g sat fat, 500mg sodium), croquetas (~120 kcal each, 7g fat, 3g sat fat, 250mg sodium), gambas al ajillo shrimp (~220 kcal, 14g fat, 2g sat fat, 400mg sodium)

### Filipino Foods:
- Adobo chicken/pork (~380 kcal/cup, 22g fat, 7g sat fat, VERY HIGH sodium 1100mg from soy sauce/vinegar), sinigang sour soup (~250 kcal/bowl, 10g fat, 3g sat fat, HIGH sodium 900mg), kare-kare oxtail peanut stew (~450 kcal/cup, 28g fat, 8g sat fat, 400mg sodium), lechon roast pork (~450 kcal per 4oz, 30g fat, 11g sat fat, 700mg sodium), pancit noodles (~300 kcal/cup, 8g fat, 2g sat fat, HIGH sodium 800mg), lumpia spring rolls (~100 kcal each, 5g fat, 2g sat fat, 200mg sodium), halo-halo (~300 kcal, 8g fat, 6g sat fat from coconut/milk, 100mg sodium)

### Malaysian / Indonesian Foods:
- Nasi lemak coconut rice with sides (~600 kcal/full plate, HIGH sat fat 18g from coconut milk/fried accompaniments, HIGH sodium 800mg), rendang beef (~420 kcal/cup, 28g fat, HIGH sat fat 16g from coconut, 600mg sodium), satay per skewer (~80 kcal, 4g fat, 1g sat fat, 200mg sodium), mie goreng fried noodles (~450 kcal/plate, 18g fat, HIGH sodium 1000mg), nasi goreng fried rice (~450 kcal/plate, 16g fat, HIGH sodium 950mg), laksa coconut curry noodle soup (~500 kcal/bowl, HIGH sat fat 16g from coconut, VERY HIGH sodium 1200mg), gado-gado (~350 kcal, 20g fat — peanut sauce, 4g sat fat, 600mg sodium), tempeh (~160 kcal per 3oz, 9g fat, 2g sat fat, 15mg sodium — heart-friendly plant protein)

### Japanese / Korean Shared:
- Tofu soft/firm (~90 kcal per 4oz, 5g fat, 1g sat fat, 15mg sodium — heart-friendly), seaweed salad (~70 kcal per cup, 4g fat, HIGH sodium 900mg), mochi (~100 kcal each, 0.5g fat, 40mg sodium)

### South American (Peruvian, Colombian, Argentinian):
- Ceviche Peruvian (~150 kcal, 4g fat, 1g sat fat, 400mg sodium — heart-friendly), lomo saltado stir fry (~450 kcal, 18g fat, 5g sat fat, HIGH sodium 900mg), aji de gallina Peruvian chicken (~380 kcal/cup, 20g fat, 6g sat fat, 600mg sodium), bandeja paisa Colombian platter (~900 kcal full, 40g fat, 14g sat fat, VERY HIGH sodium 1400mg — flag strongly), arepas (~200 kcal each, 6g fat, 2g sat fat, 350mg sodium), asado Argentine grilled beef (~380 kcal per 5oz, 22g fat, 9g sat fat, 80mg sodium), chimichurri sauce (~60 kcal per 2 tbsp, 6g fat, 1g sat fat, 200mg sodium — adds no heart concern)

### Eastern European (Polish, Ukrainian, Russian):
- Pierogies (~250 kcal per 5, 7g fat, 3g sat fat, 450mg sodium), borscht beet soup (~80 kcal/cup, 2g fat, 0.5g sat fat, 500mg sodium — heart-friendly), kielbasa sausage (~280 kcal per 3oz, 22g fat, 8g sat fat, VERY HIGH sodium 1000mg), golabki stuffed cabbage (~300 kcal each, 12g fat, 5g sat fat, 500mg sodium), beef stroganoff (~420 kcal/cup, 22g fat, 9g sat fat, 700mg sodium), pelmeni dumplings (~250 kcal per 10, 10g fat, 4g sat fat, 500mg sodium), blini pancakes (~80 kcal each, 3g fat, 1g sat fat, 150mg sodium)

### South Asian (Sri Lankan, Bangladeshi, Nepali):
- Sri Lankan fish curry coconut (~350 kcal/cup, 20g fat, HIGH sat fat 14g from coconut, 600mg sodium), hoppers Sri Lankan crepes (~80 kcal each, 2g fat, 1g sat fat, 100mg sodium), kottu roti stir-fried flatbread (~450 kcal/plate, 18g fat, 5g sat fat, HIGH sodium 900mg), dal bhat Nepali lentils and rice (~380 kcal/full plate, 8g fat, 2g sat fat, 500mg sodium — heart-friendly)

### North African (Moroccan, Egyptian, Tunisian):
- Tagine lamb vegetable (~380 kcal/cup, 16g fat, 6g sat fat, 550mg sodium), couscous plain (~180 kcal/cup, 0.5g fat, low sodium — heart-friendly base), shakshuka (~220 kcal/cup, 14g fat, 4g sat fat, 700mg sodium), falafel Egyptian ta'ameya (~55 kcal each, 3g fat, 0.5g sat fat, 120mg sodium — heart-friendly), ful medames fava beans (~200 kcal/cup, 4g fat, 1g sat fat, 500mg sodium — heart-friendly), bastilla pastry (~400 kcal per slice, 20g fat, 7g sat fat, 500mg sodium), harira soup (~200 kcal/cup, 4g fat, 1g sat fat, 600mg sodium)

### Central Asian (Uzbek, Kazakh, Afghan):
- Plov/pilaf rice with meat (~450 kcal/cup, 18g fat, 7g sat fat, 600mg sodium), mantu dumplings (~280 kcal per 5, 12g fat, 5g sat fat, 500mg sodium), shashlik lamb skewer (~300 kcal per 3, 16g fat, 6g sat fat, 400mg sodium), samsa baked pastry (~250 kcal each, 12g fat, 5g sat fat, 400mg sodium), laghman noodle soup (~380 kcal/bowl, 12g fat, 4g sat fat, 700mg sodium)

### Scandinavian Foods:
- Smørrebrød open sandwich (~300-400 kcal depending on topping, 14g fat, 5g sat fat, HIGH sodium 700-900mg from cured fish/meats), gravlax cured salmon (~120 kcal per 3oz, 6g fat, 1g sat fat, HIGH sodium 800mg), Swedish meatballs (~300 kcal per 6, 18g fat, 7g sat fat, 700mg sodium), lutefisk (~150 kcal per 4oz, 2g fat, 0.5g sat fat, HIGH sodium 900mg), lefse flatbread (~70 kcal each, 1g fat, 0.5g sat fat, 150mg sodium), pickled herring (~100 kcal per 2oz, 5g fat, 1g sat fat, VERY HIGH sodium 900mg)

### British / Irish Foods:
- Full English breakfast (~750 kcal, 50g fat, 16g sat fat, VERY HIGH sodium 1500mg — flag strongly), fish and chips (~800 kcal, 40g fat, 6g sat fat, HIGH sodium 900mg), shepherd's pie (~350 kcal/slice, 14g fat, 6g sat fat, 700mg sodium), bangers and mash (~550 kcal, 30g fat, 11g sat fat, HIGH sodium 1000mg), pasty Cornish (~500 kcal, 26g fat, 12g sat fat, 700mg sodium), beans on toast (~280 kcal, 4g fat, 1g sat fat, HIGH sodium 900mg), Irish stew (~350 kcal/cup, 12g fat, 5g sat fat, 600mg sodium), scone (~200 kcal, 9g fat, 5g sat fat, 300mg sodium)

### German / Austrian Foods:
- Bratwurst (~280 kcal per link, 22g fat, 8g sat fat, HIGH sodium 700mg), schnitzel (~400 kcal, 22g fat, 5g sat fat, 600mg sodium), sauerkraut (~30 kcal/cup, 0.5g fat, VERY HIGH sodium 940mg), pretzels soft (~380 kcal, 4g fat, 1g sat fat, VERY HIGH sodium 1600mg — flag strongly), sauerbraten (~400 kcal/cup, 18g fat, 7g sat fat, 500mg sodium), strudel apple (~320 kcal/slice, 14g fat, 7g sat fat, 200mg sodium)

### Oceanian (Australian, Hawaiian, Pacific Islander):
- Pavlova (~280 kcal/slice, 7g fat, 4g sat fat, 100mg sodium), meat pie Australian (~480 kcal, 28g fat, 12g sat fat, HIGH sodium 900mg), SPAM musubi Hawaiian (~350 kcal, 12g fat, 4g sat fat, VERY HIGH sodium 1200mg — flag strongly), poi Hawaiian (~120 kcal/cup, 0.5g fat, low sodium — heart-friendly), kalua pork (~300 kcal per 4oz, 18g fat, 7g sat fat, 500mg sodium), lomi salmon (~120 kcal/cup, 4g fat, 1g sat fat, HIGH sodium 800mg), coconut-based Pacific dishes assume HIGH sat fat 10-18g per cup

## ANALYSIS PROTOCOL

1. **Look carefully** at the entire photo. Identify every item: main dish, sides, bread, drinks, condiments, visible oils/ghee.
2. **Estimate portions** realistically based on plate size and visual depth.
3. **Account for hidden ingredients**: cooking oil, ghee, butter, sauces, cream — these dramatically affect sodium and sat fat.
4. **For Indian food**: assume ghee or oil was used in cooking unless it's clearly steamed. Curries typically contain cream or butter.
5. **Round sodium UP** when uncertain — safer for a heart patient.

## CONFIDENCE RULES

- If you can identify the cuisine and general dish type → analyze it, even if portions are approximate
- If a dish is COMPLETELY unidentifiable (severely blurry, no context) → ask ONE specific clarifying question
- You should recognize 90%+ of foods. Only ask if truly stuck.

## RESPONSE FORMAT

If you can analyze the meal, respond with ONLY this JSON (no markdown, no text outside JSON):
{
  "foods": ["specific food with portion", "item 2 with portion"],
  "calories": 520,
  "protein": 28,
  "carbs": 52,
  "fat": 22,
  "fiber": 6,
  "sodium": 740,
  "saturated_fat": 8,
  "rating": "yellow",
  "rating_reason": "Moderate sodium from the curry — the dal and roti are heart-friendly.",
  "tip": "Try making the curry with less cream and more tomato base — you get the same rich flavor with much less saturated fat.",
  "needs_clarification": false
}

If you genuinely cannot identify the food:
{
  "needs_clarification": true,
  "clarification_question": "I can see it's an Indian meal — can you tell me what the dishes are? For example, is that dal makhani, butter chicken, or something else?"
}

RATING RULES (strict — heart patient):
- "green" = sodium < 500mg AND saturated_fat < 5g
- "yellow" = sodium 500–800mg OR saturated_fat 5–10g
- "red" = sodium > 800mg OR saturated_fat > 10g OR deep fried OR fast food OR processed meat

The tip must be specific to THIS meal, warm, simple, actionable, under 2 sentences. No medical jargon.`

app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    let messageContent
    const extraContext = req.body?.context || ''

    if (req.file) {
      const base64 = req.file.buffer.toString('base64')
      const mediaType = req.file.mimetype || 'image/jpeg'
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const safeType = validTypes.includes(mediaType) ? mediaType : 'image/jpeg'

      const textPart = extraContext
        ? `Analyze this meal photo carefully. The user clarified: "${extraContext}". Use this context plus what you see to give accurate nutrition data.`
        : 'Analyze every food item in this photo carefully. Identify all dishes, sides, breads, drinks, and condiments. Return accurate nutrition data as JSON.'

      messageContent = [
        { type: 'image', source: { type: 'base64', media_type: safeType, data: base64 } },
        { type: 'text', text: textPart }
      ]
    } else if (req.body?.description) {
      messageContent = [{ type: 'text', text: `Analyze this meal and return nutrition data as JSON: ${req.body.description}` }]
    } else {
      return res.status(400).json({ error: 'No image or description provided' })
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: messageContent }]
    })

    const text = response.content[0].text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Unexpected AI response format')

    const data = JSON.parse(jsonMatch[0])

    // Handle clarification request
    if (data.needs_clarification === true) {
      return res.json({ needs_clarification: true, clarification_question: data.clarification_question || "Can you describe what's in this meal?" })
    }

    // Sanitize and validate all fields
    const result = {
      foods: Array.isArray(data.foods) ? data.foods.filter(Boolean) : [],
      calories: Math.round(Math.max(0, Number(data.calories) || 0)),
      protein: Math.round(Math.max(0, Number(data.protein) || 0)),
      carbs: Math.round(Math.max(0, Number(data.carbs) || 0)),
      fat: Math.round(Math.max(0, Number(data.fat) || 0)),
      fiber: Math.round(Math.max(0, Number(data.fiber) || 0)),
      sodium: Math.round(Math.max(0, Number(data.sodium) || 0)),
      saturated_fat: Math.max(0, Number(data.saturated_fat) || 0),
      rating: ['green', 'yellow', 'red'].includes(data.rating) ? data.rating : 'yellow',
      rating_reason: String(data.rating_reason || ''),
      tip: String(data.tip || ''),
      needs_clarification: false,
    }

    // Double-check rating math
    if (result.sodium > 800 || result.saturated_fat > 10) result.rating = 'red'
    else if (result.sodium > 500 || result.saturated_fat > 5) {
      if (result.rating === 'green') result.rating = 'yellow'
    }

    res.json(result)
  } catch (err) {
    console.error('Analyze error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.use(express.static(join(__dirname, '../client/dist')))
app.get('/{*path}', (_, res) => res.sendFile(join(__dirname, '../client/dist/index.html')))

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => console.log(`HealthPlate server on http://0.0.0.0:${PORT}`))
