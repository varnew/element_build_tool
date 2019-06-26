<template>
  <canvas v-if="id" :id="id" :width="width" height="26" class="canves">
    Your browser does not support the HTML5 canvas tag.
  </canvas>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      width: this.text.length * 16
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init() {
      const c = document.getElementById(this.id)
      const ctx = c.getContext('2d')
      ctx.font='14px Georgia'
      ctx.font='14px Verdana'
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, c.width / 2, 0)
      gradient.addColorStop('0', 'magenta')
      gradient.addColorStop('0.5', 'blue')
      gradient.addColorStop('1.0', 'red')
      // Fill with gradient
      ctx.fillStyle = gradient
      ctx.fillText(this.text, 0, 20)
    }
  }
}
</script>

<style lang="scss">
  .canves{
    /*position: absolute;*/
    left: 0px;
    right: 0px;
  }
</style>
