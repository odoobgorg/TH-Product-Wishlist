$(document).ready(function () {
$('.oe_website_sale').each(function () {
    var oe_website_sale = this;
	
	function price_to_str(price) {
        price = Math.round(price * 100) / 100;
        var dec = Math.round((price % 1) * 100);
        return price + (dec ? '' : '.0') + (dec%10 ? '' : '0');
    }

	function check_for_variant(product_id) {
	/* FUNCTION TO ADD PRODUCT VARIANT PRODUCT IN WISHLIST */
	    $.ajax({
		url : "/shop/check_for_variant/product_id", 
			data: { product_id: product_id},
		success : function(data) {
			var d = $.parseJSON(data);
			if(d.message){
		           //$("#link_for_variant").val(true);
			   //$("#return_p_id").val(product_id);
			   $("#wishlist_icon").hide();
			   $("#add_to_wishlist").hide();
			}
			else{
			   //$("#link_for_variant").val(false);
			   //$("#return_p_id").val(product_id);
			   $("#wishlist_icon").show();
			   $("#add_to_wishlist").show();
			}
			
		},
		error : function() {
			
		}
	    });
	}
 	
	/* INHERIT FUNCTION TO HIDE ADD TO WISHLIST LINK FOR PRODUCT (IF IT HAS DIFFERNT PRODUCT VARIANT) */
	$(oe_website_sale).on('change', 'input.js_variant_change, select.js_variant_change', function (ev) {
        var $ul = $(this).parents('ul.js_add_cart_variants:first');
        var $parent = $ul.closest('.js_product');
        var $product_id = $parent.find('input.product_id').first();
        var $price = $parent.find(".oe_price:first .oe_currency_value");
        var $default_price = $parent.find(".oe_default_price:first .oe_currency_value");
        var variant_ids = $ul.data("attribute_value_ids");
        var values = [];
        $parent.find('input.js_variant_change:checked, select.js_variant_change').each(function () {
            values.push(+$(this).val());
        });

        $parent.find("label").removeClass("text-muted css_not_available");

        var product_id = false;
        for (var k in variant_ids) {
            if (_.isEmpty(_.difference(variant_ids[k][1], values))) {
                $price.html(price_to_str(variant_ids[k][2]));
                $default_price.html(price_to_str(variant_ids[k][3]));
                if (variant_ids[k][3]-variant_ids[k][2]>0.2) {
                    $default_price.closest('.oe_website_sale').addClass("discount");
                } else {
                    $default_price.closest('.oe_website_sale').removeClass("discount");
                }
                product_id = variant_ids[k][0];
                break;
            }
        }

        if (product_id) {
            var $img = $(this).closest('tr.js_product, .oe_website_sale').find('span[data-oe-model^="product."][data-oe-type="image"] img:first, img.product_detail_img');
            $img.attr("src", "/website/image/product.product/" + product_id + "/image");
            $img.parent().attr('data-oe-model', 'product.product').attr('data-oe-id', product_id)
                .data('oe-model', 'product.product').data('oe-id', product_id);
        }

        $parent.find("input.js_variant_change:radio, select.js_variant_change").each(function () {
            var $input = $(this);
            var id = +$input.val();
            var values = [id];
            $parent.find("ul:not(:has(input.js_variant_change[value='" + id + "'])) input.js_variant_change:checked, select").each(function () {
                values.push(+$(this).val());
                console.log(product_id);
		//alert(product_id);
		result = check_for_variant(product_id);
            });

            for (var k in variant_ids) {
                if (!_.difference(values, variant_ids[k][1]).length) {
                    return;
                }
            }
            $input.closest("label").addClass("css_not_available");
            $input.find("option[value='" + id + "']").addClass("css_not_available");
        });

        if (product_id) {
            $parent.removeClass("css_not_available");
            $product_id.val(product_id);
            $parent.find(".js_check_product").removeAttr("disabled");
        } else {
            $parent.addClass("css_not_available");
            $product_id.val(0);
            $parent.find(".js_check_product").attr("disabled", "disabled");
        }
    });

});
});
