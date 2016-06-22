import React from "react";
import cx from "classnames";

import RangeSlider from "./range-slider";


class RangeFacet extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			value: props.value
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ value: nextProps.value });
	}


	facetsToRange() {
		const { facets } = this.props;

		return facets
			.filter((facet, i) => i % 2 === 0)
			.map((v) => parseInt(v))
			.sort((a, b) => a > b)
			.filter((a, i, me) => i === 0 || i === me.length - 1);
	}

	onRangeChange(range) {
		const bounds = this.facetsToRange();
		const lowerBound = bounds[0];
		const upperBound = bounds[1];
		const realRange = upperBound - lowerBound;


		const newState = {
			value: [ Math.floor(range.lowerLimit * realRange) + lowerBound, Math.floor(range.upperLimit * realRange) + lowerBound]
		};

		if(range.refresh) {
			this.props.onChange(this.props.field, newState.value);
		} else {
			this.setState(newState);
		}
	}


	getPercentage(range, value) {
		let lowerBound = range[0];
		let upperBound = range[1];
		let realRange = upperBound - lowerBound;

		let atRange = value - lowerBound;
		return atRange / realRange;
	}

	render() {
		const { label, field, bootstrapCss } = this.props;
		const { value } = this.state;


		const range = this.facetsToRange();

		const filterRange = value.length > 0 ? value : range;


		return (
			<li className={cx("range-facet", {"list-group-item": bootstrapCss})} id={`solr-range-facet-${field}`}>
				<header>
					<h3>
						{label}
						<button className={cx({"btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, "pull-right": bootstrapCss})}
							onClick={() => this.props.onChange(field, [])}>
							&#x274c;
						</button>
					</h3>
				</header>
				<RangeSlider lowerLimit={this.getPercentage(range, filterRange[0])} onChange={this.onRangeChange.bind(this)} upperLimit={this.getPercentage(range, filterRange[1])} />
				<label>{filterRange[0]}</label>
				<label>{filterRange[1]}</label>
			</li>
		);
	}
}

RangeFacet.defaultProps = {
	value: []
};

RangeFacet.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	facets: React.PropTypes.array.isRequired,
	field: React.PropTypes.string.isRequired,
	label: React.PropTypes.string,
	onChange: React.PropTypes.func,
	value: React.PropTypes.array
};

export default RangeFacet;