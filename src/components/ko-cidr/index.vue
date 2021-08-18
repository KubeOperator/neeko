<template>
  <div>
    <el-select filterable @change="onPart1Change()" style="width: 15%" v-model="Parts[0]" clearable>
      <el-option v-for="item of Part1Options" :key="item" :value="item">{{item}}</el-option>
    </el-select>
    <span> . </span>
    <el-select filterable :disabled="Part2Options.length < 2" @change="getCidr()" style="width: 15%" v-model="Parts[1]" clearable>
      <el-option v-for="item of Part2Options" :key="item" :value="item">{{item}}</el-option>
    </el-select>
    <span> . </span>
    <el-select filterable :disabled="Part3Options.length < 2" @change="getCidr()" style="width: 15%" v-model="Parts[2]" clearable>
      <el-option v-for="item of Part3Options" :key="item" :value="item">{{item}}</el-option>
    </el-select>
    <span> . </span>
    <el-select filterable style="width: 15%" disabled v-model="Parts[3]" clearable>
      <el-option value="0">0</el-option>
    </el-select>
    <span> / </span>
    <el-select filterable @change="onPart5Change" style="width: 15%" v-model="Parts[4]" clearable>
      <el-option v-for="item of MaskOptions" :key="item" :value="item">{{item}}</el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "BackButton",
  props: {
    cidr: String,
    cidrType: String,
    maxNodePodNum: Number,
  },
  watch: {
    cidr: {
      handler(newVal) {
        if (newVal) {
          this.Parts = newVal.split(/[.]|[/]/)
          if(this.isFirst) {
            this.onPart1Change()
            this.isFirst = false
          }
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      Part1Options: ["192", "172", "10"],
      Part2Options: [],
      Part3Options: [],
      Parts: [],
      MaskOptions: [],
      Cidr: "",
      isFirst: true,
    }
  },
  methods: {
    onPart1Change() {
      switch (this.Parts[0]) {
        case "192":
          this.Part2Options = ["168"]
          this.Parts[1] = "168"
          this.MaskOptions = this.cidrType === "pod" ? ["16", "17", "18", "19"] : ["16", "17", "18", "19", "20", "21", "22", "23", "24"]
          this.Parts[4] = "16"
          this.handleUpdate("192", "16", "")
          break
        case "172":
          this.MaskOptions = this.cidrType === "pod" ? ["16", "17", "18", "19"] : ["16", "17", "18", "19", "20", "21", "22", "23", "24"]
          this.Parts[4] = "16"
          this.handleUpdate("172", "16", "")
          break
        case "10":
          this.MaskOptions = this.cidrType === "pod" ? ["14", "15", "16", "17", "18", "19"] : ["14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"]
          this.Parts[4] = "14"
          this.handleUpdate("10", "14", "")
          break
      }
    },
    onPart5Change(val) {
      this.handleUpdate(this.Parts[0], val, "")
    },
    handleUpdate(period, mask, cidr) {
      let order = Math.ceil(parseInt(mask) / 8),
        digit = parseInt(mask) % 8,
        field2 = "",
        field2Range = [],
        field3 = 0,
        field3Range = []
      if (digit === 0) {
        digit = 8
      }
      let parts = []
      if (cidr) {
        parts = cidr.split(/.|\//)
      }
      if (period === "192") {
        if (order >= 3) {
          field2 = parts[1] || "168"
          field2Range = ["168"]
          field3Range = this.computerRange(digit, 0, 256)
          field3 = parts[2] || field3Range[0]
        } else {
          field2 = parts[1] || "168"
          field2Range = ["168"]
          field3 = parts[2] || "0"
          field3Range = ["0"]
        }
      } else if (period === "172") {
        if (order >= 3) {
          field2Range = this.computerRange(8, 16, 16)
          //去除172.17网段
          let cIndex = field2Range.indexOf("17")
          if (cIndex > -1) {
            field2Range.splice(cIndex, 1)
          }

          field2 = parts[1] || field2Range[0]
          field3Range = this.computerRange(digit, 0, 256)
          field3 = parts[2] || field3Range[0]
        } else {
          field2Range = this.computerRange(digit, 16, 16)
          //去除172.17网段
          let cIndex = field2Range.indexOf("17")
          if (cIndex > -1) {
            field2Range.splice(cIndex, 1)
          }
          field2 = parts[1] || field2Range[0]
          field3 = parts[2] || "0"
          field3Range = ["0"]
        }
      } else if (period === "10") {
        if (order >= 3) {
          field2Range = this.computerRange(8, 0, 256)
          field2 = parts[1] || field2Range[0]
          field3Range = this.computerRange(digit, 0, 256)
          field3 = parts[2] || field3Range[0]
        } else {
          field2Range = this.computerRange(digit, 0, 256)
          field2 = parts[1] || field2Range[0]
          field3 = parts[2] || "0"
          field3Range = ["0"]
        }
      }
      this.Parts[1] = field2
      this.Part2Options = field2Range
      this.Parts[2] = field3
      this.Part3Options = field3Range
      this.getCidr()
    },
    computerRange(digit, min, max) {
      let base = Math.pow(2, 8 - digit),
        range = []
      for (let i = 0; i < max >> (8 - digit); i++) {
        range.push(min + i * base + "")
      }
      return range
    },
    getCidr() {
      this.Cidr = this.Parts[0] + "." + this.Parts[1] + "." + this.Parts[2] + "." + this.Parts[3] + "/" + this.Parts[4]
      this.transmitToParent()
    },
    transmitToParent() {
      this.$emit("cidrChange", this.cidrType, this.Cidr)
    },
  },
}
</script>