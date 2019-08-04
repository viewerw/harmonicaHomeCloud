<template>
  <form reportSubmit @submit="formSubmit">
    <button form-type="submit" class="btn">
      <slot></slot>
    </button>
  </form>
</template>

<script>
export default {
    methods: {
        formSubmit(e) {
            const { formId } = e.mp.detail;
            if (formId) {
                const formIds = wx.getStorageSync('formIds');
                console.log(formId);
                // the formId is not  a mock one
                if (!/mock/.test(formId)) {
                    const formIdsCalc = formIds ? formIds.concat(formId) : [formId];
                    wx.setStorage({
                        key: 'formIds',
                        data: formIdsCalc,
                    });
                }
            }
        },
    },
};
</script>

<style lang = "less" scoped>
.btn {
    font-size: initial;
    text-align: initial;
    color: initial;
    display: inline;
    margin: 0;
    padding: 0;
    background: transparent;
    overflow: visible;
    border: none;
    line-height: initial;

    &::after {
        border: none;
    }
}
</style>
