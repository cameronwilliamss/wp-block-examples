<?php
$anchor = !empty($block['anchor']) ? 'id="' . esc_attr($block['anchor']) . '"' : '';
$attributes = wp_kses_data(get_block_wrapper_attributes(['class' => '', 'style' => '']));

$size = get_field('size') ?: 'small';
$background_type = get_field('background_type') ?: 'image';

if ($background_type === 'video') {
    $video = get_field('background_video');
    $mobile_video = get_field('mobile_background_video');
    $poster = get_field('background_video_placeholder');
} else {
    $background = get_field('background_image');
}

$foreground = ($size === 'large') ? get_field('foreground_image') : null;
?>

<?php if ($background_type === 'video' && $poster): ?>
    <link rel="preload" href="<?php echo esc_url($poster['url']); ?>" as="image" fetchpriority="high">
<?php elseif ($background_type === 'image' && $background): ?>
    <link rel="preload" href="<?php echo esc_url($background['url']); ?>" as="image" fetchpriority="high">
<?php endif; ?>

<?php if (!$is_preview): ?>
    <div <?php echo $attributes; ?>>
    <?php endif; ?>

    <div class="wp-block-acf-hero-block__size-<?php echo $size; ?>">

        <?php if ($background_type === 'video' && $video && $poster): ?>
            <video autoplay loop muted playsinline class="wp-block-acf-hero-block__background wp-block-acf-hero-block__background--video" preload="metadata" poster="<?php echo $poster['url']; ?>">
                <?php if ($mobile_video): ?>
                    <source src="<?php echo esc_url($mobile_video['url']); ?>" type="<?php echo $mobile_video['mime_type']; ?>" media="(max-width: 700px)">
                <?php endif; ?>
                <source src="<?php echo esc_url($video['url']); ?>" type="<?php echo $video['mime_type']; ?>">
            </video>
        <?php elseif ($background): ?>
            <img
                srcset="<?php echo esc_attr($background['sizes']['thumbnail']); ?> 600w,
                     <?php echo esc_attr($background['sizes']['medium']); ?> 800w,
                     <?php echo esc_attr($background['sizes']['large']); ?> 2000w"
                sizes="(max-width: 700px) 600px, (max-width: 1100px) 800px, 2000px"
                alt="<?php echo esc_attr($background['alt']); ?>"
                class="wp-block-acf-hero-block__background wp-block-acf-hero-block__background--image skip-lazy"
                loading="eager">
        <?php endif; ?>

        <?php if ($size === 'large'): ?>
            <div class="wp-block-acf-hero-block__content-container">
                <InnerBlocks />
            </div>
            <?php if ($foreground): ?>
                <div class="wp-block-acf-hero-block__foreground">
                    <img src="<?php echo esc_url($foreground['url']); ?>" alt="<?php echo esc_attr($foreground['alt']); ?>" loading="eager">
                </div>
            <?php endif; ?>
        <?php endif; ?>

    </div>

    <?php if (!$is_preview): ?>
    </div>
<?php endif; ?>