# ThemeJekyll
## Search and find free, open source Jekyll themes.

### Adding a theme

1. Fork this repo.
2. Create up to 5 screenshots and put them in assets/screenshots/theme-name.
3. Create a resized version of the main screenshot (to be used as the theme's thumbnail) saved as assets/screenshots/theme-name/thumbnail.jpg
4. Copy theme-template.md from the repository root into _themes and rename it as theme-name.md
5. Edit the YAML data in the file to reflect your theme (see below).
6. Submit a pull request!

### Screenshots

Screenshots must be 1366x768 pixels and saved as a JPG.  Use Firefox's Responsive Design Mode to get the size exact.

The thumbnail screenshot must be resized to 640x360 at 85% quality and saved to assets/screenshots/theme-name/thumbnail.jpg

GIMP or ImageMagick can convert and resize the screenshots and thumbnail.

### YAML Data

| Key  | Description | Possible Values |
| ------------- | ------------- | ------------- |
| title  | The theme's title.  | |
| date  | The current date.  | Use YYYY-MM-DD format. |
| license  | The theme's license.  | Use an <a href="https://spdx.org/licenses/"> SPDX identifier</a> when possible. |
| license_link  | A link to the license.  | A file in the theme's repository or <a href="https://spdx.org/licenses/">SPDX link</a> is recommended. |
| homepage  | The theme's homepage.  | Use the GitHub repository if none is available. |
| github  | The theme maintainer's GitHub username.  | |
| repository  | The theme's repository name. | |
| gem | The Gem name if the theme is published on RubyGems.  If not, remove this line.  | |
| demo  | A link to the theme's demo website.  | |
| download  | A direct link to download the theme. | |
| screenshots | The list of screenshot filenames stored at assets/screenshots/theme-name. | |
| description | A short description of the theme.  | |
| features | A list of features the theme supports.  | See the current list on the <a href="https://themejekyll.github.io/themes">ThemeJekyll website</a>.  You are also welcome to request a new one by adding it here. |
| categories | A list of categories the theme fits in. | Generally follows WordPress categories.  See the current list on the <a href="https://themejekyll.github.io/themes">ThemeJekyll website</a>. |
| layouts | A list of layouts the theme supports. | 1 Column, 2 Column, 3 Column, 4 Column, Grid |
| tags | A list of tags for the theme. | See the <a href="https://themejekyll.github.io/themes">ThemeJekyll website</a>. |

### Theme Requirements

Themes must meet the following requirements to be accepted into ThemeJekyll:

1. Works with Jekyll 3.0+
2. Is activly maintained.
3. Has a GitHub repository.
4. Has an open source license.
5. Has a working demo.  (*Please create a **real** demo, don't just use your personal blog.*)
