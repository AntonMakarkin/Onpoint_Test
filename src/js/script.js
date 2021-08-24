const verticalSlider = () => {
    // to get to the top every loading of page
    // get our elements
    const slider = document.querySelector('.vertical_slider'),
    slides = Array.from(document.querySelectorAll('.slide')),
    dots = document.querySelectorAll('.slide_pagination_item');

    let slideHeight = window.getComputedStyle(slides[0]).height,
    height = window.getComputedStyle(slider).height

    // set up our state
    let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID,
    currentIndex = 0

    // add our event listeners
    slides.forEach((slide, index) => {
    slide.addEventListener('dragstart', (e) => e.preventDefault())
    // touch events
    slide.addEventListener('touchstart', touchStart(index))
    slide.addEventListener('touchend', touchEnd)
    slide.addEventListener('touchmove', touchMove)
    // mouse events
    slide.addEventListener('mousedown', touchStart(index))
    slide.addEventListener('mouseup', touchEnd)
    slide.addEventListener('mousemove', touchMove)
    slide.addEventListener('mouseleave', touchEnd)
    })

    const markDots = (dots) => {
        dots.forEach(dot => dot.style.background = '#fff');
        dots[currentIndex].style.background = '#f78b1f';
    }
    markDots(dots)

    const deleteNotDigits = (str) => {
        return +str.replace(/[^.\d]/g, ''); //remove not a number
    }
      
    slideHeight = deleteNotDigits(slideHeight)
    height = deleteNotDigits(height) - slideHeight
      
    function getPositionY(event) {
        return event.type.includes('mouse') ? event.pageY : event.touches[0].clientY
    }
      
    // use a HOF so we have index in a closure
    function touchStart(index) {
        return function (event) {
          currentIndex = index
          startPos = getPositionY(event)
          isDragging = true
          animationID = requestAnimationFrame(animation)
          slider.classList.add('grabbing')
        }
    }
      
    function touchMove(event) {
        if (isDragging) {
          const currentPosition = getPositionY(event)
          currentTranslate = prevTranslate + currentPosition - startPos
        }
    }
      
    function touchEnd() {
        cancelAnimationFrame(animationID)
        isDragging = false
        const movedBy = currentTranslate - prevTranslate
      
        // if moved enough negative then snap to next slide if there is one
        if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1
      
        // if moved enough positive then snap to previous slide if there is one
        if (movedBy > 100 && currentIndex > 0) currentIndex -= 1
      
        setPositionByIndex()
        markDots(dots)
        slider.classList.remove('grabbing')
    }
      
    function animation() {
        setSliderPosition()
        if (isDragging) requestAnimationFrame(animation)
    }
      
    function setPositionByIndex() {
        currentTranslate = currentIndex * -window.innerHeight
        prevTranslate = currentTranslate
        setSliderPosition()
    }
      
    function setSliderPosition() {
        if (currentTranslate > 0) {
          slider.style.transform = `translateY(0px)`
        } else if (currentTranslate < -height) {
          slider.style.transform = `translateY(-${height}px)`
        } else {
          slider.style.transform = `translateY(${currentTranslate}px)`
        }
    }
}

function scrollToTop() {
    scrollTo(0, 0)
}

const horizontalSlider = () => {
    const sliderWrapper = document.querySelector('.horizontal_slider_inner'),
          slideSwinder = document.querySelector('.slider'),
          slide = document.querySelector('.tab')

    let wrapperWidth = window.getComputedStyle(sliderWrapper).width,
        slideWidth = window.getComputedStyle(slide).width

    const deleteNotDigits = (str) => {
        return +str.replace(/[^.\d]/g, ''); //remove not a number
    }

    wrapperWidth = deleteNotDigits(wrapperWidth)
    slideWidth = deleteNotDigits(slideWidth)
    wrapperWidth = wrapperWidth - slideWidth

    let onePercentSliderWidth = wrapperWidth / 100

    slideSwinder.addEventListener('input', (e) => {
        let value = e.target.value,
            move = onePercentSliderWidth * value
        sliderWrapper.style.transform = `translateX(${-move}px)`
    })
}

window.addEventListener('DOMContentLoaded', () => {
    verticalSlider()
    horizontalSlider()
})

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0)
})

window.addEventListener('resize', () => {
    window.scrollTo(0, 0)
    verticalSlider()
    horizontalSlider()
})


