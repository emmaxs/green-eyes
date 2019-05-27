%% go through ground truth files and sort labeled GT images 
% into positive and negative directories
% ground truth label files are matfiles with (n_photos,1) vectors
% with 1 if the attribute isnt present in the photograph and 2 if it is.
% photos and matfiles from https://purl.stanford.edu/tb980qz1002

clear all;

%% set up variables
%GT_image_dir = lessleys_path;
%target_master_dir = lessleys_path;
%matfile_dir_name = lessleys_path;


GT_labels = ["black", "blue", "brown", "category", "collar", "cyan", ...
    "gender", "gray", "green", "many_colors", "neckline", "necktie", ...
    "pattern_floral", "pattern_graphics", "pattern_plaid", "pattern_solid",...
    "pattern_spot", "pattern_stripe", "placket", "purple", "red", "scarf",...
    "skin_exposure", "sleeve_length", "white", "yellow"];
num_labels = numel(GT_labels);
num_imgs = 1856;uncomment this and delete following line
%num_imgs = 10;

for this_label = 1:num_labels
    label = GT_labels(this_label);
    pos_dir = strcat(label,"_positive_GT");
    neg_dir = strcat(label, "_negative_GT");
    label_mat = load(strcat(label, "_GT.mat"));
    mkdir(target_master_dir, pos_dir);
    mkdir(target_master_dir, neg_dir);
    
    for img = 1:num_imgs
        img_file = strcat(GT_image_dir, sprintf('/%06d',img),".jpg")
        if label_mat(img) == 1
            copyfile(img_file, neg_dir);
        elseif label_mat(img) == 2
            copyfile(img_file, pos_dir);
        end
    end
end
    
    
