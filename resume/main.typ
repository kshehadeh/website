#import "resume.typ": *

#let data = json("resume.json")

#show: resume.with(
  name: data.name, 
  tagline: data.tagline, 
  email: data.email, 
  phone: data.phone, 
  location: data.location
)

// two-column layout with contact information on the left and social links on the right
#grid(
  columns: (auto, auto, auto),
  align: (left),  
  gutter: 1em,
  icon_and_contact("icons/linkedin.svg", link("https://linkedin.com/in/" + data.linkedin, "@" + data.linkedin)),
  icon_and_contact("icons/github.svg", link("https://github.com/" + data.github, "@" + data.github)),
  icon_and_contact("icons/web.svg", link(data.web, data.web.split("//").at(1)))
)

#block(data.intro)

= Experience

#for company in data.experiences [
  #company-heading(company.company, start: company.start, end: company.end)[
    #for exp in company.experience [
      #let bullets = exp.bullets.map(bullet => bullet.text)
      #job-heading(exp.title, start: exp.duration, list(..bullets))
    ]
  ]
]

= Education

#for school in data.education [
  #school-heading(school.institution, start: school.start, end: school.end)[    
    #degree-heading(school.major, list(..school.awards))
  ]
]