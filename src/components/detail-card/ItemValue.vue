<script type="text/jsx">
export default {
  name: 'ItemValue',
  props: {
    value: {
      type: [String, Number, Function, Array, Object, Boolean],
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    },
    formatter: {
      type: Function,
      default: null
    }
  },
  methods: {
    toChoicesDisplay(value) {
      if (!value) {
        return this.$t('common.No')
      }
      return this.$t('common.Yes')
    }
  },
  render() {
    if (typeof this.formatter === 'function') {
      return this.formatter(this.item, this.value)
    }
    if (typeof this.value === 'boolean') {
      return <span>{this.toChoicesDisplay(this.value)}</span>
    }
    return <span>{this.value}</span>
  }
}
</script>

<style scoped>

</style>
