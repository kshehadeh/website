#import "constants.typ": *
#import "helpers.typ": *
#import "state.typ": __get, __set

// Main resume function
#let resume(
  name: "YOUR NAME HERE",
  tagline: none,
  paper: "us-letter",
  heading-font: HEADING_FONT,
  body-font: BODY_FONT,
  body-size: BODY_SIZE,
  email: none,
  phone: none,
  location: none,
  linkedin-username: none,
  github-username: none,
  web: none,
  keywords: "",
  thumbnail: none, // check out https://qrframe.kylezhe.ng/ for QR code generation
  body
) = {
  // Document setup, mostly metadata in a PDF
  set document(
    title: "Résumé of " + name,
    author: name,
    keywords: keywords,
  )

  // Page setup, including header and footer
  set page(
    paper: paper,
    margin: PAGE_MARGIN,
    numbering: "1 / 1",
    header: context {
      if here().page() == 1 {
        text(
          size: HEADER_SIZE,
          grid(
            columns: (1fr, auto, auto, auto, auto, auto),
            gutter: 1em,
            align: center+horizon,
            "",
            icon_and_contact("icons/email.svg", link("mailto:" + email, email)),
            sym.divides,
            icon_and_contact("icons/phone.svg", link("tel:" + phone, phone)),
            sym.divides,
            icon_and_contact("icons/location.svg", location)
          )
        )
      }
    },
    footer: context {
      let multi_page = counter(page).final().first() > 1
      let date = datetime.today().display("[month repr:long] [day], [year]")
      text(size: FOOTER_SIZE, weight: FOOTER_TEXT_WEIGHT, font: heading-font)[
        #grid(
          columns: (1fr, 1fr, 1fr),
          align: (left, center, right + horizon),
          // left column
          [Last updated: #date],
          // center column
          if multi_page { counter(page).display(both: true, "1 of 1") },
          // right column
          if thumbnail != none {
            move(dy: -0.25in, box(height: 0.5in, thumbnail))
          } else {
            [ ]
          }
        )
      ]
    },
  )

  // Global text settings
  set text(font: body-font, size: body-size, weight: BODY_WEIGHT, fallback: true)
  set par(justify: true)
  set par(leading: 1em)


  // Heading styles
  set heading(numbering: "I.A.")
  show heading.where(level: 1): it => {
    block(
      above: SECTION_HEADING_SPACE_ABOVE,
      below: SECTION_HEADING_SPACE_BELOW,
      breakable: false,
      [
        #text(size: SECTION_HEADING_SIZE, weight: SECTION_HEADING_WEIGHT, font: heading-font)[          
          #upper(it.body)
        ]
        #hrule(stroke: SECTION_HEADING_HRULE_STROKE)
      ]
    )
  }

  // Table style
  set table(
    stroke: none,
    fill: (x, y) => {
      if y == 0 {
        TABLE_HEADER_COLOR
      } else if calc.rem(y, 2) == 0 {
        TABLE_ZEBRA_COLOR_0
      } else {
        TABLE_ZEBRA_COLOR_1
      }
    },
  )

  // Save our settings needed in other functions
  __set("heading-font", heading-font)

  // Main Headline
  text(size: HEADLINE_NAME_SIZE, weight: HEADLINE_NAME_WEIGHT, font: heading-font)[#smallcaps(name)]
  h(1fr)
  text(size: TAGLINE_SIZE, style: TAGLINE_STYLE, weight: TAGLINE_WEIGHT)[#tagline]
  hrule(stroke: HEADLINE_HRULE_STROKE, below: 1em)

  // The rest of the content
  body
}

// Alias resume to cv for non-Americans
#let cv = resume

#let company-heading(name, start: none, end: none, icon: none, body) = {
  let icon_spacing = if icon != none { COMPANY_ICON_SPACING } else { 0em }
  block(
    above: 1.5em,
    below: COMPANY_BLOCK_BELOW,
    breakable: true,
    

    grid(
      columns: (auto, auto, 1fr, auto),
      column-gutter: (icon_spacing, 0.5em),
      row-gutter: 1em,
      align: (left + horizon, left + horizon, right + horizon),

      // first column, optional icon
      if icon != none { box(height: COMPANY_ICON_SIZE, icon) },

      // second column, company name
      context text(
        weight: COMPANY_NAME_WEIGHT,
        size: COMPANY_NAME_SIZE,
        font: __get("heading-font"),        
        name
      ),


      // third column, dots
      if start != none {
        repeat(h(0.3em) + "." + h(0.3em))
      } else {
        []
      },

      // fourth column, optional dates
      context text(
        weight: COMPANY_DATE_WEIGHT,
        size: COMPANY_DATE_SIZE,
        font: __get("heading-font"),

        if start != none {
          [#start -- #end]
        } else {
          [ ]
        }
      ),

      // second row, company content
      grid.cell(colspan: 4, body)
    )
  )
}

// Alias to school heading
#let school-heading = company-heading

#let job-heading(title, location: none, start: none, end: none, domain: none, comment: none, body) = {
  block(
    above: JOB_BLOCK_ABOVE,
    below: JOB_BLOCK_BELOW,
    breakable: true,

    // heading
    grid(
      columns: (auto, auto, auto, auto, 1fr, auto),
      gutter: 1em,
      align: (left + horizon, right + horizon),

      // first column, title
      context text(
        style: "normal",
        weight: JOB_NAME_WEIGHT,
        size: JOB_NAME_SIZE,
        fill: gray.darken(50%),        
        font: __get("heading-font"),
        title
      ),


      // domain
      if domain != none {
        context box(
          fill: black,
          outset: 0.2em,
          inset: 0.2em,
          radius: 0.2em,
          text(
            weight: "light",
            size: 0.7em,
            fill: white,
            font: __get("heading-font"),
            domain
          )
        )
      },

      // job comment ellipsisd
      if comment != none { [ ... ] },

      // job comment ellipsis
      if comment != none { [ #comment ] },

      // fourth column, hfill
      h(1fr),

      // fifth column, optional location
      context text(
        style: JOB_LOCATION_STYLE,
        weight: JOB_LOCATION_WEIGHT,
        size: JOB_LOCATION_SIZE,
        font: __get("heading-font"),

        if location != none and start != none {
          [#location#[;] #h(0.25em)#start#if end != none [ -- #end]]
        } else if location != none {
          location
        } else if start != none {
          [#start#if end != none [ -- #end]]
        }
      ),

      grid.cell(colspan: 6, body)
    )
  )
}

// Alias to degree heading
#let degree-heading = job-heading
