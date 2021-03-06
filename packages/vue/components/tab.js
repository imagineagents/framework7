import events from '../utils/events';
import f7 from '../utils/f7';
import Utils from '../utils/utils';
import Mixins from '../utils/mixins';
import __vueComponentSetState from '../runtime-helpers/vue-component-set-state.js';
import __vueComponentDispatchEvent from '../runtime-helpers/vue-component-dispatch-event.js';
import __vueComponentProps from '../runtime-helpers/vue-component-props.js';
export default {
  name: 'f7-tab',
  props: {
    id: [
      String,
      Number
    ],
    tabActive: Boolean,
    ...Mixins.colorProps
  },
  data() {
    const props = __vueComponentProps(this);
    const state = (() => {
      return { tabContent: null };
    })();
    return { state };
  },
  render() {
    const _h = this.$createElement;
    const self = this;
    const props = self.props;
    const {tabActive, id, className, style} = props;
    const tabContent = self.state.tabContent;
    const classes = Utils.classNames(className, 'tab', { 'tab-active': tabActive }, Mixins.colorClasses(props));
    let TabContent;
    if (tabContent)
      TabContent = tabContent.component;
    {
      return _h('div', {
        style: style,
        ref: 'el',
        class: classes,
        attrs: { id: id }
      }, [tabContent ? _h(TabContent, {
          key: tabContent.id,
          props: tabContent.props
        }) : this.$slots['default']]);
    }
  },
  created() {
    this.onTabShowBound = this.onTabShow.bind(this);
    this.onTabHideBound = this.onTabHide.bind(this);
  },
  updated() {
    const self = this;
    if (!self.routerData)
      return;
    events.emit('tabRouterDidUpdate', self.routerData);
  },
  beforeDestroy() {
    const self = this;
    const el = self.$refs.el;
    if (el) {
      el.removeEventListener('tab:show', self.onTabShowBound);
      el.removeEventListener('tab:hide', self.onTabHideBound);
    }
    if (!self.routerData)
      return;
    f7.routers.tabs.splice(f7.routers.tabs.indexOf(self.routerData), 1);
    self.routerData = null;
    delete self.routerData;
  },
  mounted() {
    const self = this;
    const el = self.$refs.el;
    if (el) {
      el.addEventListener('tab:show', self.onTabShowBound);
      el.addEventListener('tab:hide', self.onTabHideBound);
    }
    self.setState({ tabContent: null });
    self.$f7ready(() => {
      self.routerData = {
        el,
        component: self
      };
      f7.routers.tabs.push(self.routerData);
    });
  },
  methods: {
    show(animate) {
      if (!this.$f7)
        return;
      this.$f7.tab.show(this.$refs.el, animate);
    },
    onTabShow(e) {
      this.dispatchEvent('tab:show tabShow', e);
    },
    onTabHide(e) {
      this.dispatchEvent('tab:hide tabHide', e);
    },
    dispatchEvent(events, ...args) {
      __vueComponentDispatchEvent(this, events, ...args);
    },
    setState(updater, callback) {
      __vueComponentSetState(this, updater, callback);
    }
  },
  computed: {
    props() {
      return __vueComponentProps(this);
    }
  }
};