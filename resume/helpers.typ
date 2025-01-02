#import "constants.typ":*

#let icon_and_contact(icon, content) = {
  grid(
    columns: 2,
    align: center+horizon,
    gutter: COMPANY_ICON_SPACING,

    box(
      height: HEADER_ICON_HEIGHT,
      width: auto,
      image(icon)
    ),
    text(content, size: 0.8em)
  )
}

#let hrule(stroke: 1pt + black, below: 0em) = {
  block(
    above: HRULE_HEIGHT,
    below: below,
    breakable: false,
    line(length: 100%, stroke: stroke)
  )
}
