module.exports = {
  content: ["index.html","./src/**/*.jsx"],
  theme: {
    extend: {
      colors:{
        'almost-black': '#2B3340',
        'almost-white' : '#F5FAFF',
        'user-primary': '#354A67',
        'user-primary-h': '#4b6993',
        'user-secondary':'#667A9A',
        'user-light' : '#DDF2FF',
        'admin-primary' : '#1e1e1e',
        'admin-primary-h' : '#FF995C',
        'admin-secondary' : '#393B40',
        'admin-secondary-h' : '#54575C',
        'admin-light' : '#FAA356',
        'admin-light-h': '#FAB170'

      },
      maxHeight: {
        'dashboard':'60vh',
        'largeDashboard':'80vh',
        'smallDashboard' : '25vh'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['group-hover'],
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar-hide')
  ],
}
