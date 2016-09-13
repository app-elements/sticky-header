import mocha from 'steal-mocha';
import plugin from './sticky-header';
import chai from 'chai';
import F from 'funcunit';

const assert = chai.assert;

// QUnit.module('sticky-header');
//
// QUnit.test('Initialized the plugin', function(){
//   QUnit.equal(typeof plugin, 'function');
//   QUnit.equal(plugin(), 'This is the sticky-header plugin');
// });


F.attach(mocha);

describe('sticky-header functional smoke test', function(){
	beforeEach(function(){
		F.open('../development.html');
	});

	it('sticky-header main page shows up', function(){
		F('title').text('sticky-header', 'Title is set');
	});
});
