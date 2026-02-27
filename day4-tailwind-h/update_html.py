import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Read the file up to <!-- Timeline Section -->
split_marker = "    <!-- Timeline Section -->"
if split_marker not in content:
    print("Could not find Timeline Section, exiting.")
    exit(1)

parts = content.split(split_marker)
upper_html = parts[0]

# Generate Top Creators HTML
top_creators_html = """    <!-- Top Creators Section -->
    <section class="max-w-[1728px] mx-auto pt-[100px] pb-[100px]">
      <div class="flex flex-col items-center mb-[80px]">
        <h2 class="text-white font-bold text-[54px] mb-[15px]">
          Top Creators
        </h2>
        <p class="text-[#AAB0B6] text-center text-[18px]">
          Checkout Top Rated Creators On The NFT Marketplace
        </p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-4 gap-[30px] px-[146px]">
"""

for i in range(1, 9):
    top_creators_html += f"""        <!-- Artist {i} -->
        <div class="bg-artist-bg rounded-[27px] flex flex-col items-center p-[27px] gap-[27px] relative transition-transform hover:-translate-y-2">
          <span class="absolute top-[27px] left-[27px] text-[16px] text-[#AAB0B6] font-['Clash_Display',sans-serif] font-semibold">{i}</span>
          <div class="w-[160px] h-[160px] rounded-full overflow-hidden mt-[15px]">
            <img src="/assets/t-{i}.png" alt="Creator {i}" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col items-center gap-[10px]">
            <h3 class="text-white font-bold text-[24px] font-['Poppins',sans-serif]">Name NFT</h3>
            <span class="text-[#AAB0B6] text-[16px] font-['Poppins',sans-serif]">Total Sales: <span class="text-white font-bold">34.53 ETH</span></span>
          </div>
        </div>
"""

top_creators_html += """      </div>
    </section>

"""

# Generate Timeline HTML
timeline_html = """    <!-- Timeline Section -->
    <section class="relative w-full overflow-hidden py-[120px]">
      <img src="/assets/hero-bg.png" alt="Timeline Background" class="absolute inset-0 w-full h-full brightness-[0.25] object-cover -z-10" />

      <div class="relative max-w-[1728px] mx-auto px-6 md:px-[146px]">
        
        <!-- Header -->
        <div class="flex justify-center mb-[100px]">
          <h2 class="text-white font-bold text-[54px]">Road Map</h2>
        </div>

        <!-- Vertical Center Line -->
        <div class="absolute left-[34px] md:left-1/2 top-[220px] bottom-[50px] w-[2px] bg-linear-to-b from-transparent via-[#E08C3C] to-transparent md:-translate-x-1/2 opacity-70"></div>

        <div class="relative flex flex-col gap-10 md:gap-[80px]">
"""

timeline_data = [
    {"month": "January", "title": "Brief", "desc": "Lorem ipsum dolor sit amet consectetur. Elit massa erat vitae non semper quis. Morbi sed aliquet donec facilisis. Senectus eget.", "side": "left", "dot": "#E2DDD0"},
    {"month": "February", "title": "Research", "desc": "Lorem ipsum dolor sit amet consectetur. Elit massa erat vitae non semper quis. Morbi sed aliquet donec facilisis. Senectus eget.", "side": "right", "dot": "#E08C3C"},
    {"month": "March", "title": "Discover", "desc": "Lorem ipsum dolor sit amet consectetur. Elit massa erat vitae non semper quis. Morbi sed aliquet donec facilisis. Senectus eget.", "side": "left", "dot": "#E2DDD0"},
    {"month": "April", "title": "Design", "desc": "Lorem ipsum dolor sit amet consectetur. Elit massa erat vitae non semper quis. Morbi sed aliquet donec facilisis. Senectus eget.", "side": "right", "dot": "#E08C3C"},
    {"month": "May", "title": "Testing", "desc": "Lorem ipsum dolor sit amet consectetur. Elit massa erat vitae non semper quis. Morbi sed aliquet donec facilisis. Senectus eget.", "side": "left", "dot": "#E2DDD0"},
    {"month": "June", "title": "Launch & Feedback", "desc": "Lorem ipsum dolor sit amet consectetur. Elit massa erat vitae non semper quis. Morbi sed aliquet donec facilisis. Senectus eget.", "side": "right", "dot": "#E08C3C"},
]

for item in timeline_data:
    clip_path = "inset(0 50% 0 0)" if item['side'] == 'left' else "inset(0 0 0 50%)"
    
    if item['side'] == 'left':
        layout = f"""
          <!-- Item (Left) -->
          <div class="flex flex-col md:flex-row justify-between w-full relative group">
            <div class="w-full md:w-[calc(50%-60px)] pl-[60px] md:pl-0 flex justify-end">
              <div class="w-full max-w-[500px] relative">
                <!-- Glowing Half Border -->
                <div class="absolute -inset-[6.92px] rounded-[18.46px] bg-linear-to-br from-[#E5E0CF] via-[#CF9833] to-transparent pointer-events-none" style="padding: 6.92px; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; clip-path: {clip_path};"></div>
                <!-- Card -->
                <div class="rounded-[9.23px] bg-timeline-bg border-[1.15px] border-timeline-border p-[40px] relative backdrop-blur-md">
                  <h4 class="text-white text-center font-['Clash_Display',sans-serif] text-[18px] mb-4 tracking-wide relative">{item['month']}</h4>
                  <h3 class="text-white font-bold text-[36px] font-['Clash_Display',sans-serif] mb-5 tracking-wide relative">{item['title']}</h3>
                  <p class="text-light-gray font-['Poppins',sans-serif] text-[14px] leading-[26px] relative">
                    {item['desc']}
                  </p>
                </div>
                <!-- Connector Line (Desktop) -->
                <div class="hidden md:block absolute top-[60px] -right-[60px] w-[60px] border-t-[1px] border-dashed border-[#E2DDD0] opacity-50"></div>
              </div>
            </div>
            <!-- Center Dot -->
            <div class="absolute left-[24px] md:left-1/2 top-[50px] w-[20px] h-[20px] rounded-full bg-[{item['dot']}] shadow-[0_0_15px_{item['dot']}80] -translate-x-1/2 z-10"></div>
            <!-- Spacer -->
            <div class="hidden md:block w-full md:w-[calc(50%-60px)]"></div>
          </div>
"""
    else:
        layout = f"""
          <!-- Item (Right) -->
          <div class="flex flex-col md:flex-row justify-between w-full relative group">
            <!-- Spacer -->
            <div class="hidden md:block w-full md:w-[calc(50%-60px)]"></div>
            <!-- Center Dot -->
            <div class="absolute left-[24px] md:left-1/2 top-[50px] w-[20px] h-[20px] rounded-full bg-[{item['dot']}] shadow-[0_0_15px_{item['dot']}80] -translate-x-1/2 z-10"></div>
            <!-- Content -->
            <div class="w-full md:w-[calc(50%-60px)] pl-[60px] md:pl-0 flex justify-start">
              <div class="w-full max-w-[500px] relative">
                <!-- Glowing Half Border -->
                <div class="absolute -inset-[6.92px] rounded-[18.46px] bg-linear-to-bl from-[#E5E0CF] via-[#CF9833] to-transparent pointer-events-none" style="padding: 6.92px; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; clip-path: {clip_path};"></div>
                <!-- Connector Line (Desktop) -->
                <div class="hidden md:block absolute top-[60px] -left-[60px] w-[60px] border-t-[1px] border-dashed border-[#E08C3C] opacity-50"></div>
                <!-- Card -->
                <div class="rounded-[9.23px] bg-timeline-bg border-[1.15px] border-timeline-border p-[40px] relative backdrop-blur-md">
                  <h4 class="text-white text-center font-['Clash_Display',sans-serif] text-[18px] mb-4 tracking-wide relative">{item['month']}</h4>
                  <h3 class="text-white font-bold text-[36px] font-['Clash_Display',sans-serif] mb-5 tracking-wide relative">{item['title']}</h3>
                  <p class="text-light-gray font-['Poppins',sans-serif] text-[14px] leading-[26px] relative">
                    {item['desc']}
                  </p>
                </div>
              </div>
            </div>
          </div>
"""
    timeline_html += layout

timeline_html += """        </div>
      </div>
    </section>
  </body>
</html>
"""

new_content = upper_html + top_creators_html + timeline_html

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
